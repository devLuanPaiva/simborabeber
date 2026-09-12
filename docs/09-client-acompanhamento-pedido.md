# Feature 09 — Acompanhamento do pedido (client público)

> Segue os padrões definidos em [00-padroes-e-qualidade.md](./00-padroes-e-qualidade.md).
> Depende de [08-client-checkout.md](./08-client-checkout.md) e
> [02-modulo-order-api.md](./02-modulo-order-api.md).

## Objetivo

Depois de finalizar o pedido, o cliente precisa de uma tela para ver o status
avançar (recebido → preparando → pronto → saiu para entrega → concluído) sem precisar
de conta/login.

## Escopo

- Rota pública `client/src/app/bares/[slug]/pedido/[orderId]/page.tsx`.
- `GET /order/:id/public` — endpoint público de leitura **restrito ao necessário**:
  retorna status, itens, valores e tempo estimado, mas nunca dados de outros pedidos
  (busca é sempre por `id` exato, UUID não enumerável — nunca por listagem, conforme já
  definido na feature 05).
- Atualização em tempo real via o mesmo `OrderGateway` (feature 04): o client entra na
  sala do próprio pedido (`order:<orderId>`, sala adicional além de `bar:<barId>`) para
  não precisar dar refresh manual.

## Decisão de escopo sobre o endpoint

`OrderController.findOne` (feature 02) é uma rota protegida (uso do painel). Para o
cliente final, criar uma rota **separada e deliberadamente mais enxuta**:

```ts
@Get(':id/public')
@ApiOperation({ summary: 'Consultar status de um pedido (cliente final, sem login)' })
findOnePublic(@Param('id') id: string) {
  return this.orderService.findOnePublicView(id);
}
```

`findOnePublicView` retorna um subconjunto de campos (nunca `attendedBy`, nunca dados
de outros pedidos do mesmo bar) — igual ao cuidado que `TabService.shapeTab` já tem em
não vazar a entidade inteira.

## Regras de negócio

1. Se o `id` não existir, `404` genérico (não revelar se é "não existe" vs "não
   autorizado" — não há necessidade de diferenciar para o cliente final).
2. Sala de socket por pedido (`order:<orderId>`) evita que o cliente final receba
   eventos de outros pedidos do mesmo bar (diferente da sala `bar:<barId>` usada pelo
   painel).

## Testes exigidos

- `findOnePublicView` nunca retorna `attendedBy`/dados administrativos — teste
  explícito checando as chaves do objeto retornado.
- Gateway: entrar na sala `order:<id>` e receber apenas eventos daquele pedido.

## Critérios de aceite

- [ ] Cliente vê o status mudar em tempo real sem dar refresh (testado manualmente:
      mudar status no painel, observar a tela pública atualizar).
- [ ] Nenhum dado administrativo vaza na resposta pública.

## Dependências

[08-client-checkout.md](./08-client-checkout.md), [04-realtime-pedidos.md](./04-realtime-pedidos.md).

## Estimativa

**1 a 1,5 dia**.
