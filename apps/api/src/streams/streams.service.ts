import { Injectable, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { createAnonSession } from '../common/anon';
import { pubsub, TOPIC_HIERARCHY_UPDATED, TOPIC_STREAM_UPDATED } from '../common/graphql-pubsub';

type Limits = {
  directViewerLimit: number;
  childStreamerLimit: number;
  childViewerLimit: number;
};

@Injectable()
export class StreamsService implements OnModuleInit, OnModuleDestroy {
  private readonly limits: Limits;
  private readonly stalePeerSeconds: number;
  private pruneTimer: NodeJS.Timeout | null = null;
  private readonly config: ConfigService;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    this.config = config;
    this.limits = {
      directViewerLimit: Number(config.get('DIRECT_VIEWER_LIMIT') ?? 4),
      childStreamerLimit: Number(config.get('CHILD_STREAMER_LIMIT') ?? 2),
      childViewerLimit: Number(config.get('CHILD_VIEWER_LIMIT') ?? 4),
    };
    this.stalePeerSeconds = Number(config.get('STALE_PEER_SECONDS') ?? 30);
  }

  onModuleInit() {
    // Best-effort: prune stale viewers periodically (helps with abrupt tab closes / network drops).
    this.pruneTimer = setInterval(() => {
      this.pruneStaleAcrossLiveStreams().catch(() => {});
    }, 15_000);
  }

  onModuleDestroy() {
    if (this.pruneTimer) clearInterval(this.pruneTimer);
    this.pruneTimer = null;
  }

  async getByUuid(uuid: string) {
    const stream = await this.prisma.stream.findUnique({ where: { uuid } });
    if (!stream || stream.removed) throw new NotFoundException('Stream not found');
    return stream;
  }

  async listLive(sort: 'viewers' | 'recent', search?: string) {
    const where = {
      status: 'live' as const,
      removed: false,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              { description: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    // naive viewer count derived from positions excluding stage 0
    const streams = await this.prisma.stream.findMany({
      where,
      orderBy: { start_time: 'desc' },
      take: 100,
    });

    if (sort === 'recent') return streams;

    const withCounts = await Promise.all(
      streams.map(async (s) => {
        const viewers = await this.prisma.streamPosition.count({
          where: { stream_id: s.id, NOT: { stage: 0 } },
        });
        return { stream: s, viewers };
      }),
    );

    return withCounts.sort((a, b) => b.viewers - a.viewers).map((x) => x.stream);
  }

  async listPast(sort: 'recent', search?: string) {
    const where = {
      status: 'past' as const,
      removed: false,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              { description: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };
    return await this.prisma.stream.findMany({
      where,
      orderBy: { end_time: 'desc' },
      take: 200,
    });
  }

  async createStream(input: {
    title: string;
    description: string;
    thumbnailUrl?: string | null;
    anon?: {
      anon_id: string;
      anon_text_color: string;
      anon_background_color: string;
    };
  }) {
    const anon = input.anon ?? createAnonSession();
    const uuid = randomUUID();
    const hostToken = randomUUID();
    const stream = await this.prisma.stream.create({
      data: {
        uuid,
        host_token: hostToken,
        start_time: new Date(),
        end_time: null,
        anon_id: anon.anon_id,
        anon_text_color: anon.anon_text_color,
        anon_background_color: anon.anon_background_color,
        title: input.title,
        description: input.description,
        status: 'live',
        removed: false,
        fileUrls: [],
        thumbnailUrl: input.thumbnailUrl ?? null,
      },
    });

    // stage 0 reserved for streamer
    await this.prisma.streamPosition.create({
      data: {
        stream_id: stream.id,
        stage: 0,
        peer_id: `streamer-${stream.uuid}`,
        parents: [],
        children: [],
        last_seen: new Date(),
      },
    });

    await pubsub.publish(TOPIC_STREAM_UPDATED, { streamUpdated: stream });
    await this.publishHierarchy(stream.id, stream.uuid);
    return { stream, hostToken };
  }

  async endStream(uuid: string) {
    const stream = await this.getByUuid(uuid);
    const updated = await this.prisma.stream.update({
      where: { id: stream.id },
      data: {
        status: 'processing',
        end_time: new Date(),
      },
    });
    await pubsub.publish(TOPIC_STREAM_UPDATED, { streamUpdated: updated });
    return updated;
  }

  async endStreamAsHost(uuid: string, hostToken: string) {
    const stream = await this.prisma.stream.findUnique({ where: { uuid } });
    if (!stream) throw new NotFoundException('Stream not found');
    if (!stream.host_token || stream.host_token !== hostToken) {
      throw new NotFoundException('Stream not found'); // avoid leaking existence
    }
    return await this.endStream(uuid);
  }

  async markPast(uuid: string, fileUrls: string[]) {
    const stream = await this.getByUuid(uuid);
    const updated = await this.prisma.stream.update({
      where: { id: stream.id },
      data: {
        status: 'past',
        fileUrls,
      },
    });
    await pubsub.publish(TOPIC_STREAM_UPDATED, { streamUpdated: updated });
    return updated;
  }

  async removeStream(uuid: string) {
    const stream = await this.getByUuid(uuid);
    const updated = await this.prisma.stream.update({
      where: { id: stream.id },
      data: { removed: true },
    });
    await pubsub.publish(TOPIC_STREAM_UPDATED, { streamUpdated: updated });
    return updated;
  }

  async setThumbnail(uuid: string, thumbnailUrl: string | null) {
    const stream = await this.getByUuid(uuid);
    const updated = await this.prisma.stream.update({
      where: { id: stream.id },
      data: {
        thumbnailUrl,
      },
    });
    await pubsub.publish(TOPIC_STREAM_UPDATED, { streamUpdated: updated });
    return updated;
  }

  async joinStream(uuid: string, peerId: string) {
    const stream = await this.getByUuid(uuid);
    const created = await this.prisma.streamPosition.upsert({
      where: { stream_id_peer_id: { stream_id: stream.id, peer_id: peerId } },
      update: { last_seen: new Date() },
      create: {
        // stage is recomputed; create temporary placeholder
        stream_id: stream.id,
        stage: 999,
        peer_id: peerId,
        parents: [],
        children: [],
        last_seen: new Date(),
      },
    });

    await this.pruneStaleForStreamId(stream.id);
    await this.recomputeHierarchy(stream.id);
    await this.publishHierarchy(stream.id, stream.uuid);

    return created;
  }

  async leaveStream(uuid: string, peerId: string) {
    const stream = await this.getByUuid(uuid);
    await this.prisma.streamPosition.deleteMany({
      where: { stream_id: stream.id, peer_id: peerId, NOT: { stage: 0 } },
    });
    await this.pruneStaleForStreamId(stream.id);
    await this.recomputeHierarchy(stream.id);
    await this.publishHierarchy(stream.id, stream.uuid);
    return true;
  }

  async heartbeat(uuid: string, peerId: string) {
    const stream = await this.getByUuid(uuid);
    await this.prisma.streamPosition.updateMany({
      where: { stream_id: stream.id, peer_id: peerId },
      data: { last_seen: new Date() },
    });
    // If peers expired since last tick, prune + re-publish.
    const changed = await this.pruneStaleForStreamId(stream.id);
    if (changed) {
      await this.recomputeHierarchy(stream.id);
      await this.publishHierarchy(stream.id, stream.uuid);
    }
    return true;
  }

  async getPositions(uuid: string) {
    const stream = await this.getByUuid(uuid);
    return await this.prisma.streamPosition.findMany({
      where: { stream_id: stream.id },
      orderBy: [{ stage: 'asc' }, { id: 'asc' }],
    });
  }

  private async publishHierarchy(streamId: number, streamUuid: string) {
    const positions = await this.prisma.streamPosition.findMany({
      where: { stream_id: streamId },
      orderBy: [{ stage: 'asc' }, { id: 'asc' }],
    });
    await pubsub.publish(TOPIC_HIERARCHY_UPDATED, {
      hierarchyUpdated: {
        streamUuid,
        positions,
      },
    });
  }

  /**
   * MVP approach: recompute a reasonable waterfall hierarchy from scratch.
   * - stage 0: streamer (already exists)
   * - stage 1: up to DIRECT_VIEWER_LIMIT viewers connect directly to stage 0
   * - stage >=2: viewers connect to CHILD_STREAMER_LIMIT parents from previous stages,
   *   honoring CHILD_VIEWER_LIMIT children per parent.
   */
  private async recomputeHierarchy(streamId: number) {
    const positions = await this.prisma.streamPosition.findMany({
      where: { stream_id: streamId },
      orderBy: [{ stage: 'asc' }, { id: 'asc' }],
    });

    const streamer = positions.find((p) => p.stage === 0);
    if (!streamer) return;

    const viewers = positions.filter((p) => p.stage !== 0);
    const viewerPeerIds = viewers.map((v) => v.peer_id);

    // Reset all viewer connections
    const newState = new Map<
      string,
      { stage: number; parents: string[]; children: string[] }
    >();
    for (const peerId of viewerPeerIds) {
      newState.set(peerId, { stage: 999, parents: [], children: [] });
    }
    // streamer children rebuilt too
    let streamerChildren: string[] = [];

    // stage 1
    const stage1 = viewerPeerIds.slice(0, this.limits.directViewerLimit);
    for (const v of stage1) {
      newState.get(v)!.stage = 1;
      newState.get(v)!.parents = [streamer.peer_id];
    }
    streamerChildren = stage1.slice();

    // stages >=2
    let remaining = viewerPeerIds.slice(stage1.length);
    let stage = 2;

    // helper: pick parents from earlier stages with available slots
    const childrenCount = (peerId: string) =>
      (peerId === streamer.peer_id
        ? streamerChildren.length
        : newState.get(peerId)?.children.length ?? 0);

    while (remaining.length > 0) {
      const stageViewers: string[] = [];

      // candidates: all viewers already assigned to any stage < current, plus stage1
      const candidateParents = [
        ...stage1,
        ...Array.from(newState.entries())
          .filter(([id, s]) => s.stage >= 1 && s.stage < stage)
          .map(([id]) => id),
      ].filter((v, idx, arr) => arr.indexOf(v) === idx);

      // available parents are those with < CHILD_VIEWER_LIMIT children
      const availableParents = candidateParents.filter(
        (p) => childrenCount(p) < this.limits.childViewerLimit,
      );

      if (availableParents.length === 0) {
        // if no capacity anywhere, push everyone to a new stage anyway with no parents (clients will handle)
        for (const v of remaining) {
          newState.get(v)!.stage = stage;
          newState.get(v)!.parents = [];
          stageViewers.push(v);
        }
        remaining = [];
        break;
      }

      // assign one-by-one, each viewer gets up to CHILD_STREAMER_LIMIT parents
      while (remaining.length > 0) {
        const viewer = remaining[0];

        // choose parents randomly among those with remaining capacity
        const parents = this.pickRandomDistinct(
          availableParents,
          this.limits.childStreamerLimit,
        );

        if (parents.length === 0) break;

        newState.get(viewer)!.stage = stage;
        newState.get(viewer)!.parents = parents;
        stageViewers.push(viewer);
        remaining = remaining.slice(1);

        // update parent children
        for (const p of parents) {
          if (p === streamer.peer_id) {
            streamerChildren.push(viewer);
          } else {
            newState.get(p)!.children.push(viewer);
          }
        }

        // refresh available parents for next assignment
        for (let i = availableParents.length - 1; i >= 0; i--) {
          if (childrenCount(availableParents[i]) >= this.limits.childViewerLimit) {
            availableParents.splice(i, 1);
          }
        }
      }

      stage += 1;
    }

    // Persist computed stages/edges
    await this.prisma.streamPosition.update({
      where: { id: streamer.id },
      data: { children: streamerChildren, parents: [] },
    });

    await Promise.all(
      viewerPeerIds.map(async (peerId) => {
        const row = viewers.find((v) => v.peer_id === peerId);
        if (!row) return;
        const s = newState.get(peerId)!;
        await this.prisma.streamPosition.update({
          where: { id: row.id },
          data: { stage: s.stage, parents: s.parents, children: s.children },
        });
      }),
    );
  }

  private pickRandomDistinct<T>(items: T[], n: number): T[] {
    if (n <= 0) return [];
    const arr = items.slice();
    // Fisher–Yates shuffle (partial)
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, Math.min(n, arr.length));
  }

  private async pruneStaleForStreamId(streamId: number): Promise<boolean> {
    const cutoff = new Date(Date.now() - this.stalePeerSeconds * 1000);
    const res = await this.prisma.streamPosition.deleteMany({
      where: {
        stream_id: streamId,
        NOT: { stage: 0 },
        last_seen: { lt: cutoff },
      },
    });
    return res.count > 0;
  }

  private async pruneStaleAcrossLiveStreams() {
    const cutoff = new Date(Date.now() - this.stalePeerSeconds * 1000);
    const live = await this.prisma.stream.findMany({
      where: { status: 'live', removed: false },
      select: { id: true, uuid: true },
      take: 200,
    });
    for (const s of live) {
      const res = await this.prisma.streamPosition.deleteMany({
        where: { stream_id: s.id, NOT: { stage: 0 }, last_seen: { lt: cutoff } },
      });
      if (res.count > 0) {
        await this.recomputeHierarchy(s.id);
        await this.publishHierarchy(s.id, s.uuid);
      }
    }
  }
}


