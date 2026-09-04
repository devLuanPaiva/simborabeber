# SIMBORA BEBER — Cardápio Digital e Controle de Comandas para Bares e Espetinhos

<div align="center">
    <img src="https://www.simborabeber.com.br/logo-sem-fundo.png" width="350px">
    <div data-badges>
        <img src="https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
        <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
        <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
        <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
        <br/>
        <img src="https://img.shields.io/badge/postgresql-%23336791.svg?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
        <img src="https://img.shields.io/badge/typeorm-%23FE0803.svg?style=for-the-badge&logo=typeorm&logoColor=white" alt="TypeORM" />
        <img src="https://img.shields.io/badge/node.js-%23339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
        <br/>
        <img src="https://img.shields.io/badge/aws-%23232F3E.svg?style=for-the-badge&logo=amazonaws&logoColor=white" alt="AWS" />
        <img src="https://img.shields.io/badge/amazon%20ec2-%23FF9900.svg?style=for-the-badge&logo=amazonec2&logoColor=white" alt="Amazon EC2" />
        <img src="https://img.shields.io/badge/aws%20amplify-%23C21325.svg?style=for-the-badge&logo=awsamplify&logoColor=white" alt="AWS Amplify" />
        <img src="https://img.shields.io/badge/route%2053-%238C4FFF.svg?style=for-the-badge&logo=amazonroute53&logoColor=white" alt="Route 53" />
        <br/>
        <img src="https://img.shields.io/badge/amazon%20s3-%23569A31.svg?style=for-the-badge&logo=amazons3&logoColor=white" alt="Amazon S3" />
        <img src="https://img.shields.io/badge/cloudfront-%238C4FFF.svg?style=for-the-badge&logo=amazoncloudfront&logoColor=white" alt="Amazon CloudFront" />
        <img src="https://img.shields.io/badge/eventbridge-%23FF4F8B.svg?style=for-the-badge&logo=amazoneventbridge&logoColor=white" alt="Amazon EventBridge" />
    </div>
</div>

## 🍻 Sobre o Projeto

O **Simbora Beber** nasceu de uma necessidade bem concreta do dia a dia de bares, espetinhos e petiscarias: **substituir o cardápio de papel e a comanda de caneta por algo simples, rápido e confiável**.

Na prática, o cliente senta na mesa, aponta a câmera do celular para o **QR Code** e o cardápio digital abre na hora — sem instalar aplicativo, sem cadastro, sem espera. Do outro lado, o dono do bar acompanha as **comandas abertas**, o que já foi consumido em cada mesa e quanto vendeu no dia, na semana e no mês.

No **Simbora Beber**, você encontra:

- **Cardápio digital por QR Code** — cada mesa tem seu código, e o cliente acessa o cardápio atualizado direto do celular, com fotos, descrições e preços sempre corretos;
- **Controle de comandas** — abertura, lançamento de itens, acompanhamento do consumo por mesa e fechamento, tudo centralizado e sem risco de comanda perdida;
- **Relatórios de vendas** — visão diária, semanal e mensal do faturamento, com os números que realmente ajudam a decidir o que comprar, o que promover e o que tirar do cardápio;
- **Atualização instantânea** — mudou o preço ou acabou o estoque de um item? A alteração aparece para o cliente na mesma hora, sem reimprimir nada.

O objetivo é tirar o peso operacional do estabelecimento e deixar a equipe focada no que importa: atender bem e vender mais.

> **Simbora Beber — o cardápio na mesa, a comanda sob controle e as vendas na palma da mão.**

---

## 🏗️ Arquitetura e Tecnologias

O projeto foi construído com foco em **arquitetura limpa**, separação clara de responsabilidades e qualidade de código, priorizando manutenibilidade e evolução contínua. Toda a infraestrutura roda na **AWS**.

### 🧱 Organização do Código

A aplicação segue os princípios de **Clean Architecture**, com as camadas bem delimitadas:

- **Domínio** — entidades e regras de negócio isoladas de framework e de banco de dados;
- **Casos de uso** — a orquestração das regras, independente de como os dados entram ou saem;
- **Infraestrutura** — repositórios, persistência com TypeORM e integrações externas;
- **Apresentação** — rotas, páginas e componentes do Next.js.

Essa separação mantém o núcleo do sistema testável e permite trocar detalhes de infraestrutura sem tocar nas regras de negócio.

### 🔧 Stack Tecnológica

**Frontend & Backend**

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Requisições executadas diretamente no servidor** (Server Components e Server Actions), reduzindo chamadas de API expostas ao cliente e melhorando desempenho e segurança

**Banco de Dados**

- **PostgreSQL**
- **TypeORM** (entidades, migrations e repositórios)

**Infraestrutura (AWS)**

- **AWS Amplify**

  - Hospedagem e deploy contínuo do frontend;

- **EC2**

  - Instância dedicada ao banco de dados PostgreSQL, com IP fixo;
  - Ligada e desligada automaticamente via **EventBridge Scheduler**, mantendo a instância ativa apenas no horário de operação e otimizando custos;

- **Amazon S3**

  - Armazenamento das imagens do cardápio e demais arquivos estáticos;

- **Amazon CloudFront (CDN)**

  - Distribuição do conteúdo do S3 em cache de borda, garantindo carregamento rápido do cardápio no celular do cliente e reduzindo o tráfego direto no bucket;

- **Amazon EventBridge Scheduler**

  - Agendamentos responsáveis pelo start/stop programado da instância EC2;

- **Amazon Route 53**

  - Gerenciamento do domínio e das entradas de DNS da aplicação.

---

## 📱 Cardápio via QR Code

Cada mesa do estabelecimento recebe um **QR Code próprio**, que leva o cliente direto ao cardápio digital já identificando de qual mesa a leitura partiu. Dessa forma:

- O cliente consulta o cardápio completo sem depender do garçom;
- O consumo é vinculado automaticamente à mesa correta;
- Não existe custo de reimpressão a cada alteração de preço ou de item;
- A experiência funciona no navegador do celular, sem instalação de aplicativo.

---

## 🧾 Comandas e Relatórios

O módulo de gestão concentra a operação do bar:

- **Comandas** — abertura por mesa, lançamento de pedidos, acompanhamento em tempo real do consumo e fechamento com o total consolidado;
- **Relatório diário** — faturamento do dia, itens mais vendidos e movimento por período;
- **Relatório semanal** — comparativo entre os dias e leitura do comportamento ao longo da semana;
- **Relatório mensal** — visão consolidada do mês, útil para planejamento de compras e definição de promoções.

---

## 👨‍💻 Autor

Desenvolvido por **Dev Luan Paiva**.

---

## 📄 Licença

Este projeto é de uso privado/organizacional. Ajuste esta seção conforme a licença desejada.
