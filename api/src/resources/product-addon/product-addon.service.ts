import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductAddonDto } from './dto/create-product-addon.dto';
import { UpdateProductAddonDto } from './dto/update-product-addon.dto';
import { ProductAddonRepository } from './repository/product-addon.repository';
import { UserRepository } from '../user/repository/user.repository';
import { BarEntity } from '../bar/entities/bar.entity';
import { ProductAddonEntity } from './entities/product-addon.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductAddonService {

  constructor(
    private readonly productAddonRepository: ProductAddonRepository,
    private readonly userRepository: UserRepository,
    @InjectRepository(BarEntity)
    private readonly barRepository: Repository<BarEntity>,
  ) { }

  async create(createProductAddonDto: CreateProductAddonDto, userId: string): Promise<ProductAddonEntity> {
    const user = await this.userRepository.findUserByIdWithBar(userId)
    if (!user) {
      throw new NotFoundException({ message: 'Usuário não encontrado', field: 'id', detail: `Usuário com id ${userId} não foi encontrado` })
    }

    if (!user.bar) {
      throw new ForbiddenException({ message: 'Usuário não possui bar associado', field: 'bar', detail: `O usuário não possui um bar associado e não pode criar adicionais` })
    }

    const addonData: Partial<ProductAddonEntity> = {
      ...createProductAddonDto,
      bar: user.bar,
    }

    return this.productAddonRepository.createAddon(addonData)
  }

  async findAllTheBarAddons(slug: string, category?: string) {
    const bar = await this.barRepository.findOne({ where: { slug } })
    if (!bar) {
      throw new NotFoundException({ message: 'Bar não encontrado', field: 'slug', detail: `Bar com slug ${slug} não encontrado` })
    }
    return this.productAddonRepository.findAllByBarSlug(slug, category);
  }

  update(id: string, updateProductAddonDto: UpdateProductAddonDto) {
    return this.productAddonRepository.updateAddon(id, updateProductAddonDto);
  }

  remove(id: string) {
    return this.productAddonRepository.deleteAddon(id);
  }

  toggleAddonStatus(id: string) {
    return this.productAddonRepository.toggleAddonStatus(id);
  }
}
