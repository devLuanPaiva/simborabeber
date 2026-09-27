import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req, Query } from '@nestjs/common';
import { ProductAddonService } from './product-addon.service';
import { CreateProductAddonDto } from './dto/create-product-addon.dto';
import { UpdateProductAddonDto } from './dto/update-product-addon.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@Controller('product-addon')
@ApiTags('product-addons')
export class ProductAddonController {
  constructor(private readonly productAddonService: ProductAddonService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @ApiOperation({ summary: "Criar um novo adicional" })
  @ApiBody({ type: CreateProductAddonDto })
  @ApiResponse({ status: 201, description: "Adicional criado com sucesso" })
  @ApiResponse({ status: 400, description: "Requisição inválida" })
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req, @Body() createProductAddonDto: CreateProductAddonDto) {
    const userId = req.user?.sub
    return this.productAddonService.create(createProductAddonDto, userId);
  }

  @Get('by-bar')
  @ApiQuery({ name: 'slug', description: 'Slug do bar para filtrar os adicionais', required: true })
  @ApiQuery({ name: 'category', description: 'Categoria do produto para filtrar (opcional)', required: false })
  @ApiOperation({ summary: "Listar todos os adicionais de um bar" })
  @ApiResponse({ status: 200, description: "Adicionais listados com sucesso" })
  @ApiResponse({ status: 400, description: "Requisição inválida" })
  @HttpCode(HttpStatus.OK)
  findAllTheBarAddons(
    @Query('slug') slug: string,
    @Query('category') category?: string,
  ) {
    return this.productAddonService.findAllTheBarAddons(slug, category);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @ApiOperation({ summary: "Atualizar um adicional pelo ID" })
  @ApiBody({ type: UpdateProductAddonDto })
  @ApiResponse({ status: 200, description: "Adicional atualizado com sucesso" })
  @ApiResponse({ status: 404, description: "Adicional não encontrado" })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateProductAddonDto: UpdateProductAddonDto) {
    return this.productAddonService.update(id, updateProductAddonDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: "Remover um adicional pelo ID" })
  @ApiResponse({ status: 200, description: "Adicional removido com sucesso" })
  @ApiResponse({ status: 404, description: "Adicional não encontrado" })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.productAddonService.remove(id);
  }

  @Post('toggle-status/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @ApiOperation({ summary: "Alternar o status de um adicional" })
  @ApiResponse({ status: 200, description: "Status do adicional alterado com sucesso" })
  @ApiResponse({ status: 404, description: "Adicional não encontrado" })
  @HttpCode(HttpStatus.OK)
  toggleAddonStatus(@Param('id') id: string) {
    return this.productAddonService.toggleAddonStatus(id);
  }
}
