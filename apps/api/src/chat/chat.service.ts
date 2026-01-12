import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { createAnonSession } from '../common/anon';
import { pubsub, TOPIC_CHAT_MESSAGE_ADDED } from '../common/graphql-pubsub';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async listMessages(streamUuid: string) {
    const stream = await this.prisma.stream.findUnique({ where: { uuid: streamUuid } });
    if (!stream) throw new NotFoundException('Stream not found');

    return await this.prisma.chatMessage.findMany({
      where: { stream_id: stream.id, removed: false },
      orderBy: { create_date: 'asc' },
      take: 500,
    });
  }

  async sendMessage(input: {
    streamUuid: string;
    message: string;
    name?: string | null;
    anon?: {
      anon_id: string;
      anon_text_color: string;
      anon_background_color: string;
    };
  }) {
    const stream = await this.prisma.stream.findUnique({
      where: { uuid: input.streamUuid },
    });
    if (!stream) throw new NotFoundException('Stream not found');

    const anon = input.anon ?? createAnonSession();
    const msg = await this.prisma.chatMessage.create({
      data: {
        uuid: randomUUID(),
        create_date: new Date(),
        anon_id: anon.anon_id,
        anon_text_color: anon.anon_text_color,
        anon_background_color: anon.anon_background_color,
        name: input.name ?? null,
        message: input.message,
        removed: false,
        stream_id: stream.id,
      },
    });

    await pubsub.publish(TOPIC_CHAT_MESSAGE_ADDED, {
      chatMessageAdded: {
        streamUuid: input.streamUuid,
        message: msg,
      },
    });

    return msg;
  }
}


