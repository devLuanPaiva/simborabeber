# Feature 01 — Modelagem de dados do pedido

> Segue os padrões definidos em [00-padroes-e-qualidade.md](./00-padroes-e-qualidade.md).

## Objetivo

Criar as entidades que sustentam o delivery: `OrderEntity` e `OrderItemEntity`, análogas
a `TabEntity`/`TabItemEntity`, mas com os campos específicos de um pedido que não passa
por um garçom (endereço, telefone, forma de pagamento, tipo de entrega).

## Escopo

- Entidade `OrderEntity` (`api/src/resources/order/entities/order.entity.ts`).
- Entidade `OrderItemEntity` (`api/src/resources/order-item/entities/order-item.entity.ts`).
- Migrations de criação das duas tabelas.
- **Não inclui** service/controller/repository (features 02 e 03) nem o gateway
  (feature 04) — só o modelo de dados.

## Modelagem

### `OrderEntity`

```ts
export enum OrderType {
    DELIVERY = 'delivery',
    PICKUP = 'pickup',
}

export enum OrderStatus {
    RECEIVED = 'received',
    PREPARING = 'preparing',
    READY = 'ready',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export enum PaymentMethod {
    CASH = 'cash',
    CARD = 'card',
    PIX = 'pix',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
}

@Entity({ name: 'orders', schema: 'public' })
export class OrderEntity {
    id: string; // uuid

    type: OrderType;
    status: OrderStatus; // default RECEIVED

    customerName: string;
    customerPhone: string;

    deliveryAddress?: string; // obrigatório quando type = DELIVERY (validado no DTO/service, não no banco)
    deliveryFee: number; // decimal(10,2), default 0 — snapshot da taxa do bar no momento do pedido

    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus; // default PENDING

    notes?: string; // observação geral do pedido

    totalValue: number; // decimal(10,2) — soma dos itens + deliveryFee

    bar: BarEntity; // ManyToOne, onDelete CASCADE
    attendedBy?: UserEntity; // ManyToOne, nullable — quem assumiu/preparou no painel

    items: OrderItemEntity[]; // OneToMany, cascade: true

    createdAt: Date;
    updatedAt: Date;
    readyAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
}
```

Notas de decisão:

- `deliveryFee` é copiada do bar no momento da criação (não referenciada
  dinamicamente), pelo mesmo motivo que `TabItemEntity.price` copia o preço do produto:
  se o bar mudar a taxa depois, pedidos antigos não podem ser afetados retroativamente.
- Não existe `waiterOpen`/`waiterClosed` como em `Tab` porque quem abre o pedido é o
  cliente (sem conta). `attendedBy` registra apenas quem, no painel, processa o pedido.
- `deliveryAddress` fica nullable no banco (pedidos de retirada não têm endereço); a
  obrigatoriedade condicional ao `type` é regra de aplicação, não de schema.

### `OrderItemEntity`

```ts
@Entity({ name: 'order_items', schema: 'public' })
export class OrderItemEntity {
    id: string; // uuid
    name: string; // varchar(120) — snapshot do nome do produto
    price: number; // decimal(10,2) — snapshot do preço
    quantity: number;
    notes?: string; // varchar(255) nullable — ex: "sem cebola" (novo campo, não existe em TabItem)
    category: ProductCategory; // reaproveita o enum já existente em product.entity.ts

    order: OrderEntity; // ManyToOne, onDelete CASCADE

    createdAt: Date;
    updatedAt: Date;
}
```

`OrderItemEntity` não tem `waiterAdded` (não existe garçom adicionando item num pedido
de delivery criado pelo próprio cliente).

## Migrations

Duas migrations, seguindo o padrão de `CreateTabsTable`/`CreateTabItemsTable`:

1. `CreateOrdersTable` — cria tabela `orders` com FK para `bars` e `users`
   (`attended_by_id`, nullable).
2. `CreateOrderItemsTable` — cria tabela `order_items` com FK para `orders`
   (`order_id`, `ON DELETE CASCADE` — mesmo comportamento de `tab_items` → `tabs`).

Gerar via:

```bash
pnpm typeorm migration:generate -d src/database/typeORM.migration-config.ts src/database/migrations/CreateOrdersTable
```

(ou equivalente já usado no projeto para as migrations existentes — confirmar o
comando exato usado historicamente, já que não há script `migration:generate` no
`package.json` hoje; documentar o comando funcional aqui quando confirmado).

## Regras de negócio (para as features seguintes, documentadas aqui por serem regras do
modelo)

- `deliveryAddress` obrigatório quando `type === OrderType.DELIVERY`.
- `totalValue = sum(items[].price * items[].quantity) + deliveryFee`.
- Transições de status válidas (validadas no `OrderService`, feature 02):
  `RECEIVED → PREPARING → READY → OUT_FOR_DELIVERY → COMPLETED`, com `CANCELLED`
  possível a partir de `RECEIVED` ou `PREPARING` apenas (não é possível cancelar um
  pedido já `OUT_FOR_DELIVERY` ou `COMPLETED`).
  - Pedidos `PICKUP` pulam `OUT_FOR_DELIVERY` (`READY → COMPLETED` direto).

## Testes exigidos

- Este arquivo não tem lógica própria para testar (é só schema). A regra de transição
  de status será testada no `OrderService` (feature 02), não aqui.
- Validar que as migrations rodam (`up`) e revertem (`down`) sem erro em ambiente
  local.

## Critérios de aceite

- [ ] `OrderEntity` e `OrderItemEntity` criadas seguindo convenções de nome de coluna
      (`snake_case` via `name:` no `@Column`, igual ao resto do projeto).
- [ ] Migrations aplicadas com sucesso em banco local, com `down` testado manualmente.
- [ ] Enums espelhados no client em `data/models/IOrder.ts` (feature 07 depende disso).

## Dependências

Nenhuma — é o ponto de partida de todo o módulo.

## Estimativa

**1 dia** (0,5 dia de entidades + 0,5 dia de migrations e validação local).
