import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ArrayMaxSize, ArrayMinSize, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, ValidateIf, ValidateNested } from "class-validator";
import { OrderType, PaymentMethod } from "../entities/order.entity";
import { CreatePublicOrderItemDto } from "./create-public-order-item.dto";

export class CreatePublicOrderDto {
    @IsNotEmpty({ message: 'Tipo do pedido é obrigatório' })
    @IsEnum(OrderType, { message: 'Tipo do pedido deve ser delivery ou pickup' })
    @ApiProperty({ example: OrderType.DELIVERY, description: 'Tipo do pedido', enum: OrderType })
    type: OrderType

    @IsNotEmpty({ message: 'Nome do cliente é obrigatório' })
    @IsString({ message: 'Nome do cliente deve ser uma string' })
    @MaxLength(120, { message: 'Nome do cliente deve ter no máximo 120 caracteres' })
    @ApiProperty({ example: 'João', description: 'Nome do cliente' })
    customerName: string

    @IsNotEmpty({ message: 'Telefone do cliente é obrigatório' })
    @Matches(/^\d{10,11}$/, { message: 'Telefone deve conter DDD + número (10 ou 11 dígitos)' })
    @ApiProperty({ example: '11999999999', description: 'Telefone do cliente (DDD + número, somente dígitos)' })
    customerPhone: string

    @ValidateIf((dto: CreatePublicOrderDto) => dto.type === OrderType.DELIVERY)
    @IsNotEmpty({ message: 'Endereço é obrigatório para entrega' })
    @IsString({ message: 'Endereço deve ser uma string' })
    @MaxLength(255, { message: 'Endereço deve ter no máximo 255 caracteres' })
    @ApiProperty({ example: 'Rua das Flores, 123', description: 'Endereço de entrega (obrigatório para delivery)', required: false })
    deliveryAddress?: string

    @IsNotEmpty({ message: 'Forma de pagamento é obrigatória' })
    @IsEnum(PaymentMethod, { message: 'Forma de pagamento inválida' })
    @ApiProperty({ example: PaymentMethod.PIX, description: 'Forma de pagamento', enum: PaymentMethod })
    paymentMethod: PaymentMethod

    @IsOptional()
    @IsString({ message: 'Observação deve ser uma string' })
    @MaxLength(255, { message: 'Observação deve ter no máximo 255 caracteres' })
    @ApiProperty({ example: 'Tocar a campainha', description: 'Observação geral do pedido', required: false })
    notes?: string

    @ArrayMinSize(1, { message: 'O pedido precisa ter pelo menos um item' })
    @ArrayMaxSize(50, { message: 'O pedido pode ter no máximo 50 itens' })
    @ValidateNested({ each: true })
    @Type(() => CreatePublicOrderItemDto)
    @ApiProperty({ type: [CreatePublicOrderItemDto], description: 'Itens do pedido' })
    items: CreatePublicOrderItemDto[]
}
