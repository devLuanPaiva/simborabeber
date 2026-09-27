# Padrões arquiteturais e qualidade (obrigatório para todas as features)

Este arquivo define o contrato que qualquer código novo do módulo delivery deve
seguir. Ele existe para que o "simboracomer" pareça ter sido escrito pela mesma pessoa
que escreveu o "simborabeber" — mesma estrutura de pastas, mesmos nomes, mesmo nível de
validação e teste.

## 1. Estrutura de módulo (API — NestJS)

Todo recurso novo replica exatamente a estrutura já usada em `tab/` e `tab-item/`:

```
api/src/resources/order/
  dto/
    create-order.dto.ts
    update-order.dto.ts
    update-order-status.dto.ts
  entities/
    order.entity.ts
  repository/
    order.repository.ts
  order.controller.ts
  order.controller.spec.ts
  order.service.ts
  order.service.spec.ts
  order.gateway.ts
  order.gateway.spec.ts
  order.module.ts
```

Regras:

- **Controller** só orquestra HTTP: extrai `req.user.sub`, `@Param`, `@Body`, delega
  tudo para o `Service`. Nenhuma regra de negócio no controller (ver `tab.controller.ts`).
- **Service** contém a regra de negócio (validação de estado, cálculo de total,
  autorização fina) e chama o `Repository` + `Gateway`. Nunca acessa `Repository` do
  TypeORM diretamente — sempre passa pelo `*.repository.ts` do próprio módulo (ver
  `TabService` → `TabRepository`).
- **Repository** é a única camada que conhece `@InjectRepository`/`QueryBuilder`. Deve
  expor métodos com nomes de intenção de negócio (`createOrder`, `updateStatus`,
  `findByBarSlug`), nunca vazar `Repository<Entity>` do TypeORM para fora do módulo.
  Sempre mapear o retorno explicitamente (como `mapTabEntity` faz), nunca devolver a
  entidade crua com todas as relações carregadas sem necessidade.
- **Module** declara `imports: [TypeOrmModule.forFeature([...]), AuthModule,
  forwardRef(() => BarModule), forwardRef(() => UserModule)]` e exporta
  `Service`/`Repository`/`TypeOrmModule` conforme o padrão de `TabModule`.
- **DTOs** usam `class-validator` + `@ApiProperty` do Swagger em todo campo, com
  mensagens de erro em português (ver `create-tab.dto.ts`). DTOs de update estendem o de
  create com `PartialType`.

## 2. Autenticação e autorização

- Rotas internas do painel: `@UseGuards(AuthGuard, RolesGuard)` + `@Roles(...)`,
  idêntico a `TabController`/`ProductController`.
- Rotas públicas (cliente final sem login): **não** aplicar `@UseGuards`, seguindo o
  mesmo padrão já usado em `ProductController.findOne` e
  `ProductController.findAllTheBarProducts`. Isso já é uma convenção existente no
  projeto — não é uma exceção nova.
- Toda rota pública nova deve ser avaliada quanto a abuso (ver
  [05-endpoint-publico-pedido.md](./05-endpoint-publico-pedido.md)): um endpoint sem
  login que cria dados (pedido) é superfície de ataque diferente de um `GET` de
  catálogo.

## 3. Tempo real (WebSocket)

Clonar o padrão de `TabItemGateway`:

- Um namespace dedicado (`@WebSocketGateway({ namespace: 'order' })`).
- Autenticação do socket via JWT no handshake, mesmo fluxo de
  `handleConnection`/`socketMap`.
- Sala por bar (`bar:<barId>`), nunca broadcast global.
- Métodos `notifyX` chamados pelo `Service` após persistir a mudança — o Gateway nunca
  decide regra de negócio, só notifica.

## 4. Tipagem forte

O `tsconfig.json` da API hoje está com `strictNullChecks: false` e `noImplicitAny:
false` (mais permissivo que o do client, que já é `strict: true`). Isso é dívida
técnica existente, mas **todo código novo do módulo delivery deve ser escrito como se o
modo estrito estivesse ligado**:

- Nunca usar `any` implícito ou explícito. Se um retorno de `QueryBuilder.getRawMany()`
  precisar de tipagem, criar uma interface local para o shape da linha crua (ex.:
  `interface OrderRawRow { ... }`), como já seria recomendado fazer em `TabRepository`.
- Todo campo opcional é `?:` explícito na entidade/DTO/interface — nunca depender de
  `undefined` implícito.
- Enums para todo campo de domínio fechado (status, tipo de pedido, forma de
  pagamento), nunca `string` solto — seguindo `TabStatus`, `ProductCategory`.
- Os mesmos enums/labels devem existir espelhados em `client/src/data/models`, como já
  ocorre com `TabStatus`/`TabStatusLabels` em `ITab.ts`.
- Fica registrado como recomendação (fora do escopo deste plano) habilitar
  `strictNullChecks`/`noImplicitAny` no `tsconfig.json` da API como tarefa de dívida
  técnica separada, corrigindo os erros do código já existente.

## 5. Testes

O padrão atual de `*.spec.ts` no projeto é, em sua maioria, um esqueleto (`should be
defined`). Para o módulo delivery, isso não é suficiente — os testes novos devem
cobrir regra de negócio de verdade:

- **Service**: mockar `Repository` e `Gateway` (via `useValue`/`jest.fn()`, sem tocar
  banco), testar: cálculo de total, transições de status válidas/inválidas, chamada do
  `notifyX` do gateway após cada mutação.
- **Controller**: mockar o `Service`, testar que a rota delega os parâmetros corretos
  e aplica o guard/role esperado.
- **Repository**: pode usar teste de integração com banco de teste (se o projeto já
  tiver esse setup) ou, na ausência dele, testes de unidade validando a query
  construída não é prioridade — priorizar Service/Controller.
- **Gateway**: testar `roomName`, e que `notifyX` só emite quando encontra o `barId`
  (mesmo padrão de `tab-item.gateway.spec.ts`).
- Meta mínima: toda regra de negócio nova (cálculo de total, transição de status,
  validação de endereço obrigatório em delivery) tem pelo menos um teste que falha se a
  regra for removida. "Should be defined" sozinho não conta como cobertura de uma
  feature.
- Rodar `pnpm test` e `pnpm test:cov` antes de considerar uma feature pronta.

## 6. Lint e formatação

- API: `pnpm lint` (ESLint com `--fix`) e respeitar `.prettierrc`
  (`singleQuote: true`, `trailingComma: all`).
- Client: `pnpm lint` (`next/core-web-vitals` + `next/typescript`).
- Nenhum PR de feature é considerado pronto com lint quebrado.

## 7. Migrations

- Nunca usar `synchronize: true`. Toda mudança de schema é uma migration em
  `api/src/database/migrations/`, gerada via TypeORM CLI apontando para
  `typeORM.migration-config.ts`, seguindo o padrão de nomes já usado
  (`<timestamp>-DescricaoDaMudanca.ts`).
- Cada migration deve ter `up` e `down` implementados de verdade (reversível), como em
  `CreateTabItemsTable1773251145546`.
- Uma migration por mudança lógica (criar tabela de pedidos ≠ adicionar coluna em
  `bars`) — não acumular múltiplas mudanças não relacionadas numa migration só.

## 8. Client (Next.js) — camadas

Seguir a separação já usada em `client/src`:

- `data/models/*` — interfaces + enums + labels (`IOrder.ts`, análogo a `ITab.ts`).
- `data/types/IApi.ts` — reaproveitar `ApiResponse<T>`/`APIError` já existentes.
- `lib/api/*` — reaproveitar `serverFetch`/`serverPost`/`serverPatch`/`serverDelete`,
  não criar um novo cliente HTTP.
- `app/**/actions.ts` — Server Actions com `"use server"`, retornando sempre
  `{ success, message | error }`, chamando `revalidatePath` no caminho afetado,
  idêntico ao padrão de `comandas/actions.ts`.
- Componentes de UI client-side (`"use client"`) só para interatividade (carrinho,
  formulário, socket) — páginas seguem Server Components por padrão, como hoje.

## 8.1 Camada nova: estado do carrinho (única exceção estrutural)

O carrinho é o único pedaço de estado que não existe hoje no client (tudo hoje é
buscado do servidor). Ele deve ser isolado em `client/src/data/cart/` (contexto React +
`localStorage`), sem se misturar com Server Actions. Detalhado em
[07-client-carrinho.md](./07-client-carrinho.md).

## 9. Definition of Done (aplica-se a todas as features abaixo)

Uma feature só é considerada concluída quando:

1. Segue a estrutura de pastas e nomes descrita acima.
2. Não introduz `any`, nem campos sem tipo explícito.
3. Tem migration (`up`/`down`) quando altera schema.
4. Tem testes de unidade cobrindo a regra de negócio central da feature (não só
   "should be defined").
5. Passa em `lint` e `test` sem warnings novos.
6. Rotas internas exigem `AuthGuard` + `RolesGuard` + `@Roles`; rotas públicas são uma
   decisão explícita e documentada na própria feature.
7. Realtime (quando aplicável) segue o padrão de sala por bar.
