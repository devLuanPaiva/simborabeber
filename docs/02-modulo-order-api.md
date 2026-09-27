# Feature 02 — Módulo `order` (API)

> Segue os padrões definidos em [00-padroes-e-qualidade.md](./00-padroes-e-qualidade.md).
> Depende de [01-modelo-dados-pedido.md](./01-modelo-dados-pedido.md).

## Objetivo

Implementar `OrderModule` (controller, service, repository, DTOs) para gestão do
pedido do lado do painel administrativo — listar, obter, atualizar status, cancelar —
espelhando `TabModule`. A criação pública (pelo cliente final) é tratada à parte em
[05-endpoint-publico-pedido.md](./05-endpoint-publico-pedido.md), pois tem regras de
acesso diferentes.

## Escopo

- `OrderController`, `OrderService`, `OrderRepository`, DTOs de update/status.
- Endpoints internos (protegidos por `AuthGuard` + `RolesGuard`):
  - `GET /order/by-bar/:slug` — lista pedidos do bar (equivalente a
    `TabController.findThemAllByBarSlug`), com filtro opcional por `status` via
    query string.
  - `GET /order/:id` — detalhe do pedido com itens.
  - `PATCH /order/:id/status` — transição de status (aceitar, preparar, marcar
    pronto, saiu para entrega, concluir, cancelar).
  - `DELETE /order/:id` — remoção (uso administrativo/erro de cadastro, não é o fluxo
    normal — o fluxo normal é `CANCELLED` via `PATCH .../status`).
- **Não inclui** a criação do pedido (feature 05) nem os itens (feature 03).

## Contratos

### `UpdateOrderStatusDto`

```ts
export class UpdateOrderStatusDto {
    @IsNotEmpty({ message: 'Status é obrigatório' })
    @IsEnum(OrderStatus, { message: 'Status inválido' })
    @ApiProperty({ example: OrderStatus.PREPARING, enum: OrderStatus })
    status: OrderStatus;
}
```

### `OrderController` (assinatura)

```ts
@Controller('order')
@ApiTags('orders')
export class OrderController {
  @Get('by-bar/:slug')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  findThemAllByBarSlug(@Param('slug') slug: string, @Query('status') status?: OrderStatus) {}

  @Get(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  findOne(@Param('id') id: string) {}

  @Patch(':id/status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER, UserRole.WAITER)
  updateStatus(@Req() req, @Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {}

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.MANAGER)
  remove(@Param('id') id: string) {}
}
```

## Regras de negócio (no `OrderService`)

1. **Máquina de estados** (ver detalhamento em
   [01-modelo-dados-pedido.md](./01-modelo-dados-pedido.md)): `updateStatus` rejeita
   transições fora do fluxo permitido com `BadRequestException`, incluindo a
   ramificação `PICKUP` (sem `OUT_FOR_DELIVERY`).
2. Ao transicionar para `PREPARING`, gravar `attendedBy = user` (quem no painel
   assumiu o pedido).
3. Ao transicionar para `READY`/`COMPLETED`/`CANCELLED`, gravar o timestamp
   correspondente (`readyAt`/`completedAt`/`cancelledAt`).
4. Após cada mutação de status, chamar `OrderGateway.notifyOrderUpdated` (feature 04).
5. `shapeOrder` (equivalente a `TabService.shapeTab`) nunca deve devolver a senha do
   usuário nem dados sensíveis de `attendedBy` além de `{ id, name }`.

## Testes exigidos

No `order.service.spec.ts` (mock de `OrderRepository` e `OrderGateway`):

- Transição válida `RECEIVED → PREPARING` grava `attendedBy` e chama o gateway.
- Transição inválida (`RECEIVED → COMPLETED` direto) lança `BadRequestException` e
  **não** chama repository/gateway.
- Cancelamento a partir de `OUT_FOR_DELIVERY` é rejeitado.
- Pedido tipo `PICKUP` aceita `READY → COMPLETED` sem passar por
  `OUT_FOR_DELIVERY`.

No `order.controller.spec.ts` (mock de `OrderService`):

- Cada rota delega para o método correto do service com os parâmetros certos.
- `remove` só é acessível com role `MANAGER` (teste do guard/metadata, seguindo o que
  já é feito — ou deveria ser feito — para `ProductController.remove`).

## Critérios de aceite

- [ ] Todas as transições de status descritas em
      [01-modelo-dados-pedido.md](./01-modelo-dados-pedido.md) implementadas e testadas.
- [ ] Nenhuma rota interna acessível sem `AuthGuard` + `RolesGuard`.
- [ ] `pnpm lint` e `pnpm test` passando sem novos warnings.

## Dependências

[01-modelo-dados-pedido.md](./01-modelo-dados-pedido.md).

## Estimativa

**2 dias** (1 dia service/repository + máquina de estados, 1 dia controller + DTOs +
testes).
