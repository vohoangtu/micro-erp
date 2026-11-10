FROM node:26-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@10.33.2

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/pos/ ./apps/pos/

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @erp/pos build

FROM node:26-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g pnpm@10.33.2

COPY --from=builder /app ./

EXPOSE 3004

CMD ["pnpm", "--filter", "@erp/pos", "start"]
