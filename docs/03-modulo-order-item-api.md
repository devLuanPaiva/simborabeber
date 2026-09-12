# Feature 03 — Módulo `order-item` (API)

> Segue os padrões definidos em [00-padroes-e-qualidade.md](./00-padroes-e-qualidade.md).
> Depende de [01-modelo-dados-pedido.md](./01-modelo-dados-pedido.md) e
> [02-modulo-order-api.md](./02-modulo-order-api.md).

## Objetivo

Gerenciar os itens de um pedido, espelhando `TabItemModule`. Diferente de `TabItem`,
aqui a criação em lote (bulk) é o caso comum — um pedido nasce inteiro, com todos os
itens de uma vez, no ato da criação pública (feature 05) — então este módulo foca em
leitura e nas mutações administrativas pontuais (ajuste de quantidade por erro,
remoção).

## Escopo

- `OrderItemController`, `OrderItemService`, `OrderItemRepository`.
- `CreateOrderItemDto` / `CreateManyOrderItemsDto` (reaproveitados internamente pela
  criação do pedido na feature 05 — a criação em lote roda dentro da mesma transação
  que cria o `OrderEntity`, não é exposta como rota pública independente).
- Endpoints internos (protegidos):
  - `GET /order-item/by-order/:orderId` — listar itens de um pedido.
  - `PATCH /order-item/:id/quantity` — ajustar quantidade (uso administrativo).
  - `DELETE /order-item/:id` — remover item (uso administrativo).
- **Novo em relação a `TabItem`**: campo `notes` (observação por item, ex.: "sem
  cebola", "ponto da carne bem passado").

## Contratos

```ts
export class CreateOrderItemDto {
    @IsNotEmpty() @IsString()
    name: string;

    @IsNotEmpty() @IsNumber({ maxDecimalPlaces: 2 })
    price: number;

    @IsNotEmpty() @IsNumber()
    @Min(1, { message: 'Quantidade mínima é 1' })
    quantity: number;

    @IsOptional() @IsString() @MaxLength(255)
    notes?: string;

    @IsNotEmpty() @IsEnum(ProductCategory)
    category: ProductCategory;
}

export class CreateManyOrderItemsDto {
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    @ArrayMinSize(1, { message: 'O pedido precisa ter pelo menos um item' })
    items: CreateOrderItemDto[];
}
```

## Regras de negócio

1. Toda atualização de quantidade ou remoção de item recalcula `OrderEntity.totalValue`
   (delegado ao `OrderService`, chamado a partir do `OrderItemService` — mesma relação
   de dependência que hoje existe entre `TabItemService` e o total da `Tab`, hoje
   calculado no client; aqui recomendamos mover o recálculo para o backend para não
   duplicar a regra em dois lugares. Ver observação abaixo).
2. Ajuste de quantidade/remoção só é permitido enquanto `order.status` estiver em
   `RECEIVED` ou `PREPARING` — depois disso (`READY` em diante) o pedido é imutável do
   ponto de vista de itens.

> **Observação de dívida técnica identificada**: hoje, em `TabItemService`, o
> recálculo de `totalValue` da comanda não está no backend (o client parece assumir
> esse cálculo). Para o delivery, recomenda-se que `totalValue` seja **sempre**
> recalculado no backend a cada mutação de item, para evitar divergência entre o valor
> mostrado ao cliente e o valor real cobrado. Isso não é um requisito bloqueante desta
> feature, mas deve ser decidido antes da feature 05 (criação do pedido), pois lá o
> total é calculado pela primeira vez.

## Testes exigidos

- `order-item.service.spec.ts`: atualizar quantidade recalcula `totalValue` do pedido
  pai; remoção também recalcula; ambas as operações são rejeitadas com
  `BadRequestException` se `order.status` não estiver em `RECEIVED`/`PREPARING`.
- `order-item.gateway`/notificação: reaproveita o `OrderGateway` da feature 04 (não
  duplicar gateway por módulo — mesma relação que `TabItemGateway` tem hoje, que já
  serve tab-item apesar de estar fisicamente na pasta `tab-item`; aqui decidimos manter
  um único `OrderGateway` compartilhado entre `order` e `order-item` para simplificar).

## Critérios de aceite

- [ ] Alterações de item sempre refletem no `totalValue` do pedido.
- [ ] Bloqueio de edição de itens fora de `RECEIVED`/`PREPARING` testado.
- [ ] DTOs com validação completa (`class-validator`) e mensagens em português.

## Dependências

[01-modelo-dados-pedido.md](./01-modelo-dados-pedido.md),
[02-modulo-order-api.md](./02-modulo-order-api.md).

## Estimativa

**1 dia** (reaproveita boa parte do padrão de `TabItemModule`).
