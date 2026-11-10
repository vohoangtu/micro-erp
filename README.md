# BHN CORE — Enterprise Microservices ERP & Hybrid AI Copilot (2026 Edition)

Hệ thống kiến trúc **Event-Driven Hub & Spoke Microservices** tích hợp đa module nghiệp vụ vận hành (**CRM, Booking, POS/ERP, HR & Payroll**) kết nối qua **BHN Core Hub** và phục vụ trực tiếp các kênh giá trị (**Member App, Management BI Dashboard, AI Copilot**).

```text
┌──────────────┐
│     CRM      │──┐
└──────────────┘  │
┌──────────────┐  │       ┌──────────────────────┐       ┌────────────────┐
│   BOOKING    │──┼──────▶│       BHN CORE       │──────▶│   MEMBER APP   │
└──────────────┘  │       │ (INTEGRATION + DATA) │       └────────────────┘
┌──────────────┐  │       └──────────────────────┘       ┌────────────────┐
│  ERP / POS   │──┤                                      │ MANAGEMENT BI  │
└──────────────┘  │                                      └────────────────┘
┌──────────────┐  │                                      ┌────────────────┐
│ HR / PAYROLL │──┘                                      │   AI COPILOT   │
└──────────────┘                                         └────────────────┘
```

---

## 🚀 Bộ Công Nghệ Chuẩn Năm 2026 (VPS & Docker Native)

* **Monorepo & Tooling:** [Turborepo 2.11+](https://turbo.build/) + [pnpm 10.33+](https://pnpm.io/) + **Node.js 26 LTS** + **TypeScript 5.8+**
* **Frontend Applications:** **Next.js 16.4+ (Turbopack)** + **React 19.3** + **Tailwind CSS 4.3+** + **shadcn/ui**
* **API Gateway & Microservices:** **NestJS 12.4+** với **Fastify Engine** (siêu tốc, tiêu tốn ít RAM)
* **Database & Vector Store:** **PostgreSQL 17** + **pgvector** (chỉ mục HNSW đa luồng cho RAG) + **Drizzle ORM 0.45+**
* **Event Broker (Message Bus):** **NATS 2.29+ JetStream** (~20MB RAM, độ trễ microsecond)
* **Caching & In-Memory Store:** **Valkey 8+** (Linux Foundation)
* **Hybrid AI Copilot:** **Vercel AI SDK v7.0+** kết hợp **Google Gemini 2.5 Flash** (Context 1M+, tối ưu tiếng Việt) & **OpenAI GPT-4o**
* **Reverse Proxy & Ingress:** **Traefik v3** (tự động cấp SSL Let's Encrypt qua Docker labels, hỗ trợ HTTP/3 QUIC)

---

## 📂 Cấu Trúc Dự Án (Monorepo Workspace)

```text
microservice-erp/
├── apps/
│   ├── web-admin/                # Next.js 16.4 + React 19.3 Management BI & Admin Portal (Port 3000)
│   └── member-app/               # React 19.3 PWA / Mobile Web cho hội viên (Port 3001)
├── services/
│   └── api-gateway/              # NestJS 12.4 Fastify Gateway & Domain Controllers (Port 8000)
│       ├── src/auth/             # Xác thực JWT & phân quyền vai trò (RBAC)
│       ├── src/crm/              # Quản lý khách hàng, hội viên, loyalty points
│       ├── src/booking/          # Lịch hẹn, điều phối kỹ thuật viên, ca dịch vụ
│       ├── src/pos/              # Điểm bán POS, xuất nhập kho, thanh toán
│       ├── src/hr/               # Quản lý nhân sự, tính lương & hoa hồng tự động
│       └── src/ai/               # Trợ lý AI Copilot Hybrid (RAG trên Postgres + LLM)
├── packages/
│   ├── database/                 # Drizzle ORM Schema cho PostgreSQL 17 + pgvector
│   ├── event-bus/                # NATS JetStream Client chuẩn hóa (Pub/Sub Event-Driven)
│   ├── shared-types/             # TypeScript DTOs, Enums, Zod Validation Schemas
│   └── config/                   # Cấu hình dùng chung
├── deploy/
│   ├── docker-compose.yml        # Triển khai toàn bộ hệ thống lên VPS (1 lệnh duy nhất)
│   ├── docker-compose.infra.yml  # Cụm hạ tầng phục vụ Local Dev (Postgres 17, Valkey, NATS)
│   └── traefik/                  # Cấu hình Traefik v3 HTTP/3 & Let's Encrypt
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

---

## ⚡ Hướng Dẫn Khởi Chạy Nhanh

### 1. Yêu cầu môi trường
* Node.js >= 22 (Khuyến nghị **Node.js 26**)
* `pnpm` >= 10
* Docker & Docker Compose

### 2. Cài đặt Dependencies & Build
```bash
# Cài đặt toàn bộ dependencies trong monorepo
pnpm install

# Build tất cả các packages và services
pnpm build
```

### 3. Khởi động môi trường Phát triển Cục bộ (Local Dev)
```bash
# Bước 1: Khởi động cụm hạ tầng (Postgres 17 + pgvector, Valkey 8, NATS JetStream)
pnpm infra:up

# Bước 2: Chạy song song toàn bộ services & web apps qua Turborepo
pnpm dev
```

* **Management BI & Web Admin:** [http://localhost:3000](http://localhost:3000)
* **Member App (Mobile Portal):** [http://localhost:3001](http://localhost:3001)
* **API Gateway & Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **NATS Monitoring:** [http://localhost:8222](http://localhost:8222)

---

## 🐳 Triển Khai 1-Click trên VPS (Production Delivery)

Khi bàn giao cho khách hàng hoặc đưa lên máy chủ VPS Linux (Ubuntu / Debian):

```bash
# 1. Sao chép và cấu hình biến môi trường
cp .env.example .env
nano .env

# 2. Khởi chạy toàn bộ hệ thống bằng Docker Compose
pnpm vps:up
# hoặc: docker compose -f deploy/docker-compose.yml up -d --build
```

Traefik v3 sẽ tự động cấu hình routing và xin chứng chỉ SSL Let's Encrypt qua domain bạn khai báo trong `.env`.

---

## 🤖 Khối AI Copilot (Hybrid Architecture)

* **Dữ liệu an toàn tại máy chủ:** Toàn bộ dữ liệu doanh thu, thông tin khách hàng, lịch hẹn và vector embedding lưu trong database PostgreSQL 17 của khách hàng.
* **Không cần đầu tư Server GPU đắt tiền:** Năng lực suy luận LLM được gọi qua Cloud API (Google Gemini 2.5 Flash hoặc OpenAI GPT-4o) thông qua cấu hình `GEMINI_API_KEY` trong `.env`.
* **Cơ chế Fallback thông minh:** Ngay cả khi chưa cấu hình API Key, AI Copilot vẫn tự động phân tích dữ liệu trực tiếp từ PostgreSQL và đưa ra báo cáo tổng hợp chuẩn xác.

---

## 📄 Bản Quyền & Giấy Phép Bàn Giao
Source-Available Enterprise License. Khách hàng được quyền sử dụng nội bộ và tùy biến phát triển. Mọi yêu cầu hỗ trợ kỹ thuật chuyên sâu và gói tính năng mở rộng vui lòng liên hệ đội ngũ phát triển.
