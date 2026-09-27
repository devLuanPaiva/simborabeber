# Feature 10 — Fila de pedidos no painel administrativo

> Segue os padrões definidos em [00-padroes-e-qualidade.md](./00-padroes-e-qualidade.md).
> Depende de [02-modulo-order-api.md](./02-modulo-order-api.md) e
> [04-realtime-pedidos.md](./04-realtime-pedidos.md).

## Objetivo

Tela equivalente a `/painel/bar/[slug]/comandas`, mas para pedidos de delivery: o
atendente vê os pedidos chegarem em tempo real, muda o status e acompanha o fluxo até
a conclusão.

## Escopo

- Rota `client/src/app/painel/bar/[slug]/pedidos/page.tsx` — lista/kanban de pedidos
  agrupados por status (colunas: Recebidos, Preparando, Prontos, Saiu para entrega,
  Concluídos — a última com paginação/filtro por data, não carregar histórico
  completo por padrão).
- `client/src/app/painel/bar/[slug]/pedidos/actions.ts` — `getOrdersByBarSlug`,
  `updateOrderStatus`, seguindo exatamente o padrão de `comandas/actions.ts`
  (`cache: "no-store"`, `revalidatePath`, retorno `{ success, ... }`).
- Componente `client/src/app/painel/bar/[slug]/pedidos/_components/OrderCard.tsx` —
  exibe cliente, telefone (com atalho para WhatsApp, reaproveitando
  `data/functions/openWhatsApp.ts` já existente no projeto), itens, endereço/forma de
  retirada, total, botões de avançar status.
- Integração com socket (`order` namespace, sala `bar:<id>`) para inserir/atualizar
  cards sem reload — hook `useOrderSocket` isolado (`"use client"`), análogo a
  qualquer hook de socket que já exista para `tab-item` (se existir; senão, este é o
  primeiro, e vira o padrão a seguir para os dois módulos).
- Notificação sonora/visual (toast) quando um pedido novo chega enquanto a tela está
  aberta.

## Regras de negócio (client)

1. Botões de transição de status mostram apenas as próximas transições válidas (não
   deixar o atendente tentar pular etapa — a validação real é no backend, feature 02,
   mas a UI não deve nem oferecer a opção inválida).
2. Cancelamento exige confirmação (modal), pois afeta o cliente final que está
   aguardando.
3. Pedido `PICKUP` não mostra coluna/status "Saiu para entrega".

## Testes exigidos

- Testes de action (mesmo padrão sugerido na feature 08) para `getOrdersByBarSlug` e
  `updateOrderStatus`.
- Se houver suíte de componente configurada (ver observação na feature 12): teste de
  que `OrderCard` só renderiza os botões de transição válidos para o status atual.

## Critérios de aceite

- [ ] Pedido novo aparece na coluna "Recebidos" sem reload.
- [ ] Mudança de status feita no painel reflete instantaneamente na tela de
      acompanhamento do cliente (feature 09) — teste manual cruzado.
- [ ] Atalho de WhatsApp abre conversa com o número do cliente pré-preenchido.

## Dependências

[02-modulo-order-api.md](./02-modulo-order-api.md),
[04-realtime-pedidos.md](./04-realtime-pedidos.md).

## Estimativa

**2 a 2,5 dias**.
