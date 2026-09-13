import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@Controller('product-variant')
@ApiTags('product-variants')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) { }

  @Post('by-product/:productId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @ApiOperation({ summary: "Criar uma variação (tamanho) para um produto" })
  @ApiBody({ type: CreateProductVariantDto })
  @ApiResponse({ status: 201, description: "Variação criada com sucesso" })
  @ApiResponse({ status: 400, description: "Requisição inválida" })
  @ApiResponse({ status: 404, description: "Produto não encontrado" })
  @HttpCode(HttpStatus.CREATED)
  createByProduct(@Param('productId') productId: string, @Body() createProductVariantDto: CreateProductVariantDto) {
    return this.productVariantService.createByProduct(productId, createProductVariantDto);
  }

  @Get('by-product/:productId')
  @ApiOperation({ summary: "Listar as variações de um produto" })
  @ApiResponse({ status: 200, description: "Variações listadas com sucesso" })
  @HttpCode(HttpStatus.OK)
  findAllByProduct(@Param('productId') productId: string) {
    return this.productVariantService.findAllByProduct(productId);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @ApiOperation({ summary: "Atualizar uma variação pelo ID" })
  @ApiBody({ type: UpdateProductVariantDto })
  @ApiResponse({ status: 200, description: "Variação atualizada com sucesso" })
  @ApiResponse({ status: 404, description: "Variação não encontrada" })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateProductVariantDto: UpdateProductVariantDto) {
    return this.productVariantService.update(id, updateProductVariantDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @ApiOperation({ summary: "Remover uma variação pelo ID" })
  @ApiResponse({ status: 200, description: "Variação removida com sucesso" })
  @ApiResponse({ status: 404, description: "Variação não encontrada" })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.productVariantService.remove(id);
  }
}
