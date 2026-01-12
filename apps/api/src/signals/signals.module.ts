import { Module } from '@nestjs/common';
import { SignalsResolver } from './signals.resolver';
import { SignalsService } from './signals.service';

@Module({
  providers: [SignalsResolver, SignalsService],
})
export class SignalsModule {}



