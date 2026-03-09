import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"
import { BarService } from './bar.service';
import { CreateBarDto } from './dto/create-bar.dto';
import { UpdateBarDto } from './dto/update-bar.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@Controller('bar')
@ApiTags('bars')
export class BarController {
  constructor(private readonly barService: BarService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: "Criar um novo bar" })
  @ApiBody({ type: CreateBarDto })
  @ApiResponse({ status: 201, description: "Bar criado com sucesso" })
  @ApiResponse({ status: 400, description: "Requisição inválida" })
  @HttpCode(HttpStatus.CREATED)
  create(@Req() req, @Body() createBarDto: CreateBarDto) {
    const managerId = req.user?.sub
    return this.barService.create(createBarDto, managerId);
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os bares" })
  @ApiResponse({ status: 200, description: "Bares listados com sucesso" })
  @ApiResponse({ status: 400, description: "Requisição inválida" })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.barService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: "Obter um bar pelo slug" })
  @ApiResponse({ status: 200, description: "Bar encontrado com sucesso" })
  @ApiResponse({ status: 404, description: "Bar não encontrado" })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('slug') slug: string) {
    return this.barService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: "Atualizar um bar pelo ID" })
  @ApiBody({ type: UpdateBarDto })
  @ApiResponse({ status: 200, description: "Bar atualizado com sucesso" })
  @ApiResponse({ status: 400, description: "Requisição inválida" })
  @ApiResponse({ status: 404, description: "Bar não encontrado" })
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateBarDto: UpdateBarDto) {
    return this.barService.update(id, updateBarDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: "Remover um bar pelo ID" })
  @ApiResponse({ status: 200, description: "Bar removido com sucesso" })
  @ApiResponse({ status: 404, description: "Bar não encontrado" })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.barService.remove(id);
  }
}
