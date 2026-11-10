FROM node:26-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@10.33.2

# Copy package descriptors
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY services/api-gateway/ ./services/api-gateway/

# Install dependencies and build
RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @erp/api-gateway... build

FROM node:26-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g pnpm@10.33.2

COPY --from=builder /app ./

EXPOSE 8000

CMD ["node", "services/api-gateway/dist/main.js"]
