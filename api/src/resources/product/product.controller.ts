import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../user/entities/user.entity';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('products')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.MANAGER, Role.WAITER)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post('establishment')
  @ApiOperation({ summary: 'Criar um novo produto para um estabelecimento' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso.' })
  createProductByEstablishment(@Body() createProductDto: CreateProductDto) {
    return this.productService.createProductByEstablishment(createProductDto);
  }

  @Get('establishment/:establishmentId')
  @ApiOperation({ summary: 'Obter produtos de um estabelecimento' })
  @ApiResponse({ status: 200, description: 'Produtos retornados com sucesso.' })
  getProductsByEstablishment(@Param('establishmentId') establishmentId: string) {
    return this.productService.getProductsByEstablishment(establishmentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um produto pelo ID' })
  @ApiResponse({ status: 200, description: 'Produto retornado com sucesso.' })
  getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Patch(':id/increase/:establishmentId')
  @ApiOperation({ summary: 'Aumentar a quantidade de um produto em um estabelecimento' })
  @ApiResponse({ status: 200, description: 'Quantidade do produto aumentada com sucesso.' })
  @ApiBody({ schema: { properties: { quantity: { type: 'number' } }, required: ['quantity'] } })
  increaseQuantityProduct(
    @Param('id') id: string,
    @Param('establishmentId') establishmentId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.productService.increaseQuantityProduct(id, establishmentId, quantity);
  }

  @Patch(':id/establishment/:establishmentId')
  @ApiOperation({ summary: 'Atualizar um produto pelo ID' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.' })
  @ApiBody({ type: UpdateProductDto })
  updateProductByEstablishment(
    @Param('id') id: string,
    @Param('establishmentId') establishmentId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateProductByEstablishment(id, updateProductDto, establishmentId);
  }

  @Delete(':id/establishment/:establishmentId')
  @ApiOperation({ summary: 'Remover um produto de um estabelecimento' })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso.' })
  removeProductByEstablishment(
    @Param('id') id: string,
    @Param('establishmentId') establishmentId: string,
  ) {
    return this.productService.removeProductByEstablishment(id, establishmentId);
  }
}
