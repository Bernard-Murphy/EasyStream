import { Module } from '@nestjs/common';
import { ProcessingService } from './processing.service';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [UploadsModule],
  providers: [ProcessingService],
  exports: [ProcessingService],
})
export class ProcessingModule {}


