# Tasks: Digital Library Forum Backend

**Input**: Design documents from `/specs/001-digital-library-forum/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Jest unit, integration, and contract tests are included because the implementation plan requires tests for login, RBAC, document upload, document review, forum posting, and violation report handling.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Every task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the NestJS backend project structure, dependencies, scripts, and baseline configuration.

- [X] T001 Create Node.js project manifest and scripts in package.json
- [X] T002 Create TypeScript compiler configuration in tsconfig.json
- [X] T003 Create NestJS CLI configuration in nest-cli.json
- [X] T004 Create environment example with database, JWT, bcrypt, storage, and cache settings in .env.example
- [X] T005 Create application bootstrap with global validation pipe, Swagger setup, and API prefix in src/main.ts
- [X] T006 Create root application module wiring feature modules in src/app.module.ts
- [X] T007 [P] Create shared response envelope helpers in src/common/response/api-response.ts
- [X] T008 [P] Create shared pagination DTOs in src/common/pagination/pagination.dto.ts
- [X] T009 [P] Create base Jest configuration in jest.config.ts
- [X] T010 [P] Create test environment setup helpers in test/setup.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish database schema, auth/RBAC primitives, validation, storage, logging, errors, and audit support before user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T011 Define all Prisma enums and models from data-model.md in prisma/schema.prisma
- [X] T012 Create Prisma seed data for roles, permissions, system configs, and admin account in prisma/seed.ts
- [X] T013 Create Prisma service and module in src/prisma/prisma.service.ts and src/prisma/prisma.module.ts
- [X] T014 [P] Create configuration validation schema in src/config/env.validation.ts
- [X] T015 [P] Create application configuration module in src/config/config.module.ts
- [X] T016 [P] Create standardized exception filter in src/common/filters/http-exception.filter.ts
- [X] T017 [P] Create request logging interceptor in src/common/interceptors/logging.interceptor.ts
- [X] T018 [P] Create audit log service and module in src/common/audit/audit-log.service.ts and src/common/audit/audit-log.module.ts
- [X] T019 [P] Create JWT auth guard in src/common/guards/jwt-auth.guard.ts
- [X] T020 [P] Create roles and permissions decorators in src/common/decorators/roles.decorator.ts and src/common/decorators/permissions.decorator.ts
- [X] T021 [P] Create RBAC guard with role and permission checks in src/common/guards/rbac.guard.ts
- [X] T022 [P] Create ownership guard helper for own-content rules in src/common/guards/ownership.guard.ts
- [X] T023 [P] Create storage interface and module in src/storage/storage.service.ts and src/storage/storage.module.ts
- [X] T024 [P] Create local storage provider in src/storage/local-storage.provider.ts
- [X] T025 [P] Create MinIO storage provider in src/storage/minio-storage.provider.ts
- [X] T026 [P] Create file validation pipe for allowed types and max size in src/common/pipes/file-validation.pipe.ts
- [X] T027 [P] Create optional Redis cache module wrapper in src/cache/cache.module.ts
- [X] T028 Create shared OpenAPI decorators for auth and error responses in src/common/decorators/api-docs.decorator.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Khach truy cap va bat dau su dung he thong (Priority: P1)

**Goal**: Guests can register, log in, search public documents, and view public document details.

**Independent Test**: Create a new account, log in, search approved public documents, and view a public document detail.

### Tests for User Story 1

- [X] T029 [P] [US1] Add contract tests for register, login, refresh, logout, search documents, and document detail in test/contract/us1-public-auth-documents.spec.ts
- [X] T030 [P] [US1] Add auth service unit tests for bcrypt hashing, locked-account login denial, access token, and refresh token handling in test/unit/auth/auth.service.spec.ts
- [X] T031 [P] [US1] Add public document search integration tests in test/integration/library-document/public-search.spec.ts

### Implementation for User Story 1

- [X] T032 [P] [US1] Create Auth module, controller, service, and DTOs in src/auth/auth.module.ts, src/auth/auth.controller.ts, src/auth/auth.service.ts, and src/auth/dto/auth.dto.ts
- [X] T033 [P] [US1] Create User module, user profile DTOs, and safe response mapper in src/users/users.module.ts, src/users/dto/user-profile.dto.ts, and src/users/user.mapper.ts
- [X] T034 [P] [US1] Create Role Permission module read services for roles and permissions in src/role-permission/role-permission.module.ts and src/role-permission/role-permission.service.ts
- [X] T035 [US1] Implement register, login, refresh, and logout endpoints from contracts/openapi.yaml in src/auth/auth.controller.ts
- [X] T036 [US1] Implement bcrypt password hashing and refresh-token hash persistence in src/auth/auth.service.ts
- [X] T037 [US1] Implement locked account checks during login in src/auth/auth.service.ts
- [X] T038 [P] [US1] Create Library Document module, query DTOs, and response DTOs in src/library-document/library-document.module.ts and src/library-document/dto/document-query.dto.ts
- [X] T039 [US1] Implement public approved document search and detail read logic in src/library-document/library-document.service.ts
- [X] T040 [US1] Implement GET /documents and GET /documents/{documentId} controllers in src/library-document/library-document.controller.ts
- [X] T041 [US1] Add Swagger decorators for Auth and public document endpoints in src/auth/auth.controller.ts and src/library-document/library-document.controller.ts

**Checkpoint**: Guests can register, log in, and browse approved public documents independently.

---

## Phase 4: User Story 2 - Sinh vien khai thac tai lieu va tham gia hoc thuat (Priority: P1)

**Goal**: Students can use document dashboard/search/read/download/favorite/rating/report flows, participate in forum and study groups, and manage profile/password.

**Independent Test**: Log in as a student, use allowed document features, post and comment in the forum, report content, join a study group, access group documents, and update profile/password.

### Tests for User Story 2

- [X] T042 [P] [US2] Add student document contract tests for read, download, favorite, rating, and report endpoints in test/contract/us2-student-documents.spec.ts
- [X] T043 [P] [US2] Add user profile and password integration tests in test/integration/users/profile-password.spec.ts
- [X] T044 [P] [US2] Add forum post/comment/report contract tests in test/contract/us2-forum.spec.ts
- [X] T045 [P] [US2] Add study group membership and group document integration tests in test/integration/study-group/student-group-access.spec.ts

### Implementation for User Story 2

- [X] T046 [P] [US2] Implement current profile, update profile, and change password endpoints in src/users/users.controller.ts
- [X] T047 [US2] Implement profile update and password change service logic with bcrypt verification in src/users/users.service.ts
- [X] T048 [P] [US2] Create DTOs for favorite, rating, document report, and download/read params in src/library-document/dto/document-action.dto.ts
- [X] T049 [US2] Implement document read, download, favorite, unfavorite, rating, and report service logic in src/library-document/library-document.service.ts
- [X] T050 [US2] Implement GET /documents/{documentId}/read, GET /documents/{documentId}/download, favorite, ratings, and reports endpoints in src/library-document/library-document.controller.ts
- [X] T051 [US2] Write audit logs for document downloads and reports in src/library-document/library-document.service.ts
- [X] T052 [P] [US2] Create Forum module, DTOs, controller, and service skeleton in src/forum/forum.module.ts, src/forum/dto/forum.dto.ts, src/forum/forum.controller.ts, and src/forum/forum.service.ts
- [X] T053 [US2] Implement forum list, detail, create post, edit own post, delete own post, comment, and report logic in src/forum/forum.service.ts
- [X] T054 [US2] Implement forum endpoints from contracts/openapi.yaml in src/forum/forum.controller.ts
- [X] T055 [P] [US2] Create Study Group module, DTOs, controller, and service skeleton in src/study-group/study-group.module.ts, src/study-group/dto/study-group.dto.ts, src/study-group/study-group.controller.ts, and src/study-group/study-group.service.ts
- [X] T056 [US2] Implement student group discovery, join/request, group document list/download, group post, and group comment logic in src/study-group/study-group.service.ts
- [X] T057 [US2] Implement study group endpoints for join, documents, posts, and comments in src/study-group/study-group.controller.ts
- [X] T058 [US2] Add JWT, RBAC, and ownership guards to student document, forum, study group, and profile endpoints in src/library-document/library-document.controller.ts, src/forum/forum.controller.ts, src/study-group/study-group.controller.ts, and src/users/users.controller.ts

**Checkpoint**: Student learning, forum, group, and profile flows work independently after login.

---

## Phase 5: User Story 3 - Giang vien chia se tai lieu va dan dat hoc thuat (Priority: P1)

**Goal**: Lecturers can upload and manage own documents, track review status, create/manage study groups, and participate in forum workflows.

**Independent Test**: Log in as lecturer, upload a document pending review, update/hide/delete own document, create a group, manage members, share group documents, and create group discussions.

### Tests for User Story 3

- [X] T059 [P] [US3] Add lecturer document upload and ownership contract tests in test/contract/us3-lecturer-documents.spec.ts
- [X] T060 [P] [US3] Add file validation and storage integration tests in test/integration/storage/document-upload.spec.ts
- [X] T061 [P] [US3] Add lecturer study group management integration tests in test/integration/study-group/lecturer-management.spec.ts

### Implementation for User Story 3

- [X] T062 [P] [US3] Create Lecturer Document Management module, DTOs, controller, and service in src/lecturer-document-management/lecturer-document-management.module.ts, src/lecturer-document-management/dto/lecturer-document.dto.ts, src/lecturer-document-management/lecturer-document-management.controller.ts, and src/lecturer-document-management/lecturer-document-management.service.ts
- [X] T063 [US3] Implement lecturer document upload with metadata, file validation, storage write, PENDING_REVIEW status, and audit log in src/lecturer-document-management/lecturer-document-management.service.ts
- [X] T064 [US3] Implement lecturer-owned document update, hide, delete, and review-status list logic in src/lecturer-document-management/lecturer-document-management.service.ts
- [X] T065 [US3] Implement lecturer document endpoints from contracts/openapi.yaml in src/lecturer-document-management/lecturer-document-management.controller.ts
- [X] T066 [US3] Add ownership and lecturer-role guards to lecturer document endpoints in src/lecturer-document-management/lecturer-document-management.controller.ts
- [X] T067 [P] [US3] Add lecturer group owner DTOs for member approval, member removal, and document sharing in src/study-group/dto/group-owner.dto.ts
- [X] T068 [US3] Implement lecturer group create, member approval, member management, permission setting, group document sharing, and group discussion logic in src/study-group/study-group.service.ts
- [X] T069 [US3] Implement lecturer group management endpoints in src/study-group/study-group.controller.ts
- [X] T070 [US3] Add Swagger decorators for lecturer document and group owner endpoints in src/lecturer-document-management/lecturer-document-management.controller.ts and src/study-group/study-group.controller.ts

**Checkpoint**: Lecturer document and group management flows work independently with ownership enforcement.

---

## Phase 6: User Story 4 - Quan tri noi dung kiem duyet tai lieu va thao luan (Priority: P2)

**Goal**: Content managers can review documents, reject with reason, moderate forum content, lock topics, view reports, handle reports, and update report status.

**Independent Test**: Log in as content manager, approve/reject a pending document, delete violating forum content, lock a topic, and handle a violation report.

### Tests for User Story 4

- [X] T071 [P] [US4] Add document moderation contract tests for pending, approve, reject, and reason validation in test/contract/us4-document-moderation.spec.ts
- [X] T072 [P] [US4] Add forum moderation contract tests for delete post, delete comment, and lock topic in test/contract/us4-forum-moderation.spec.ts
- [X] T073 [P] [US4] Add violation report handling integration tests in test/integration/content-management/report-handling.spec.ts

### Implementation for User Story 4

- [X] T074 [P] [US4] Create Content Management module, DTOs, controller, and service in src/content-management/content-management.module.ts, src/content-management/dto/content-management.dto.ts, src/content-management/content-management.controller.ts, and src/content-management/content-management.service.ts
- [X] T075 [US4] Implement pending document list, approve document, reject document with required reason, moderation log, and audit log in src/content-management/content-management.service.ts
- [X] T076 [US4] Implement content document moderation endpoints from contracts/openapi.yaml in src/content-management/content-management.controller.ts
- [X] T077 [US4] Implement forum post deletion, comment deletion, topic lock, and moderation log logic in src/content-management/content-management.service.ts
- [X] T078 [US4] Implement content forum moderation endpoints in src/content-management/content-management.controller.ts
- [X] T079 [US4] Implement report list, report handling, status update, and audit log logic in src/content-management/content-management.service.ts
- [X] T080 [US4] Implement content report endpoints from contracts/openapi.yaml in src/content-management/content-management.controller.ts
- [X] T081 [US4] Add content-manager RBAC guards to all moderation endpoints in src/content-management/content-management.controller.ts

**Checkpoint**: Content moderation and report handling flows work independently with audit coverage.

---

## Phase 7: User Story 5 - Quan tri vien van hanh va phan quyen he thong (Priority: P2)

**Goal**: Admins can manage users, lock/unlock accounts, update account status, assign roles, configure system settings, and view overall statistics.

**Independent Test**: Log in as admin, search users, lock and unlock an account, assign roles, update upload/review configuration, and view statistics overview.

### Tests for User Story 5

- [X] T082 [P] [US5] Add admin user management and account lock contract tests in test/contract/us5-admin-users.spec.ts
- [X] T083 [P] [US5] Add RBAC role assignment integration tests in test/integration/admin-management/role-assignment.spec.ts
- [X] T084 [P] [US5] Add system config validation tests in test/integration/system-config/system-config.spec.ts
- [X] T085 [P] [US5] Add statistics overview integration tests in test/integration/statistics/overview.spec.ts

### Implementation for User Story 5

- [X] T086 [P] [US5] Create Admin Management module, DTOs, controller, and service in src/admin-management/admin-management.module.ts, src/admin-management/dto/admin-management.dto.ts, src/admin-management/admin-management.controller.ts, and src/admin-management/admin-management.service.ts
- [X] T087 [US5] Implement user search, account detail, status update, lock, unlock, role assignment, and audit log logic in src/admin-management/admin-management.service.ts
- [X] T088 [US5] Implement admin user management endpoints from contracts/openapi.yaml in src/admin-management/admin-management.controller.ts
- [X] T089 [P] [US5] Create System Config module, DTOs, controller, and service in src/system-config/system-config.module.ts, src/system-config/dto/system-config.dto.ts, src/system-config/system-config.controller.ts, and src/system-config/system-config.service.ts
- [X] T090 [US5] Implement upload format, max file size, document review, and cache setting validation in src/system-config/system-config.service.ts
- [X] T091 [US5] Implement system config endpoints from contracts/openapi.yaml in src/system-config/system-config.controller.ts
- [X] T092 [P] [US5] Create Statistics module, controller, and service in src/statistics/statistics.module.ts, src/statistics/statistics.controller.ts, and src/statistics/statistics.service.ts
- [X] T093 [US5] Implement overview statistics for users, documents, forum, study groups, views, downloads, reports, and moderation in src/statistics/statistics.service.ts
- [X] T094 [US5] Implement GET /statistics/overview endpoint in src/statistics/statistics.controller.ts
- [X] T095 [US5] Add admin-only RBAC guards to admin, system config, and statistics endpoints in src/admin-management/admin-management.controller.ts, src/system-config/system-config.controller.ts, and src/statistics/statistics.controller.ts

**Checkpoint**: Admin operations, role assignment, system configuration, and statistics work independently.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Complete documentation, contract alignment, security hardening, cache behavior, and quickstart validation across all user stories.

- [X] T096 [P] Update generated Swagger metadata and tags for all modules in src/main.ts
- [X] T097 [P] Add OpenAPI contract drift check script in package.json
- [X] T098 [P] Add global response envelope coverage tests in test/unit/common/api-response.spec.ts
- [X] T099 [P] Add global exception filter coverage tests in test/unit/common/http-exception.filter.spec.ts
- [X] T100 Add cache invalidation for document approval, document update, moderation, and statistics-affecting events in src/cache/cache-invalidation.service.ts
- [X] T101 Add audit log assertions to critical integration tests in test/integration/audit/audit-log.spec.ts
- [X] T102 Verify quickstart setup and validation scenarios in specs/001-digital-library-forum/quickstart.md
- [X] T103 Run full test suite and document final command results in specs/001-digital-library-forum/implementation-notes.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational. Delivers guest registration/login and public document browsing.
- **User Story 2 (Phase 4)**: Depends on Foundational and can use Auth/User/Library primitives from US1 where available.
- **User Story 3 (Phase 5)**: Depends on Foundational and can proceed in parallel with US2 after Auth/RBAC/storage are ready.
- **User Story 4 (Phase 6)**: Depends on document/forum/report entities and is most useful after US2/US3 create reportable content.
- **User Story 5 (Phase 7)**: Depends on Foundational and role seed data; can proceed in parallel with US4 after RBAC is stable.
- **Polish (Phase 8)**: Depends on selected user stories being implemented.

### User Story Dependencies

- **US1**: Independent MVP after Phase 2.
- **US2**: Requires authenticated user and approved/accessible documents; can be tested with seeded data if US4 is not complete.
- **US3**: Requires lecturer role and storage foundation; can be tested independently with seeded lecturer user.
- **US4**: Requires pending documents and reports; can be tested with seeded fixtures if US2/US3 are not complete.
- **US5**: Requires admin role and seed permissions; otherwise independent.

### Within Each User Story

- Tests precede implementation.
- DTOs and Prisma-backed service methods precede controllers.
- Guards and ownership checks must be added before story completion.
- Audit logging must be present before critical operation tasks are marked complete.

---

## Parallel Opportunities

- Setup tasks T007-T010 can run in parallel after T001-T006 are understood.
- Foundational tasks T014-T028 can run in parallel after T011-T013 define the persistence baseline.
- US1 tests T029-T031 can run in parallel; implementation tasks T032-T034 and T038 can run in parallel.
- US2 tests T042-T045 can run in parallel; profile, document, forum, and study-group implementation tracks can run in parallel.
- US3 tests T059-T061 can run in parallel; lecturer document and group-owner DTO work can run in parallel.
- US4 tests T071-T073 can run in parallel; document moderation, forum moderation, and report handling can be split after T074.
- US5 tests T082-T085 can run in parallel; admin, system config, and statistics modules can be built in parallel after RBAC.

## Parallel Example: User Story 2

```bash
# Independent test tasks
Task: "T042 Add student document contract tests in test/contract/us2-student-documents.spec.ts"
Task: "T043 Add user profile and password integration tests in test/integration/users/profile-password.spec.ts"
Task: "T044 Add forum post/comment/report contract tests in test/contract/us2-forum.spec.ts"
Task: "T045 Add study group membership and group document integration tests in test/integration/study-group/student-group-access.spec.ts"

# Independent implementation tracks
Task: "T046 Implement current profile, update profile, and change password endpoints in src/users/users.controller.ts"
Task: "T052 Create Forum module skeleton in src/forum/forum.module.ts"
Task: "T055 Create Study Group module skeleton in src/study-group/study-group.module.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T059 Add lecturer document upload and ownership contract tests in test/contract/us3-lecturer-documents.spec.ts"
Task: "T060 Add file validation and storage integration tests in test/integration/storage/document-upload.spec.ts"
Task: "T061 Add lecturer study group management integration tests in test/integration/study-group/lecturer-management.spec.ts"
Task: "T062 Create Lecturer Document Management module in src/lecturer-document-management/lecturer-document-management.module.ts"
Task: "T067 Add lecturer group owner DTOs in src/study-group/dto/group-owner.dto.ts"
```

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) for registration, login, public search, and public document detail.
3. Validate US1 with contract and integration tests before expanding.

### Incremental Delivery

1. Add US2 for student document, forum, group, and profile workflows.
2. Add US3 for lecturer upload and group ownership workflows.
3. Add US4 for content moderation and report handling.
4. Add US5 for administration, system configuration, and statistics.
5. Complete Phase 8 for documentation, cache, audit, and full quickstart validation.

### Notes

- Keep generated tasks in numerical order when executing.
- Do not mark a story complete until its independent test criteria pass.
- Important operations must include RBAC checks and audit logging before completion.


