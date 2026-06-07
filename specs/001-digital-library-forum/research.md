# Research: Digital Library Forum Backend

## Decision: Node.js 20 LTS with NestJS and TypeScript

**Rationale**: Node.js 20 LTS is stable for backend services, and NestJS provides
module boundaries, dependency injection, guards, interceptors, filters, pipes, and
Swagger integration that match the required architecture.

**Alternatives considered**: Express alone was rejected because it would require
manual structure for guards, validation, and modules. Fastify alone was rejected
because the requested framework is NestJS; NestJS may still use a Fastify adapter
later if performance requires it.

## Decision: PostgreSQL with Prisma migrations and Prisma Client

**Rationale**: PostgreSQL supports relational constraints needed for RBAC, document
reviews, reports, study group membership, and audit logs. Prisma provides a single
schema source, generated client, and migration workflow.

**Alternatives considered**: TypeORM was rejected because the project constitution
requires Prisma. MongoDB was rejected because the requested data model is strongly
relational.

## Decision: JWT access tokens and refresh tokens

**Rationale**: Short-lived access tokens protect API calls while refresh tokens allow
session renewal. Refresh tokens should be stored hashed so token disclosure does not
grant long-term reuse.

**Alternatives considered**: Server sessions were rejected because the constitution
requires JWT access and refresh tokens. Single long-lived JWTs were rejected due to
revocation and exposure risk.

## Decision: RBAC through guards, decorators, and permission metadata

**Rationale**: The system has five actor groups and many protected operations. Role
and permission checks in guards keep access control consistent across modules.

**Alternatives considered**: Inline service checks were rejected because they are easy
to miss. Attribute-based access control is deferred; ownership checks are still
required for "own content" operations.

## Decision: bcrypt for password hashing

**Rationale**: bcrypt satisfies the constitution and provides adaptive password
hashing. The cost factor should be configured and benchmarked for deployment
hardware.

**Alternatives considered**: Argon2 was not selected because bcrypt is required.
Plain hashing or reversible encryption is prohibited.

## Decision: StorageService abstraction with MinIO and local providers

**Rationale**: Upload/download workflows need a stable service API while development
can use local disk and deployed environments can use MinIO. Metadata remains in
PostgreSQL; file bytes stay in object/local storage.

**Alternatives considered**: Storing files in PostgreSQL was rejected for scalability
and backup concerns. Direct MinIO calls in controllers were rejected because they
would couple domain logic to one storage backend.

## Decision: Swagger/OpenAPI contracts as REST API source for planning

**Rationale**: Swagger documents the REST surface for client developers and provides
a concrete contract for task generation and testing.

**Alternatives considered**: Markdown-only endpoint lists were rejected because they
are harder to validate and reuse for testing. GraphQL was rejected because RESTful API
design is required.

## Decision: Jest with unit, integration, and contract test layers

**Rationale**: Jest is the standard NestJS test runner. Unit tests cover services and
guards, integration tests cover database/storage flows, and contract tests cover
important REST behavior.

**Alternatives considered**: End-to-end-only testing was rejected because failures
would be harder to isolate. Manual testing was rejected for security-critical flows.

## Decision: Redis optional for read-heavy data only

**Rationale**: Search lists, dashboard lists, and statistics may benefit from caching,
but correctness must not depend on Redis. Cache invalidation must occur after
document approval, document updates, moderation, and statistics-affecting events.

**Alternatives considered**: Mandatory Redis was rejected because it increases
deployment complexity. No caching was rejected as a fixed rule because the user
explicitly allowed Redis if needed.

## Decision: Standardized responses, filters, interceptors, and audit logging

**Rationale**: A common response envelope, exception filter, logging interceptor, and
audit log service make important API behavior consistent and reviewable.

**Alternatives considered**: Per-controller response formatting and error handling
were rejected because they drift across modules.
