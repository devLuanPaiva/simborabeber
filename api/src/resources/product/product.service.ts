import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateManyProductsDto, CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './repository/product.repository';
import { UserRepository } from '../user/repository/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BarEntity } from '../bar/entities/bar.entity';
import { ProductEntity } from './entities/product.entity';
import { ProductVariantEntity } from '../product-variant/entities/product-variant.entity';

@Injectable()
export class ProductService {

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
    @InjectRepository(BarEntity)
    private readonly barRepository: Repository<BarEntity>,
  ) { }

  async create(createProductDto: CreateProductDto, userId: string): Promise<ProductEntity> {
    const user = await this.userRepository.findUserByIdWithBar(userId)
    if (!user) {
      throw new NotFoundException({ message: 'Usuário não encontrado', field: 'id', detail: `Usuário com id ${userId} não foi encontrado` })
    }

    if (!user.bar) {
      throw new ForbiddenException({ message: 'Usuário não possui bar associado', field: 'bar', detail: `O usuário não possui um bar associado e não pode criar produtos` })
    }

    const { variants, ...rest } = createProductDto;
    this.assertHasPriceOrVariants(rest.price, variants);

    const productData: Partial<ProductEntity> = {
      ...rest,
      bar: user.bar,
      variants: variants as ProductVariantEntity[] | undefined,
    }

    return this.productRepository.createProduct(productData)
  }

  async createMany(createManyProductsDto: CreateManyProductsDto, userId: string): Promise<ProductEntity[]> {
    const user = await this.userRepository.findUserByIdWithBar(userId)
    if (!user) {
      throw new NotFoundException({ message: 'Usuário não encontrado', field: 'id', detail: `Usuário com id ${userId} não foi encontrado` })
    }

    if (!user.bar) {
      throw new ForbiddenException({ message: 'Usuário não possui bar associado', field: 'bar', detail: `O usuário não possui um bar associado e não pode criar produtos` })
    }

    const productsData: Partial<ProductEntity>[] = createManyProductsDto.products.map(({ variants, ...product }) => {
      this.assertHasPriceOrVariants(product.price, variants);
      return {
        ...product,
        bar: user.bar,
        variants: variants as ProductVariantEntity[] | undefined,
      };
    })

    return this.productRepository.createProducts(productsData)
  }

  private assertHasPriceOrVariants(price: number | undefined, variants: unknown[] | undefined): void {
    if ((price === undefined || price === null) && (!variants || variants.length === 0)) {
      throw new BadRequestException({
        message: 'Preço é obrigatório',
        field: 'price',
        detail: 'Informe um preço ou ao menos uma variação de tamanho com preço',
      });
    }
  }

  async findAllTheBarProducts(slug: string, category?: string) {
    const bar = await this.barRepository.findOne({ where: { slug } })
    if (!bar) {
      throw new NotFoundException({ message: 'Bar não encontrado', field: 'slug', detail: `Bar com slug ${slug} não encontrado` })
    }
    return this.productRepository.findAllByBarSlug(slug, category);
  }

  findOne(id: string) {
    return this.productRepository.findById(id);
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.updateProduct(id, updateProductDto);
  }

  remove(id: string) {
    return this.productRepository.deleteProduct(id);
  }

  toggleProductStatus(id: string) {
    return this.productRepository.toggleProductStatus(id);
  }
}
