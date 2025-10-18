import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const expiration = config.get<string>('JWT_EXPIRATION') ?? '2h';

        const expiresInSeconds = expiration.endsWith('h')
          ? Number(expiration.slice(0, -1)) * 3600
          : Number(expiration);

        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: expiresInSeconds,
          },
        };
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
