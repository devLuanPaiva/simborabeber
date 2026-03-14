import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateManyProductsDto, CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@Controller('product')
@ApiTags('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @ApiOperation({ summary: "Criar um novo produto" })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: "Produto criado com sucesso" })
  @ApiResponse({ status: 400, description: "Requisição inválida" })
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req, @Body() createProductDto: CreateProductDto) {
    const userId = req.user?.sub
    return this.productService.create(createProductDto, userId);
  }

  @Post('bulk')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @ApiOperation({ summary: "Criar vários produtos em lote" })
  @ApiBody({ type: CreateManyProductsDto })
  @ApiResponse({ status: 201, description: "Produtos criados com sucesso" })
  @ApiResponse({ status: 400, description: "Requisição inválida" })
  @HttpCode(HttpStatus.CREATED)
  createMany(@Req() req, @Body() createManyProductsDto: CreateManyProductsDto) {
    const userId = req.user?.sub
    return this.productService.createMany(createManyProductsDto, userId);
  }

  @Get('by-bar/:slug')
  @ApiOperation({ summary: "Listar todos os produtos de um bar" })
  @ApiResponse({ status: 200, description: "Produtos listados com sucesso" })
  @ApiResponse({ status: 400, description: "Requisição inválida" })
  @HttpCode(HttpStatus.OK)
  findAllTheBarProducts(@Param('slug') slug: string) {
    return this.productService.findAllTheBarProducts(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: "Obter um produto pelo ID" })
  @ApiResponse({ status: 200, description: "Produto encontrado com sucesso" })
  @ApiResponse({ status: 404, description: "Produto não encontrado" })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @ApiOperation({ summary: "Atualizar um produto pelo ID" })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: "Produto atualizado com sucesso" })
  @ApiResponse({ status: 404, description: "Produto não encontrado" })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: "Remover um produto pelo ID" })
  @ApiResponse({ status: 200, description: "Produto removido com sucesso" })
  @ApiResponse({ status: 404, description: "Produto não encontrado" })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
