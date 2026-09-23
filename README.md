# CloudMart — Cloud-Native Marketplace

A production-oriented marketplace application with a React/TypeScript frontend and a Spring Boot backend.

## Architecture

```
React / TypeScript / Vite / Tailwind CSS
        ↓ REST API
Spring Boot / Spring Security / Spring Data JPA
        ↓
PostgreSQL (database) + Redis (caching)
```

```
GitHub → GitHub Actions → Docker → AWS (ECS / RDS / ElastiCache / S3)
```

## Repository structure

```
├── src/                          # React frontend (TypeScript, Vite, Tailwind)
├── backend/                      # Spring Boot backend (Java 21, Maven)
│   ├── src/main/java/.../        # Application source code
│   ├── src/main/resources/       # application.yml, Flyway migrations
│   ├── src/test/                 # Unit and integration tests
│   ├── pom.xml
│   └── Dockerfile
├── docker/                       # PostgreSQL and Redis Dockerfiles
├── .github/workflows/            # CI/CD pipelines
├── docs/                         # AWS deployment guide
├── docker-compose.yml            # Full local stack
├── Dockerfile.frontend           # Frontend container
└── nginx.conf                    # Frontend nginx config
```

## Backend structure

```
backend/src/main/java/com/cloudmart/backend/
├── config/         SecurityConfig, RedisConfig, OpenApiConfig, DataInitializer
├── controller/     REST controllers (thin, delegate to services)
├── dto/            Request and response objects with validation
├── entity/         JPA entities with relationships and constraints
├── repository/     Spring Data JPA repositories
├── service/        Business logic (transactional)
├── security/       JWT auth, filters, SecurityUtils
├── exception/      Global exception handling
└── mapper/         Entity-to-DTO mappers
```

## Running locally with Docker

```bash
docker compose up
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- Backend on port 8080
- Frontend on port 3000

## Running the frontend only

The frontend is deployed on Bolt Cloud and also runs locally:

```bash
npm install
npm run dev
```

Set `VITE_API_BASE_URL` to point the frontend at any backend.

## Running the backend

```bash
cd backend
mvn spring-boot:run
```

Requires PostgreSQL and Redis running (use `docker compose up postgres redis`).

## API documentation

When the backend is running, Swagger UI is available at:
`http://localhost:8080/swagger-ui.html`

## Authentication

JWT-based authentication with three roles:
- **CUSTOMER** — browse, cart, orders, reviews
- **SELLER** — manage own products, reply to reviews
- **ADMIN** — manage categories, view audit logs, platform stats

## Database

PostgreSQL with Flyway migrations in `backend/src/main/resources/db/migration/`.

Entities: User, Role, SellerProfile, Product, Category, ProductImage, Cart, CartItem, Order, OrderItem, Payment, Review, AuditLog.

## Redis

Cache-aside pattern for products and categories with TTL-based expiration.
Cache invalidation on writes via `@CacheEvict`.

## CI/CD

GitHub Actions workflows:
- `backend-ci.yml` — compile, test, package
- `frontend-ci.yml` — typecheck, lint, build
- `docker-build.yml` — build and push Docker images
- `deploy.yml` — deployment-ready (AWS steps commented out)

See [docs/aws-deployment.md](docs/aws-deployment.md) for AWS setup instructions.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Spring Boot 3.2, Java 21, Spring Security, Spring Data JPA |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | JWT (jjwt) |
| API Docs | OpenAPI 3 / Swagger UI |
| Migrations | Flyway |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Cloud | AWS (ECS, RDS, ElastiCache, S3, CloudFront) |
