# Plano de Desenvolvimento — Módulo Delivery (simboracomer)

Este diretório contém o plano de implementação do módulo de delivery, expandindo a
plataforma atual (hoje focada em cardápio via QR Code + controle de comandas) para
também suportar pedidos de delivery/retirada feitos pelo próprio cliente.

## Decisão de arquitetura

**Não haverá dois produtos separados.** O "simboracomer" nasce como um módulo dentro
do mesmo monorepo (`api` + `client`), habilitável por bar. Um mesmo `BarEntity` poderá
operar com comandas, com delivery, ou com os dois simultaneamente. Isso evita duplicar
autenticação, cadastro de produtos, upload de imagens, relatórios e o painel
administrativo — tudo isso já é multi-tenant e reutilizável como está.

Motivo: o código atual já resolve os problemas difíceis (multi-tenancy por `bar_id`,
autenticação JWT com refresh, papéis de usuário, upload de imagem, tempo real via
WebSocket) com um padrão consistente. Recomeçar do zero jogaria fora tudo isso sem
necessidade.

## Como ler este plano

- [00-padroes-e-qualidade.md](./00-padroes-e-qualidade.md) — **leia primeiro.** Define o
  padrão arquitetural, convenções de tipagem, testes e qualidade que todas as features
  abaixo devem seguir. Não repetimos essas regras em cada arquivo de feature.
- Um arquivo por feature (01 a 11), cada um com: objetivo, escopo, modelagem/contratos,
  regras de negócio, testes exigidos, critérios de aceite, dependências e estimativa.
- [12-plano-de-entrega.md](./12-plano-de-entrega.md) — ordem de execução, dependências
  entre features e estimativa consolidada de prazo.

## Índice de features

| # | Arquivo | Camada | Resumo |
|---|---|---|---|
| 01 | [01-modelo-dados-pedido.md](./01-modelo-dados-pedido.md) | API/DB | `OrderEntity`, `OrderItemEntity`, migrations |
| 02 | [02-modulo-order-api.md](./02-modulo-order-api.md) | API | CRUD e transições de status do pedido |
| 03 | [03-modulo-order-item-api.md](./03-modulo-order-item-api.md) | API | Itens do pedido |
| 04 | [04-realtime-pedidos.md](./04-realtime-pedidos.md) | API | `OrderGateway` (WebSocket) |
| 05 | [05-endpoint-publico-pedido.md](./05-endpoint-publico-pedido.md) | API | Criação de pedido sem login (cliente final) |
| 06 | [06-configuracoes-delivery-bar.md](./06-configuracoes-delivery-bar.md) | API | Extensão de `BarEntity` (taxa, mínimo, horário) |
| 07 | [07-client-carrinho.md](./07-client-carrinho.md) | Client | Carrinho de compras no cardápio público |
| 08 | [08-client-checkout.md](./08-client-checkout.md) | Client | Checkout (endereço, telefone, pagamento) |
| 09 | [09-client-acompanhamento-pedido.md](./09-client-acompanhamento-pedido.md) | Client | Tela de acompanhamento do pedido |
| 10 | [10-painel-fila-pedidos.md](./10-painel-fila-pedidos.md) | Client (painel) | Fila de pedidos em tempo real |
| 11 | [11-painel-configuracoes-delivery.md](./11-painel-configuracoes-delivery.md) | Client (painel) | Tela de configuração do delivery |

## Fora de escopo (neste plano)

- Integração de pagamento online (Pix automático, cartão). O pagamento é registrado
  como informação (forma escolhida + status manual "pago/pendente"), sem gateway.
- Rastreamento de entregador em mapa / roteirização.
- Aplicativo dedicado para entregadores.

Esses itens podem virar planos futuros, uma vez que a base (pedido, status, painel)
estiver validada em produção.
