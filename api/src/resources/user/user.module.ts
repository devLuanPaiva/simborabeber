import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { BarEntity } from '../bar/entities/bar.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([UserEntity, BarEntity]), AuthModule],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository]
})
export class UserModule { }
