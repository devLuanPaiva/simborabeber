# Feature 05 — Criação pública de pedido (sem login)

> Segue os padrões definidos em [00-padroes-e-qualidade.md](./00-padroes-e-qualidade.md).
> Depende de [02-modulo-order-api.md](./02-modulo-order-api.md),
> [03-modulo-order-item-api.md](./03-modulo-order-item-api.md) e
> [06-configuracoes-delivery-bar.md](./06-configuracoes-delivery-bar.md).

## Objetivo

Expor o único endpoint que o cliente final (sem conta, sem login) usa: criar um
pedido completo (dados do cliente + itens) a partir do carrinho montado no cardápio
público.

## Escopo

- `POST /order/by-bar/:slug` — rota **pública** (sem `@UseGuards`), que recebe o
  pedido inteiro (dados do cliente + array de itens) e cria `OrderEntity` +
  `OrderItemEntity[]` numa única operação/transação.
- Validações de negócio específicas de pedido público (abaixo).
- Proteções de abuso mínimas, dado que é uma rota pública que escreve no banco.

## Contrato

```ts
export class CreateOrderDto {
    @IsNotEmpty() @IsEnum(OrderType)
    type: OrderType;

    @IsNotEmpty() @IsString() @MaxLength(120)
    customerName: string;

    @IsNotEmpty() @Matches(/^\d{10,11}$/, { message: 'Telefone deve ter DDD + número' })
    customerPhone: string;

    @ValidateIf(o => o.type === OrderType.DELIVERY)
    @IsNotEmpty({ message: 'Endereço é obrigatório para entrega' })
    @IsString() @MaxLength(255)
    deliveryAddress?: string;

    @IsNotEmpty() @IsEnum(PaymentMethod)
    paymentMethod: PaymentMethod;

    @IsOptional() @IsString() @MaxLength(255)
    notes?: string;

    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    @ArrayMinSize(1, { message: 'O pedido precisa ter pelo menos um item' })
    items: CreateOrderItemDto[];
}
```

```ts
@Post('by-bar/:slug')
@ApiOperation({ summary: 'Criar um pedido (cliente final, sem login)' })
@ApiResponse({ status: 201, description: 'Pedido criado com sucesso' })
@ApiResponse({ status: 400, description: 'Requisição inválida' })
@ApiResponse({ status: 403, description: 'Bar não aceita delivery ou está fechado' })
@HttpCode(HttpStatus.CREATED)
createByBarSlug(@Param('slug') slug: string, @Body() dto: CreateOrderDto) {
  return this.orderService.createPublicOrder(slug, dto);
}
```

## Regras de negócio (`OrderService.createPublicOrder`)

1. Buscar o bar pelo `slug`; se não existir ou `isActive === false`, `404`.
2. Se `bar.deliveryEnabled === false` (feature 06), `403` — bar não vende delivery.
3. Se `dto.type === DELIVERY` e `totalItens < bar.minOrderValue`, `400` com mensagem
   clara ("Pedido mínimo de R$ X para entrega").
4. Validar que todo `productId`/nome de item realmente pertence ao catálogo do bar (ver
   nota abaixo) — **não confiar em preço enviado pelo client**.
5. Calcular `deliveryFee` a partir de `bar.deliveryFee` (não aceitar do client).
6. Calcular `totalValue = soma(items) + deliveryFee`.
7. Criar `OrderEntity` com `status = RECEIVED`, `paymentStatus = PENDING`, e os itens
   em cascata.
8. Chamar `OrderGateway.notifyOrderCreated`.
9. Retornar o pedido criado (incluindo `id`, usado pelo client para a tela de
   acompanhamento — feature 09).

> **Ponto crítico de segurança**: o `CreateOrderItemDto` da feature 03 recebe `price`
> do client para o fluxo administrativo (onde quem cria é um usuário autenticado que
> pode digitar um valor manual). Para o fluxo público, **o preço não pode vir do
> client**. `createPublicOrder` deve receber apenas `productId` + `quantity` + `notes`
> por item, buscar `ProductEntity` no banco para pegar nome/preço/categoria reais, e
> ignorar qualquer preço enviado. Isso muda o DTO de item usado especificamente nesta
> rota: criar um `CreatePublicOrderItemDto` separado (`productId`, `quantity`,
> `notes`), diferente do `CreateOrderItemDto` administrativo da feature 03.

## Proteção contra abuso

Como é a única rota de escrita pública de todo o sistema até hoje, vale reforço
específico:

- Rate limiting por IP no endpoint (`@nestjs/throttler`, ainda não usado no projeto —
  avaliar adicionar como dependência nova, escopo pequeno: 1 guard global ou por rota).
- Limitar tamanho de `items` (ex.: máximo 50 itens por pedido) via `@ArrayMaxSize`.
- Não expor endpoint de listagem pública de pedidos (a leitura pública do próprio
  pedido, feature 09, é por `id` do pedido — um UUID não enumerável — nunca por
  listagem).

## Testes exigidos

- Pedido `PICKUP` sem endereço passa; pedido `DELIVERY` sem endereço falha com `400`.
- Pedido abaixo do `minOrderValue` do bar falha com `400`.
- Bar com `deliveryEnabled = false` falha com `403`.
- Preço/nome do item sempre vem do `ProductEntity` no banco, nunca do payload —
  teste enviando um preço divergente no body e conferindo que o total calculado ignora
  esse valor.
- `notifyOrderCreated` é chamado exatamente uma vez por pedido criado.

## Critérios de aceite

- [ ] Rota pública funcional, sem guard, documentada no Swagger com os `@ApiResponse`
      de erro relevantes.
- [ ] Preço de item nunca confiável a partir do client.
- [ ] Rate limiting básico aplicado.

## Dependências

[02](./02-modulo-order-api.md), [03](./03-modulo-order-item-api.md),
[06](./06-configuracoes-delivery-bar.md) (precisa de `deliveryEnabled`/`minOrderValue`/
`deliveryFee` no bar).

## Estimativa

**1,5 dia** (regra de negócio + validação de segurança do preço + rate limiting +
testes).
