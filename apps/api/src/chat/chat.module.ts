import { Module } from '@nestjs/common';
import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ChatResolver, ChatService],
})
export class ChatModule {}


