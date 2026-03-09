import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { BarEntity } from '../bar/entities/bar.entity';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([UserEntity, BarEntity])],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository]
})
export class UserModule { }
