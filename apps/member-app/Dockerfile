FROM node:26-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@10.33.2

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/member-app/ ./apps/member-app/

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @erp/member-app build

FROM node:26-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g pnpm@10.33.2

COPY --from=builder /app ./

EXPOSE 3001

CMD ["pnpm", "--filter", "@erp/member-app", "start"]
