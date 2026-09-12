# Feature 07 — Carrinho de compras (client público)

> Segue os padrões definidos em [00-padroes-e-qualidade.md](./00-padroes-e-qualidade.md),
> seção 8.1 (única camada de estado novo no client).
> Depende de [06-configuracoes-delivery-bar.md](./06-configuracoes-delivery-bar.md) para
> saber se o bar aceita delivery.

## Objetivo

Permitir que o cliente, navegando em `/bares/[slug]`, monte um carrinho de produtos
antes de ir para o checkout (feature 08). Hoje essa página é somente informativa
(`ProductDetail.tsx` não tem nenhuma ação de compra).

## Escopo

- `client/src/data/cart/CartContext.tsx` — contexto React (`"use client"`) +
  `localStorage`, isolado por bar (`cart:<barSlug>` como chave, para não misturar
  carrinho de bares diferentes).
- `client/src/data/models/IOrder.ts` — espelha os enums da feature 01
  (`OrderType`, `PaymentMethod`) + `ICartItem`.
- Botão "Adicionar ao carrinho" em `ProductDetail.tsx` (só visível se
  `bar.deliveryEnabled === true`, vindo do fetch já existente do bar).
- Ícone/indicador de carrinho (contador de itens) no layout de `/bares/[slug]`.
- Componente de carrinho (drawer ou página `/bares/[slug]/carrinho`) com lista de
  itens, ajuste de quantidade, campo de observação por item, e botão "Ir para o
  checkout".

## Contrato de dados

```ts
// client/src/data/models/IOrder.ts
export interface ICartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
    category: ProductCategory;
    image?: string;
}

export interface CartState {
    barSlug: string;
    items: ICartItem[];
}
```

## Regras de negócio (client-side)

1. Adicionar produto já existente no carrinho soma quantidade (não duplica linha).
2. Trocar de bar (navegar para `/bares/[outro-slug]`) não mistura carrinho — cada
   `barSlug` tem sua própria chave de `localStorage`.
3. Carrinho vazio desabilita o botão "Ir para o checkout".
4. `localStorage` pode falhar (modo anônimo, storage bloqueado) — todo acesso deve
   estar em `try/catch`, com fallback para estado em memória apenas (carrinho não
   sobrevive a reload nesse caso, mas a página não quebra).

## Testes exigidos

Como é a primeira peça de estado client-side "de verdade" do projeto (o resto é
Server Component + Server Action), vale teste unitário do reducer/contexto puro
(sem precisar montar toda a árvore React):

- Adicionar item novo cria linha; adicionar item existente soma quantidade.
- Remover item some da lista; ajustar quantidade para `0` remove o item.
- Cálculo de subtotal do carrinho bate com a soma de `price * quantity`.

Usar Jest/Testing Library se já não houver setup de teste no client — confirmar se
`client/package.json` tem `jest`/`vitest` configurado; se não tiver, este é o primeiro
teste de frontend do projeto e precisa da configuração mínima (ver observação na
feature 12).

## Critérios de aceite

- [ ] Carrinho persiste entre navegações dentro do mesmo bar (reload da página mantém
      os itens).
- [ ] Botão de compra só aparece quando `deliveryEnabled = true`.
- [ ] Nenhuma quebra de página quando `localStorage` está indisponível.

## Dependências

[06-configuracoes-delivery-bar.md](./06-configuracoes-delivery-bar.md) (para o flag
`deliveryEnabled` vir da API de bar, já buscada hoje em `/bares/[slug]/page.tsx`).

## Estimativa

**1,5 a 2 dias** (contexto + persistência + UI de drawer/lista + testes).
