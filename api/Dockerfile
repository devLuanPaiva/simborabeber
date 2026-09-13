FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm@10

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3001

CMD ["node", "dist/main.js"]