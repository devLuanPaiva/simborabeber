import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './resources/user/user.module';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './resources/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EstablishmentModule } from './resources/establishment/establishment.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    PrismaModule,
    AuthModule,
    EstablishmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
