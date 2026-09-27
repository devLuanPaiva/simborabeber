import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty } from "class-validator"
import { OrderStatus } from "../entities/order.entity"

export class UpdateOrderStatusDto {
    @IsNotEmpty({ message: 'Status é obrigatório' })
    @IsEnum(OrderStatus, { message: 'Status inválido' })
    @ApiProperty({ example: OrderStatus.PREPARING, description: 'Novo status do pedido', enum: OrderStatus })
    status: OrderStatus
}
