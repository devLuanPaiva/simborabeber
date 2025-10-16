import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './resources/user/user.module';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './resources/auth/auth.module';
@Module({
  imports: [UserModule, PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
