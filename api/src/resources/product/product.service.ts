import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProductByEstablishment(createProductDto: CreateProductDto) {
    const {
      name,
      description,
      purchasePrice,
      salePrice,
      category,
      imageUrl,
      barCode,
      showInMenu,
      establishmentProducts,
      productStocks,
    } = createProductDto;

    try {
      if (!establishmentProducts?.length) {
        throw new BadRequestException('É necessário informar ao menos um estabelecimento.');
      }

      const establishmentIds = establishmentProducts.map((e) => e.establishmentId);
      const existingEstablishments = await this.prisma.establishment.findMany({
        where: { id: { in: establishmentIds } },
        select: { id: true },
      });

      if (existingEstablishments.length !== establishmentIds.length) {
        throw new NotFoundException(
          'Um ou mais estabelecimentos informados não foram encontrados.',
        );
      }

      if (barCode) {
        const existingProduct = await this.prisma.product.findUnique({
          where: { barCode },
        });
        if (existingProduct) {
          throw new ConflictException('Já existe um produto com este código de barras.');
        }
      }

      const product = await this.prisma.product.create({
        data: {
          name,
          description,
          purchasePrice,
          salePrice,
          category,
          imageUrl,
          barCode,
          showInMenu,
          establishmentProducts: {
            create: establishmentProducts.map((ep) => ({
              establishmentId: ep.establishmentId,
              localCode: ep.localCode,
              price: ep.price ?? salePrice,
              trackInventory: ep.trackInventory ?? false,
              available: ep.available ?? true,
            })),
          },
          productStocks: {
            create: productStocks?.map((ps) => ({
              establishmentId: ps.establishmentId,
              quantity: ps.quantity ?? 0,
            })),
          },
        },
        include: {
          establishmentProducts: true,
          productStocks: true,
        },
      });

      return product;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Erro ao criar produto. Tente novamente mais tarde.');
    }
  }

  async getProductsByEstablishment(establishmentId: string) {
    try {
      const establishmentExists = await this.prisma.establishment.findUnique({
        where: { id: establishmentId },
      });

      if (!establishmentExists) {
        throw new NotFoundException('Estabelecimento não encontrado.');
      }

      const products = await this.prisma.product.findMany({
        where: {
          establishmentProducts: {
            some: { establishmentId },
          },
        },
        include: {
          establishmentProducts: true,
          productStocks: true,
        },
      });

      return products;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao buscar produtos do estabelecimento.');
    }
  }

  async getProductById(productId: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: {
          establishmentProducts: true,
          productStocks: true,
        },
      });

      if (!product) {
        throw new NotFoundException('Produto não encontrado.');
      }

      return product;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao buscar produto.');
    }
  }

  async updateProductByEstablishment(
    productId: string,
    updateProductDto: UpdateProductDto,
    establishmentId: string,
  ) {
    const {
      name,
      description,
      purchasePrice,
      salePrice,
      category,
      imageUrl,
      showInMenu,
      isActive,
    } = updateProductDto;

    try {
      const establishmentProduct = await this.prisma.establishmentProduct.findFirst({
        where: { productId, establishmentId },
      });

      if (!establishmentProduct) {
        throw new NotFoundException(
          'Produto não encontrado ou não pertence a este estabelecimento.',
        );
      }

      const updatedProduct = await this.prisma.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          purchasePrice,
          salePrice,
          category,
          imageUrl,
          showInMenu,
          isActive,
          establishmentProducts: {
            updateMany: {
              where: { establishmentId },
              data: { price: salePrice ?? establishmentProduct.price },
            },
          },
        },
        include: {
          establishmentProducts: true,
          productStocks: true,
        },
      });

      return updatedProduct;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao atualizar produto.');
    }
  }

  async increaseQuantityProduct(productId: string, establishmentId: string, quantity: number) {
    if (quantity <= 0) {
      throw new BadRequestException('A quantidade deve ser maior que zero.');
    }

    try {
      const stock = await this.prisma.productStock.findUnique({
        where: {
          establishmentId_productId: { establishmentId, productId },
        },
      });

      if (!stock) {
        throw new NotFoundException('Estoque do produto não encontrado.');
      }

      const updatedStock = await this.prisma.productStock.update({
        where: {
          establishmentId_productId: { establishmentId, productId },
        },
        data: { quantity: { increment: quantity } },
      });

      await this.prisma.stockMovement.create({
        data: {
          establishmentId,
          productId,
          change: quantity,
          reason: 'Reabastecimento manual',
        },
      });

      return updatedStock;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Erro ao atualizar estoque do produto.');
    }
  }

  async removeProductByEstablishment(productId: string, establishmentId: string) {
    try {
      const product = await this.prisma.product.findUnique({ where: { id: productId } });

      if (!product) {
        throw new NotFoundException('Produto não encontrado.');
      }

      await this.prisma.product.update({
        where: { id: productId },
        data: { isActive: false },
      });

      await this.prisma.establishmentProduct.updateMany({
        where: { productId, establishmentId },
        data: { available: false },
      });

      return { message: 'Produto desativado com sucesso.' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Erro ao remover produto.');
    }
  }
}
