import { Body, Controller, Param, Post } from '@nestjs/common';
import { StreamsService } from './streams.service';

/**
 * Small REST endpoints for cases where GraphQL is awkward (e.g. sendBeacon on unload).
 */
@Controller('streams')
export class StreamsController {
  constructor(private readonly streams: StreamsService) {}

  @Post(':uuid/leave')
  async leaveViaBeacon(@Param('uuid') uuid: string, @Body() body: { peerId?: string }) {
    const peerId = body?.peerId;
    if (!peerId) return { ok: false };
    await this.streams.leaveStream(uuid, peerId);
    return { ok: true };
  }
}


