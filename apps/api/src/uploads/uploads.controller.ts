import {
  BadRequestException,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
import { memoryStorage } from 'multer';
import type { Request } from 'express';
import { UploadsService } from './uploads.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('upload')
export class UploadsController {
  constructor(
    private readonly config: ConfigService,
    private readonly uploads: UploadsService,
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private async authorizeUpload(req: Request, streamUuid: string) {
    const stream = await this.prisma.stream.findUnique({
      where: { uuid: streamUuid },
      select: { host_token: true },
    });
    if (!stream) {
      // Keep behavior consistent with existing endpoint semantics.
      throw new BadRequestException('Invalid streamUuid');
    }

    const hostToken =
      (req.headers['x-host-token'] as string | undefined) ??
      (req.query.hostToken as string | undefined) ??
      ((req.body as any)?.hostToken as string | undefined);
    if (hostToken && stream.host_token && hostToken === stream.host_token) {
      return;
    }

    const header = req.headers.authorization ?? req.headers.Authorization;
    if (typeof header === 'string') {
      const [scheme, token] = header.split(' ');
      if (scheme === 'Bearer' && token) {
        try {
          await this.jwt.verifyAsync(token);
          return;
        } catch {
          // Fall through to unauthorized below.
        }
      }
    }

    throw new UnauthorizedException('Authentication required');
  }

  @Post('clip')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 1024 * 1024 * 1024 },
    }),
  )
  async uploadClip(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string; key: string }> {
    if (!file) throw new BadRequestException('Missing file');
    const streamUuid =
      (req.query.streamUuid as string | undefined) ??
      ((req.body as any)?.streamUuid as string | undefined);
    if (!streamUuid) throw new BadRequestException('Missing streamUuid');
    await this.authorizeUpload(req, streamUuid);

    const ext = path.extname(file.originalname) || '.webm';
    const key = this.uploads.makeKey(`streams/${streamUuid}/clips`, ext);
    const uploaded = await this.uploads.putBuffer({
      key,
      contentType: file.mimetype || 'video/webm',
      body: file.buffer,
    });

    // While live/processing, we store clip URLs in Stream.fileUrls (then replace with assembled URLs later).
    const s = await this.prisma.stream.findUnique({ where: { uuid: streamUuid } });
    if (s) {
      await this.prisma.stream.update({
        where: { id: s.id },
        data: { fileUrls: { set: [...(s.fileUrls ?? []), uploaded.url] } },
      });
    }

    return uploaded;
  }

  @Post('thumbnail')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  async uploadThumbnail(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string; key: string }> {
    if (!file) throw new BadRequestException('Missing file');
    const streamUuid =
      (req.query.streamUuid as string | undefined) ??
      ((req.body as any)?.streamUuid as string | undefined);
    if (!streamUuid) throw new BadRequestException('Missing streamUuid');
    await this.authorizeUpload(req, streamUuid);

    const ext = path.extname(file.originalname) || '.jpg';
    const key = this.uploads.makeKey(`streams/${streamUuid}/thumbnails`, ext);
    return await this.uploads.putBuffer({
      key,
      contentType: file.mimetype || 'image/jpeg',
      body: file.buffer,
    });
  }
}



