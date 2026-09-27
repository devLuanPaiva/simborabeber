# Feature 06 — Configurações de delivery no `BarEntity`

> Segue os padrões definidos em [00-padroes-e-qualidade.md](./00-padroes-e-qualidade.md).

## Objetivo

Cada bar decide se opera com delivery, com quais regras (taxa, pedido mínimo, formas
de pagamento aceitas) e com qual endereço de origem. Esta feature estende `BarEntity`
e o `BarModule` — é pré-requisito de [05](./05-endpoint-publico-pedido.md) e de
[11-painel-configuracoes-delivery.md](./11-painel-configuracoes-delivery.md).

## Escopo

- Novas colunas em `BarEntity`.
- Migration `AddDeliverySettingsToBars`.
- Extensão de `UpdateBarDto` (não precisa de DTO novo, `BarModule` já existe).
- **Não inclui** a tela do painel que edita essas configurações (feature 11).

## Modelagem — novas colunas em `BarEntity`

```ts
@Column({ type: 'boolean', default: false, name: 'delivery_enabled' })
deliveryEnabled: boolean;

@Column({ type: 'boolean', default: true, name: 'comandas_enabled' })
comandasEnabled: boolean; // explicita o módulo que já existe hoje, permitindo desligar por bar

@Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'delivery_fee' })
deliveryFee: number;

@Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'min_order_value' })
minOrderValue: number;

@Column({ type: 'varchar', length: 255, nullable: true, name: 'delivery_origin_address' })
deliveryOriginAddress?: string;

@Column({ type: 'varchar', length: 255, nullable: true, name: 'opening_hours' })
openingHours?: string; // texto livre nesta primeira versão (ex.: "Ter-Dom, 18h-23h30")
```

Decisão de escopo: `openingHours` como texto livre (não estruturado por dia da semana)
para não inflar o prazo — bloquear pedido fora do horário automaticamente **não** entra
nesta versão; o campo é só informativo no cardápio público. Estruturar horário por dia
(e bloquear pedidos fora dele) fica registrado como evolução futura, fora deste plano.

## Regras de negócio

- `comandasEnabled`/`deliveryEnabled` controlam o que aparece tanto no client público
  quanto no painel (ex.: se `deliveryEnabled = false`, a rota pública de criação de
  pedido da feature 05 responde `403`, e o client não mostra botão de "adicionar ao
  carrinho").
- `deliveryFee`/`minOrderValue` só fazem sentido quando `deliveryEnabled = true` — a
  validação de update pode avisar mas não é obrigatório bloquear no backend (é uma
  configuração administrativa, não input de cliente final).

## Testes exigidos

- `bar.service.spec.ts`: update de configurações de delivery persiste os novos campos.
- Sem regra de máquina de estado aqui — é CRUD simples de configuração.

## Critérios de aceite

- [ ] Migration aplicada com `default` coerente (bares existentes continuam com
      `deliveryEnabled = false`, `comandasEnabled = true` — nenhum bar atual muda de
      comportamento sem ação explícita do dono).
- [ ] `UpdateBarDto` aceita os novos campos como opcionais.

## Dependências

Nenhuma (pode ser feita em paralelo com a feature 01).

## Estimativa

**0,5 dia**.
