# Quickstart: Digital Library Forum Backend

## Prerequisites

- Node.js 20 LTS
- PostgreSQL 15+
- MinIO for object storage, or local storage for development
- Redis only when cache is enabled

## Environment

Create `.env` from the project example once available and define:

```text
DATABASE_URL=postgresql://user:password@localhost:5432/ailibrary
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
STORAGE_DRIVER=local
LOCAL_STORAGE_PATH=./storage
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=documents
REDIS_URL=redis://localhost:6379
CACHE_ENABLED=false
```

## Setup

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run start:dev
```

## Documentation

After the server starts, open Swagger documentation at:

```text
GET /docs
```

The planning contract is available at:

```text
specs/001-digital-library-forum/contracts/openapi.yaml
```

## Validation Scenarios

1. Register and log in as a student, then verify public document search works.
2. Log in as a lecturer, upload a document, and verify the document is pending review.
3. Log in as a content manager, reject a document without a reason and confirm validation fails.
4. Reject the same document with a reason and confirm the lecturer can see the rejection reason.
5. Approve a pending document and confirm it appears in public/allowed document lists.
6. Lock a user as admin and confirm that user cannot log in.
7. Assign a role as admin and confirm non-admin users cannot perform the same operation.
8. Create a forum post, comment on it, report it, then process the report as content manager.
9. Create a study group as lecturer, approve a member, and verify group document access.
10. Verify audit logs are written for document upload, document review, account lock, role assignment, content deletion, and report handling.

## Test Commands

```bash
npm run test
npm run test:unit
npm run test:integration
npm run test:contract
```

## Operational Notes

- Use local storage only in development.
- Keep Redis disabled unless search, dashboard, or statistics performance requires it.
- Never return password hashes, refresh-token hashes, or storage secrets in API responses.
- Seed roles and permissions before testing protected flows.
