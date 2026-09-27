import { Controller, Get, Patch, Delete, Body, Param, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { UpdateOrderItemQuantityDto } from './dto/update-order-item-quantity.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@Controller('order-item')
@ApiTags('order-items')
export class OrderItemController {
    constructor(private readonly orderItemService: OrderItemService) { }

    @Get('by-order/:orderId')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MANAGER, UserRole.WAITER)
    @ApiOperation({ summary: 'Listar items de um pedido' })
    @ApiResponse({ status: 200, description: 'Lista de items' })
    @HttpCode(HttpStatus.OK)
    findItemsByOrder(@Param('orderId') orderId: string) {
        return this.orderItemService.findItemsByOrder(orderId);
    }

    @Patch(':id/quantity')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MANAGER, UserRole.WAITER)
    @ApiOperation({ summary: 'Atualizar a quantidade de um item do pedido' })
    @ApiBody({ type: UpdateOrderItemQuantityDto })
    @ApiResponse({ status: 200, description: 'Quantidade atualizada' })
    @ApiResponse({ status: 400, description: 'Pedido não pode mais ser editado' })
    @HttpCode(HttpStatus.OK)
    updateItemQuantity(@Param('id') id: string, @Body() dto: UpdateOrderItemQuantityDto) {
        return this.orderItemService.updateItemQuantity(id, dto.quantity);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(UserRole.MANAGER, UserRole.WAITER)
    @ApiOperation({ summary: 'Remover um item do pedido' })
    @ApiResponse({ status: 204, description: 'Item removido' })
    @ApiResponse({ status: 400, description: 'Pedido não pode mais ser editado' })
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteItem(@Param('id') id: string) {
        return this.orderItemService.deleteItem(id);
    }
}
