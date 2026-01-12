import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { GqlJwtGuard } from './gql-jwt.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') ?? 'dev_only_change_me',
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  providers: [AuthResolver, AuthService, GqlJwtGuard],
  exports: [JwtModule, GqlJwtGuard],
})
export class AuthModule {}


