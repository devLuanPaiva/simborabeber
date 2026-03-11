import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { TabService } from './tab.service';
import { CreateTabDto } from './dto/create-tab.dto';
import { UpdateTabDto } from './dto/update-tab.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@Controller('tab')
@ApiTags('tabs')
export class TabController {
  constructor(private readonly tabService: TabService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @ApiOperation({ summary: "Criar uma nova comanda" })
  @ApiBody({ type: CreateTabDto })
  @ApiResponse({ status: 201, description: "Comanda criada com sucesso" })
  @ApiResponse({ status: 400, description: "Requisição inválida" })
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req, @Body() createTabDto: CreateTabDto) {
    const userId = req.user?.sub
    return this.tabService.create(createTabDto, userId);
  }

  @Post('close/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @ApiOperation({ summary: "Fechar uma comanda pelo ID" })
  @ApiResponse({ status: 200, description: "Comanda fechada com sucesso" })
  @ApiResponse({ status: 404, description: "Comanda não encontrada" })
  @HttpCode(HttpStatus.OK)
  closeTab(@Req() req, @Param('id') id: string) {
    const userId = req.user?.sub
    return this.tabService.closeTab(id, userId);
  }
  
  @Get('by-bar/:slug')
  @ApiOperation({ summary: "Listar todas as comandas de um bar" })
  @ApiResponse({ status: 200, description: "Comandas listadas com sucesso" })
  @ApiResponse({ status: 400, description: "Requisição inválida" })
  @HttpCode(HttpStatus.OK)
   findThemAllByBarSlug(@Param('slug') slug: string) {
    return this.tabService. findThemAllByBarSlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: "Obter uma comanda pelo ID" })
  @ApiResponse({ status: 200, description: "Comanda obtida com sucesso" })
  @ApiResponse({ status: 404, description: "Comanda não encontrada" })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.tabService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @ApiOperation({ summary: "Atualizar uma comanda pelo ID" })
  @ApiBody({ type: UpdateTabDto })
  @ApiResponse({ status: 200, description: "Comanda atualizada com sucesso" })
  @ApiResponse({ status: 404, description: "Comanda não encontrada" })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateTabDto: UpdateTabDto) {
    return this.tabService.update(id, updateTabDto);
  }

  
  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @ApiOperation({ summary: "Remover uma comanda pelo ID" })
  @ApiResponse({ status: 200, description: "Comanda removida com sucesso" })
  @ApiResponse({ status: 404, description: "Comanda não encontrada" })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.tabService.remove(id);
  }
}
