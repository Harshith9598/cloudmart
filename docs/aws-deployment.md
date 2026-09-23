# AWS Deployment Guide — CloudMart

## Current deployment status

| Component | Implemented Locally | Implemented in Bolt | Deployment-Ready | Actually Deployed |
|-----------|--------------------|--------------------|-----------------|-------------------|
| React/TS Frontend | Yes | Yes (Bolt preview) | Yes (Docker + S3/CloudFront) | No |
| Spring Boot Backend | Yes (source) | No | Yes (Docker + ECS) | No |
| PostgreSQL | Yes (Docker Compose) | Supabase (preview) | Yes (RDS) | No |
| Redis | Yes (Docker Compose) | No | Yes (ElastiCache) | No |
| CI/CD Pipeline | Yes (workflows) | N/A | Yes (GitHub Actions) | Not connected |
| Object Storage | N/A | N/A | Yes (S3) | No |
| HTTPS/TLS | N/A | Bolt preview | Yes (ACM + ALB) | No |

**Nothing has been deployed to AWS yet.** This document describes the architecture and steps to deploy when ready.

---

## Architecture

```
GitHub → GitHub Actions → Docker images → AWS ECS/RDS/ElastiCache/S3

Internet → Route 53 → CloudFront (frontend) + ALB → ECS (backend)
                                                    → RDS (PostgreSQL)
                                                    → ElastiCache (Redis)
                                                    → S3 (object storage)
```

---

## 1. Frontend hosting (S3 + CloudFront)

- Build the React app with `VITE_API_BASE_URL` pointing to the backend ALB URL
- Deploy static files to an S3 bucket configured for static website hosting
- Distribute via CloudFront with an ACM TLS certificate
- Use Route 53 for the custom domain

```bash
# Build
VITE_API_BASE_URL=https://api.cloudmart.example.com npm run build

# Deploy
aws s3 sync dist/ s3://cloudmart-frontend/
aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
```

## 2. Spring Boot backend (ECS Fargate)

- Build and push the Docker image to ECR (or Docker Hub)
- Run on ECS Fargate behind an Application Load Balancer
- Health check: `GET /actuator/health`

Required environment variables:
- `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`
- `REDIS_HOST`, `REDIS_PORT`
- `JWT_SECRET`

## 3. PostgreSQL (RDS)

- Provision an RDS PostgreSQL 16 instance
- Store credentials in AWS Secrets Manager
- Configure the security group to allow access only from the ECS backend

## 4. Redis (ElastiCache)

- Provision an ElastiCache Redis 7 cluster
- Configure the security group to allow access only from the ECS backend

## 5. Object storage (S3)

- Create an S3 bucket for product images and user uploads
- Use pre-signed URLs for direct browser uploads
- Configure CORS on the bucket

## 6. HTTPS / TLS

- Provision certificates via AWS Certificate Manager (ACM)
- Attach to CloudFront (frontend) and ALB (backend)
- Configure Route 53 DNS records

## 7. Secrets and environment configuration

- Store all secrets in AWS Secrets Manager or GitHub repository secrets
- Reference secrets in ECS task definitions via ARN
- Never hardcode credentials in Docker images or source code

## 8. Health checks

- Backend: `GET /actuator/health` (Spring Boot Actuator)
- Frontend: CloudFront root path check
- Database: RDS automated health checks
- Redis: ElastiCache automatic failover

## 9. Logging

- Backend logs to stdout → CloudWatch Logs via ECS log driver
- Configure log groups and retention policies
- Set up CloudWatch Alarms for error rates and latency

## 10. CI/CD deployment pipeline

The GitHub Actions workflow at `.github/workflows/deploy.yml` is deployment-ready.

To connect to AWS:
1. Configure repository secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_ECS_CLUSTER`, `DOCKER_REGISTRY`, `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `FRONTEND_S3_BUCKET`, `CLOUDFRONT_DIST_ID`
2. Uncomment the AWS deployment steps in the workflow
3. Push to `main` to trigger a deployment
