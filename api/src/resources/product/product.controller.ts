import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('product')
@ApiTags('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiOperation({ summary: "Criar um novo produto" })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: "Produto criado com sucesso" })
  @ApiResponse({ status: 400, description: "Requisição inválida" })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os produtos" })
  @ApiResponse({ status: 200, description: "Produtos listados com sucesso" })
  @ApiResponse({ status: 400, description: "Requisição inválida" })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.productService.findAll();
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
  @ApiOperation({ summary: "Atualizar um produto pelo ID" })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: "Produto atualizado com sucesso" })
  @ApiResponse({ status: 404, description: "Produto não encontrado" })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Remover um produto pelo ID" })
  @ApiResponse({ status: 200, description: "Produto removido com sucesso" })
  @ApiResponse({ status: 404, description: "Produto não encontrado" })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
