# Implementation Plan: Digital Library Forum Backend

**Branch**: `001-digital-library-forum` | **Date**: 2026-05-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-digital-library-forum/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a RESTful backend for a smart digital library with academic forum, study
groups, document moderation, user administration, statistics, and system
configuration. The implementation uses Node.js with NestJS, PostgreSQL with Prisma,
JWT access/refresh tokens, RBAC, bcrypt password hashing, Swagger documentation,
Jest tests, and a document storage boundary that supports MinIO and local storage in
development. Redis is an optional cache for high-read lists and statistics only.

## Technical Context

**Language/Version**: Node.js 20 LTS with TypeScript 5.x

**Primary Dependencies**: NestJS, Prisma, PostgreSQL driver, Passport JWT or NestJS
JWT integration, bcrypt, class-validator/class-transformer, Swagger/OpenAPI,
Multer-compatible upload handling, MinIO client, Redis client only when cache is
enabled

**Storage**: PostgreSQL for application data; Prisma migrations for schema changes;
MinIO for document files outside development; local filesystem storage for
development; Redis optional for read-heavy cached data

**Testing**: Jest for unit and integration tests; Supertest-style HTTP contract tests
for REST endpoints; Prisma test database or isolated schema for integration tests

**Target Platform**: Backend web service running in a server/container environment

**Project Type**: Single backend web service

**Performance Goals**: 95% of search requests return within 2 seconds on a
representative dataset; statistics overview returns within 3 seconds; authenticated
user flows complete without perceptible delay under expected school-scale load

**Constraints**: All important APIs require JWT and RBAC checks; every request DTO is
validated with class-validator; password values are hashed with bcrypt; document
files must pass format and size checks; approved documents only are publicly visible;
important operations must write audit logs

**Scale/Scope**: Initial school deployment with five actor groups, ten backend
modules, document library, forum, study groups, moderation, administration,
statistics, and system configuration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Modular NestJS Backend**: PASS. Source is organized into Auth, User,
  RolePermission, LibraryDocument, LecturerDocumentManagement, Forum, StudyGroup,
  ContentManagement, AdminManagement, Statistics, and SystemConfig modules. The
  additional module names refine constitution domains without changing ownership:
  RolePermission maps to Role, LibraryDocument and LecturerDocumentManagement map to
  Library, AdminManagement maps to Admin, and SystemConfig is required by the user
  for admin-only configuration.
- **RESTful Contracts and Validation**: PASS. Contracts are documented in
  `contracts/openapi.yaml`. Every controller action receives DTOs for body, params,
  query, and upload metadata. Validation uses class-validator and global validation
  pipes.
- **PostgreSQL and Prisma**: PASS. Data model is defined in `data-model.md` and
  includes Prisma entities for users, roles, permissions, documents, forum, study
  groups, moderation, configuration, and audit logs. Schema changes require Prisma
  migrations.
- **JWT/RBAC/Bcrypt Security**: PASS. Auth uses access tokens and refresh tokens,
  guards enforce JWT and RBAC, locked accounts are blocked during login, and bcrypt
  hashes passwords and refresh-token secrets.
- **Document Storage Boundary**: PASS. Document files are stored through a
  StorageService abstraction with MinIO and local storage providers. Controllers and
  domain services do not hard-code backend storage.

Post-design re-check: PASS. `research.md`, `data-model.md`, `contracts/openapi.yaml`,
and `quickstart.md` preserve the same module, validation, persistence, security, and
storage boundaries.

## Project Structure

### Documentation (this feature)

```text
specs/001-digital-library-forum/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
prisma/
├── schema.prisma
├── migrations/
└── seed.ts

src/
├── main.ts
├── app.module.ts
├── common/
│   ├── decorators/
│   ├── dto/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pagination/
│   └── response/
├── config/
├── prisma/
├── storage/
│   ├── storage.module.ts
│   ├── storage.service.ts
│   ├── minio-storage.provider.ts
│   └── local-storage.provider.ts
├── auth/
├── users/
├── role-permission/
├── library-document/
├── lecturer-document-management/
├── forum/
├── study-group/
├── content-management/
├── admin-management/
├── statistics/
└── system-config/

test/
├── contract/
├── integration/
└── unit/
```

**Structure Decision**: Use a single NestJS backend service at repository root. This
keeps module boundaries explicit while avoiding a multi-app workspace before a
frontend or additional service is required.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| `RolePermission`, `LecturerDocumentManagement`, `SystemConfig`, and `AdminManagement` names extend the exact constitution module names | The user explicitly requested these domain modules, and they map directly to constitution domains | Collapsing them into broader `Role`, `Library`, and `Admin` folders would hide separate workflows and make task ownership less clear |
| Optional Redis cache | Search/statistics can become read-heavy, but Redis is not required for core correctness | Making Redis mandatory would increase operational complexity before cache need is proven |
