# Feature 04 — Tempo real de pedidos (`OrderGateway`)

> Segue os padrões definidos em [00-padroes-e-qualidade.md](./00-padroes-e-qualidade.md).
> Depende de [02-modulo-order-api.md](./02-modulo-order-api.md).

## Objetivo

Notificar o painel administrativo em tempo real quando: (a) um novo pedido chega, (b)
o status de um pedido muda, (c) um item é ajustado/removido. É a peça que faz o
atendente "ver" o pedido chegar sem precisar dar F5 — clone direto do
`TabItemGateway`.

## Escopo

`api/src/resources/order/order.gateway.ts` (colocado no módulo `order`, compartilhado
por `order-item`, ver nota na feature 03).

## Contrato

```ts
@WebSocketGateway({ namespace: 'order' })
@Injectable()
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // handleConnection / handleDisconnect / roomName: idênticos a TabItemGateway,
  // reautenticando por JWT e associando o socket ao bar do usuário logado.

  async notifyOrderCreated(order: OrderEntity): Promise<void> {}
  async notifyOrderStatusUpdated(order: OrderEntity): Promise<void> {}
  async notifyOrderItemUpdated(orderId: string, item: OrderItemEntity): Promise<void> {}
  async notifyOrderItemDeleted(orderId: string, itemId: string): Promise<void> {}
}
```

Eventos emitidos (nomes espelhando `tab_item_added`, etc.):

- `order_created`
- `order_status_updated`
- `order_item_updated`
- `order_item_deleted`

## Diferença deliberada em relação a `TabItemGateway`

`notifyOrderCreated` é chamado a partir do **endpoint público** (feature 05), que roda
sem usuário autenticado. Isso significa que o `OrderService`/`OrderGateway` precisa
resolver o `barId` a partir do próprio pedido recém-criado (`order.bar.id`), não de um
usuário logado — o mesmo padrão que `notifyItemAdded` já usa hoje
(`tabRepository.findByIdWithBar(tabId)` para achar o `barId`), então não é uma mudança
de design, só uma confirmação de que o padrão já suporta esse caso.

## Testes exigidos (`order.gateway.spec.ts`, espelhando `tab-item.gateway.spec.ts`)

- `notifyOrderCreated` emite no room `bar:<id>` correto.
- Se o pedido não tiver `bar` resolvido (edge case improvável, mas defensivo), o
  método não lança erro e simplesmente não emite.
- `roomName` gera o formato esperado.

## Critérios de aceite

- [ ] Painel recebe evento `order_created` sem refresh manual (testado manualmente com
      dois clientes: um criando pedido pela loja pública, outro com o painel aberto).
- [ ] Reconexão do socket do painel volta a entrar na sala correta do bar.

## Dependências

[02-modulo-order-api.md](./02-modulo-order-api.md).

## Estimativa

**1 dia** (é praticamente uma cópia adaptada de `TabItemGateway`).
