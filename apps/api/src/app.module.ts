import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EasyStreamGraphqlModule } from './graphql/graphql.module';
import { AuthModule } from './auth/auth.module';
import { StreamsModule } from './streams/streams.module';
import { ChatModule } from './chat/chat.module';
import { SignalsModule } from './signals/signals.module';
import { UploadsModule } from './uploads/uploads.module';
import { ProcessingModule } from './processing/processing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    EasyStreamGraphqlModule,
    AuthModule,
    StreamsModule,
    ChatModule,
    SignalsModule,
    UploadsModule,
    ProcessingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
