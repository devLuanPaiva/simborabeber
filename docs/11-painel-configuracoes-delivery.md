# Feature 11 — Tela de configurações de delivery no painel

> Segue os padrões definidos em [00-padroes-e-qualidade.md](./00-padroes-e-qualidade.md).
> Depende de [06-configuracoes-delivery-bar.md](./06-configuracoes-delivery-bar.md).

## Objetivo

Dar ao dono/gerente do bar uma tela para ligar/desligar o delivery e configurar taxa,
pedido mínimo, endereço de origem e horário — os campos criados na feature 06.

## Escopo

- Nova seção dentro de uma página de configurações do bar (reaproveitar
  `painel/bar/[slug]/page.tsx` ou criar `painel/bar/[slug]/configuracoes/page.tsx`,
  decisão a confirmar olhando o que já existe hoje em `painel/bar/[slug]/page.tsx` —
  se já for uma tela de edição do bar, esta feature só adiciona uma seção nela; se não
  for, cria a rota nova).
- Formulário: toggle "Delivery habilitado", toggle "Comandas habilitado", taxa de
  entrega, pedido mínimo, endereço de origem, horário de funcionamento (texto livre,
  conforme decidido na feature 06).
- `actions.ts` — `updateDeliverySettings`, seguindo o padrão de
  `cadastrar-bar/actions.ts`/`produtos/editar/[id]/actions.ts` (`serverPatch` +
  `revalidatePath`).
- Restrito a `UserRole.MANAGER` (mesma role que já controla remoção de produto em
  `ProductController.remove`).

## Regras de negócio

1. Ao desligar `comandasEnabled`, o painel deve deixar de mostrar o menu "Comandas"
   para aquele bar (ajuste no layout/menu do painel — verificar onde o menu lateral é
   montado hoje).
2. Ao desligar `deliveryEnabled`, o menu "Pedidos" (feature 10) some do painel daquele
   bar, e o cardápio público deixa de mostrar carrinho (feature 07).

## Testes exigidos

- Action `updateDeliverySettings` chama `serverPatch` com o payload correto e trata
  erro de validação do backend.
- Toggle de `deliveryEnabled`/`comandasEnabled` reflete corretamente na navegação do
  painel (pelo menos um teste manual documentado, já que menu/navegação condicional
  costuma ser difícil de cobrir com teste automatizado nesse estágio do projeto).

## Critérios de aceite

- [ ] Dono do bar consegue habilitar delivery e configurar taxa/mínimo sem suporte
      técnico.
- [ ] Bares existentes continuam funcionando exatamente como hoje até que o dono ligue
      o delivery manualmente (nenhuma mudança de comportamento por padrão).

## Dependências

[06-configuracoes-delivery-bar.md](./06-configuracoes-delivery-bar.md).

## Estimativa

**1 dia**.
