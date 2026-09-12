import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { OrderService } from './order.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CreatePublicOrderDto } from './dto/create-public-order.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { OrderStatus } from './entities/order.entity';

@Controller('order')
@ApiTags('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post('by-bar/:slug')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Criar um pedido de delivery/retirada (cliente final, sem login)' })
  @ApiBody({ type: CreatePublicOrderDto })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Requisição inválida ou pedido mínimo não atingido' })
  @ApiResponse({ status: 403, description: 'Bar não aceita delivery' })
  @ApiResponse({ status: 404, description: 'Bar não encontrado' })
  @HttpCode(HttpStatus.CREATED)
  createByBarSlug(@Param('slug') slug: string, @Body() dto: CreatePublicOrderDto) {
    return this.orderService.createPublicOrder(slug, dto);
  }

  @Get('by-bar/:slug')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @ApiOperation({ summary: 'Listar todos os pedidos de um bar' })
  @ApiQuery({ name: 'status', enum: OrderStatus, required: false })
  @ApiResponse({ status: 200, description: 'Pedidos listados com sucesso' })
  @HttpCode(HttpStatus.OK)
  findThemAllByBarSlug(@Param('slug') slug: string, @Query('status') status?: OrderStatus) {
    return this.orderService.findThemAllByBarSlug(slug, status);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @ApiOperation({ summary: 'Obter um pedido pelo ID' })
  @ApiResponse({ status: 200, description: 'Pedido obtido com sucesso' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  @ApiOperation({ summary: 'Atualizar o status de um pedido' })
  @ApiBody({ type: UpdateOrderStatusDto })
  @ApiResponse({ status: 200, description: 'Status atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Transição de status inválida' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  @HttpCode(HttpStatus.OK)
  updateStatus(@Req() req, @Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    const userId = req.user?.sub;
    return this.orderService.updateStatus(id, dto.status, userId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Remover um pedido pelo ID' })
  @ApiResponse({ status: 200, description: 'Pedido removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }
}
