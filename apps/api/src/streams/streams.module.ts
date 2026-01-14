import { Module } from '@nestjs/common';
import { StreamsResolver } from './streams.resolver';
import { StreamsService } from './streams.service';
import { ProcessingModule } from '../processing/processing.module';
import { AuthModule } from '../auth/auth.module';
import { StreamsController } from './streams.controller';

@Module({
  imports: [ProcessingModule, AuthModule],
  controllers: [StreamsController],
  providers: [StreamsResolver, StreamsService],
  exports: [StreamsService],
})
export class StreamsModule {}


