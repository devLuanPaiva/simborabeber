import { Module, forwardRef } from '@nestjs/common';
import { BarService } from './bar.service';
import { BarController } from './bar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarEntity } from './entities/bar.entity';
import { BarRepository } from './repository/bar.repository';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ProductModule } from '../product/product.module';
import { TabModule } from '../tab/tab.module';

@Module({
  controllers: [BarController],
  imports: [TypeOrmModule.forFeature([BarEntity]), AuthModule, forwardRef(() => UserModule), forwardRef(() => ProductModule), forwardRef(() => TabModule)],
  providers: [BarService, BarRepository],
  exports: [BarService, BarRepository, TypeOrmModule]
})
export class BarModule { }