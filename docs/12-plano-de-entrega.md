# Plano de entrega — ordem de execução e estimativa consolidada

## Dependências entre features

```
06 (config. delivery no bar)     01 (modelo de dados: Order/OrderItem)
        |                                |
        |                                v
        |                        02 (módulo order API)
        |                          |            |
        |                          v            v
        |                    03 (order-item)  04 (realtime)
        |                          |            |
        +---------> 05 (endpoint público de criação) <---------+
                          |
                          v
        07 (carrinho) --> 08 (checkout) --> 09 (acompanhamento)

02 + 04 --------------------------------------> 10 (fila no painel)
06 ------------------------------------------> 11 (config. no painel)
```

Leitura prática:

- **06** e **01** podem começar em paralelo, no dia 1.
- **02, 03, 04** dependem de **01** e entre si formam a espinha dorsal da API — fazer
  em sequência (03 e 04 podem rodar em paralelo se houver duas pessoas).
- **05** é o ponto de junção: só começa depois de 01–04 e 06 estarem prontos.
- **07** (carrinho) não depende de nada da API — pode começar em paralelo com o
  back-end, usando dados mockados, e só precisa da API pronta (feature 05) para
  integrar o checkout de verdade (feature 08).
- **10** e **11** (painel) podem ser feitas em paralelo com 07/08/09, já que dependem
  só da API, não do fluxo público.

## Ordem recomendada (trabalho solo, sequencial)

1. Feature 01 — Modelo de dados (1 dia)
2. Feature 06 — Config. delivery no bar (0,5 dia)
3. Feature 02 — Módulo order API (2 dias)
4. Feature 03 — Módulo order-item API (1 dia)
5. Feature 04 — Realtime (1 dia)
6. Feature 05 — Endpoint público de criação (1,5 dia)
7. Feature 07 — Carrinho (1,75 dia)
8. Feature 08 — Checkout (1,75 dia)
9. Feature 09 — Acompanhamento do pedido (1,25 dia)
10. Feature 10 — Fila de pedidos no painel (2,25 dias)
11. Feature 11 — Config. de delivery no painel (1 dia)

**Subtotal das features: ~15 dias.**

## Buffer de integração, testes de ponta a ponta e ajustes

- Testes manuais de fluxo completo (cliente cria pedido → painel recebe → atendente
  processa → cliente vê status mudar): **1 dia**.
- Ajustes de UX/copy, estados de erro, responsividade mobile do cardápio (é o
  ambiente onde o cliente final realmente vai usar — celular): **1 dia**.
- Revisão de segurança do endpoint público (rate limiting, validação de preço server-side,
  já desenhada na feature 05, mas revisão final antes de ir ao ar): **0,5 a 1 dia**.

**Buffer total: ~2,5 a 3 dias.**

## Estimativa consolidada

**~17 a 18 dias úteis (aproximadamente 3,5 semanas)**, para um desenvolvedor sozinho,
full-time, já familiarizado com a base de código atual — consistente com a estimativa
inicial de 16–21 dias, agora detalhada por feature.

Fora do escopo desta estimativa (ver [README.md](./README.md)):

- Pagamento online (gateway de Pix/cartão): **+3 a 6 dias**, dependendo do provedor
  escolhido (Mercado Pago, Stripe, Pagar.me).
- Horário de funcionamento estruturado por dia da semana com bloqueio automático de
  pedido fora do horário: **+1 dia**.
- Testes automatizados de frontend, caso o projeto ainda não tenha um runner
  configurado (Jest/Testing Library ou Vitest) — a configuração inicial em si
  (não os testes) fica em **+0,5 dia**, um custo único que beneficia o projeto todo,
  não só o delivery.

## Critério de "pronto para produção"

Além do Definition of Done por feature (ver
[00-padroes-e-qualidade.md](./00-padroes-e-qualidade.md), seção 9):

- [ ] Fluxo completo testado manualmente em ao menos um bar real de teste, do celular.
- [ ] Nenhum bar existente teve comportamento alterado sem ação explícita do dono
      (delivery nasce desligado por padrão).
- [ ] Rate limiting ativo no endpoint público antes do deploy.
- [ ] Migrations aplicadas em produção com `down` validado em ambiente de homologação.
