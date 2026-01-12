import { Module } from '@nestjs/common';
import { StreamsResolver } from './streams.resolver';
import { StreamsService } from './streams.service';
import { ProcessingModule } from '../processing/processing.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ProcessingModule, AuthModule],
  providers: [StreamsResolver, StreamsService],
  exports: [StreamsService],
})
export class StreamsModule {}


