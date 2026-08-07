# Unsung Harvest Backend

Production-ready NestJS e-commerce API for the **Unsung Harvest** platform.

## Tech Stack

- **NestJS** — Modular API framework
- **PostgreSQL (NeonDB)** — Primary database
- **TypeORM** — ORM with migrations & soft deletes
- **JWT + Passport** — Authentication with refresh tokens
- **Swagger** — API documentation at `/api/docs`
- **Winston** — Structured logging
- **Helmet, Compression, Throttler** — Security & performance

## Project Structure

```
src/
├── common/          # Guards, filters, interceptors, decorators, DTOs, enums
├── config/          # Environment configuration
├── database/        # Entities, migrations, TypeORM config
├── auth/            # JWT authentication
├── users/           # User management
├── buyers/          # Buyer profiles & addresses
├── sellers/         # Seller profiles & approval
├── admins/          # Admin management
├── products/        # Product catalog
├── categories/      # Product categories
├── orders/          # Order processing
├── cart/            # Shopping cart
├── wishlist/        # Wishlist
├── payments/        # Payment records
├── notifications/   # User notifications
├── season/          # Season metadata
├── nutrition/       # Nutrition information
├── locations/       # Cultivation locations
├── uploads/         # Product image uploads
├── dashboard/       # Admin dashboard stats
└── reports/         # Sales & analytics reports
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Update `.env` with your Neon PostgreSQL credentials and JWT secrets.

### 3. Run in development

```bash
npm run start:dev
```

API: `http://localhost:3000/api/v1`  
Swagger: `http://localhost:3000/api/docs`

### 4. Run migrations (production)

```bash
npm run migration:run
```

## API Conventions

- **All endpoints use POST** method
- **Protected routes** require `Authorization: Bearer <token>`
- **Response format:**

```json
{
  "success": true,
  "message": "Request processed successfully",
  "data": {}
}
```

## Roles

| Role | Description |
|------|-------------|
| `buyer` | Browse, cart, orders, wishlist |
| `seller` | Manage products, uploads |
| `super_cold_admin` | Full platform administration |

## Key Endpoints

| Module | Endpoint | Description |
|--------|----------|-------------|
| Auth | `POST /auth/register` | Register buyer/seller |
| Auth | `POST /auth/login` | Login & get tokens |
| Auth | `POST /auth/refresh` | Refresh access token |
| Products | `POST /products/list` | List products (public) |
| Cart | `POST /cart/add` | Add to cart (buyer) |
| Orders | `POST /orders/create` | Place order (buyer) |
| Dashboard | `POST /dashboard/stats` | Admin statistics |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Development with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run start:prod` | Run production build |
| `npm run migration:generate` | Generate migration |
| `npm run migration:run` | Run pending migrations |

## License

UNLICENSED — Private project
