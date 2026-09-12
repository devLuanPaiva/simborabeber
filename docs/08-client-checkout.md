# Feature 08 — Checkout (client público)

> Segue os padrões definidos em [00-padroes-e-qualidade.md](./00-padroes-e-qualidade.md).
> Depende de [07-client-carrinho.md](./07-client-carrinho.md) e
> [05-endpoint-publico-pedido.md](./05-endpoint-publico-pedido.md).

## Objetivo

Coletar os dados finais do pedido (tipo de entrega, nome, telefone, endereço se
aplicável, forma de pagamento) e submeter para `POST /order/by-bar/:slug`.

## Escopo

- Rota `client/src/app/bares/[slug]/checkout/page.tsx` (Server Component que renderiza
  o formulário; o formulário em si é `"use client"` pois lê o carrinho do contexto).
- `client/src/app/bares/[slug]/checkout/actions.ts` — Server Action `createOrder`,
  seguindo exatamente o padrão de `createTab` em `comandas/actions.ts`: recebe
  `FormData` + os itens do carrinho (via campo oculto serializado em JSON, já que
  Server Actions recebem `FormData`), chama `serverPost`, retorna
  `{ success, message | error }`.
- Formulário: seletor `delivery`/`pickup`, campos nome/telefone, endereço (condicional),
  seletor de forma de pagamento, campo de observação geral, resumo do pedido (itens +
  taxa de entrega + total).
- Ao sucesso, redirecionar para `/bares/[slug]/pedido/[orderId]` (feature 09) e limpar
  o carrinho.

## Regras de negócio (client)

1. Validação de formulário no client (campos obrigatórios) **antes** de chamar a
   action — mas a validação de verdade é sempre a do backend (DTO da feature 05); o
   client só evita round-trip desnecessário.
2. Endereço só é exibido/obrigatório quando o tipo selecionado é `delivery`.
3. Se `bar.minOrderValue` não for atingido, desabilitar o botão de finalizar e mostrar
   quanto falta (usa o subtotal já calculado no carrinho, comparado ao valor de
   `minOrderValue` vindo da página do bar).
4. Erros retornados pela action (ex.: "bar fechado", "pedido mínimo não atingido") são
   exibidos via `sonner` (`Toaster`), mesmo padrão de toast já usado no projeto
   (`components/ui/sonner`, `utils/toast-ui.ts`).

## Testes exigidos

- Teste da Server Action `createOrder`: dado um payload válido, chama `serverPost` com
  o corpo esperado e retorna `success: true`; dado um erro `400` da API, retorna
  `success: false` com a mensagem de erro repassada (mesmo padrão de teste que se
  aplicaria a `createTab`, hoje não coberto — não é regressão, é o padrão a seguir daqui
  pra frente).
- Teste de que o formulário não permite submeter sem endereço quando `type = delivery`.

## Critérios de aceite

- [ ] Fluxo completo (adicionar item → checkout → pedido criado) funcional em ambiente
      local, testado manualmente no navegador antes de considerar pronto (seguindo a
      diretriz geral do projeto de testar UI no browser, não só nos specs).
- [ ] Carrinho é limpo após sucesso, evitando pedido duplicado por reenvio.
- [ ] Erros de validação do backend aparecem de forma legível para o usuário final.

## Dependências

[07-client-carrinho.md](./07-client-carrinho.md),
[05-endpoint-publico-pedido.md](./05-endpoint-publico-pedido.md).

## Estimativa

**1,5 a 2 dias**.
