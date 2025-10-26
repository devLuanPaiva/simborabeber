import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { EstablishmentService } from './establishment.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../user/entities/user.entity';

@ApiBearerAuth()
@ApiTags('establishment')
@Controller('establishment')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Criar um novo estabelecimento' })
  @ApiBody({ type: CreateEstablishmentDto })
  @ApiResponse({ status: 201, description: 'Estabelecimento criado com sucesso.' })
  create(@Body() createEstablishmentDto: CreateEstablishmentDto, @Req() req) {
    return this.establishmentService.createEstablishmentDto(createEstablishmentDto, req.user);
  }

  @Get('usuario')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.MANAGER, Role.WAITER)
  @ApiOperation({ summary: 'Obter estabelecimentos do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Estabelecimentos do usuário retornados com sucesso.' })
  getEstablishmentByUser(@Req() req) {
    return this.establishmentService.getEstablishmentByUser(req.user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Atualizar um estabelecimento existente' })
  @ApiResponse({ status: 200, description: 'Estabelecimento atualizado com sucesso.' })
  update(@Param('id') id: string, @Req() req, @Body() updateEstablishmentDto: UpdateEstablishmentDto) {
    return this.establishmentService.updateEstablishment(id, updateEstablishmentDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.MANAGER)
  @ApiOperation({ summary: 'Remover um estabelecimento existente' })
  @ApiResponse({ status: 200, description: 'Estabelecimento removido com sucesso.' })
  remove(@Param('id') id: string, @Req() req) {
    return this.establishmentService.deleteEstablishment(id, req.user);
  }
}
