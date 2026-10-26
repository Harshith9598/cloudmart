# CloudMart – Cloud-Native Marketplace

CloudMart is a full-stack marketplace application where customers can browse products, add items to their cart, and place orders. Sellers can manage their products, and admins can manage the platform.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Java 21, Spring Boot
- **Database:** PostgreSQL
- **Caching:** Redis
- **Authentication:** JWT, Spring Security
- **Tools:** Docker, GitHub Actions
- **Cloud:** AWS (deployment-ready setup)

## Features

- User registration and login
- Role-based access for customers, sellers, and admins
- Browse and search products
- Shopping cart and order management
- Seller product management
- Product reviews
- Redis caching for products and categories
- REST APIs with Swagger documentation

## Project Structure

- `src/` – Frontend code
- `backend/` – Spring Boot backend
- `docker/` – Docker configuration
- `.github/workflows/` – GitHub Actions workflows
- `docs/` – AWS deployment guide

## Run Locally

Make sure Docker and Docker Compose are installed.

```bash
docker compose up --build
```

This starts the frontend, backend, PostgreSQL, and Redis services configured in Docker Compose.

To run the frontend separately:

```bash
npm install
npm run dev
```

To run the backend separately:

```bash
cd backend
mvn spring-boot:run
```

The backend requires PostgreSQL and Redis to be running.

## API Documentation

Once the backend is running, open:

`http://localhost:8080/swagger-ui.html`

## Database

CloudMart uses PostgreSQL to store users, products, categories, carts, orders, payments, reviews, and other application data. Flyway is used to manage database migrations.

## Caching

Redis is used to cache products and categories to reduce repeated database queries. The cache is updated when relevant data changes.

## CI/CD

GitHub Actions workflows are configured for frontend checks, backend tests, and Docker image builds. AWS deployment steps are prepared but may require additional configuration.

## Future Improvements

- Complete AWS deployment
- Add payment gateway integration
- Improve automated testing
- Add monitoring and logging

## Author

**Harshith Reddy**

GitHub: [Harshith9598](https://github.com/Harshith9598)
