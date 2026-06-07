# Tasks: Digital Library Frontend

**Input**: Design documents from `/specs/002-digital-library-frontend/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api-services.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize Next.js project with Tailwind CSS and TypeScript in `frontend/src/`
- [x] T002 Install core dependencies (GSAP, Three.js, react-three-fiber, react-pdf)
- [x] T003 Configure linting and prettier settings
- [x] T004 Setup environment variables in `.env.local`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Setup base project folder structure (`components`, `hooks`, `services`, `types`, `mocks`)
- [x] T006 [P] Create base API config and mock interceptor logic in `src/services/config.ts`
- [x] T007 [P] Create foundational UI components (Button, Input, Skeleton, ErrorBoundary) in `src/components/ui/`
- [x] T008 Setup Layout component (Navbar, Footer, Main container) in `src/components/layout/`
- [x] T009 Configure base Next.js App Router layout in `src/app/layout.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Homepage Discovery (Priority: P1) 🎯 MVP

**Goal**: Scroll-driven visual story explaining the platform with 3D elements (Desktop) and fallbacks (Mobile).

**Independent Test**: Load `/`, scroll down, observe animations and memory cleanup without performance lag.

### Implementation for User Story 1

- [x] T010 [P] [US1] Create GSAP ScrollTrigger hook in `src/hooks/useScrollTrigger.ts`
- [x] T011 [US1] Implement 3D elements and mobile fallback in `src/components/feature/Home3DScene.tsx`
- [x] T012 [US1] Build narrative text sections in `src/components/feature/HomeNarrative.tsx`
- [x] T013 [US1] Integrate components into Homepage routing in `src/app/page.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Library Browse and Search (Priority: P1)

**Goal**: Search, filter (category, year, author), and paginate documents.

**Independent Test**: Navigate to `/library`, apply filters, and see mock data update accurately.

### Implementation for User Story 2

- [x] T014 [P] [US2] Create Library Types mapping to data-model in `src/types/library.ts`
- [x] T015 [P] [US2] Implement Library Service and dummy JSON in `src/services/library.service.ts` & `src/mocks/library.json`
- [x] T016 [US2] Build Document Card and Grid components in `src/components/feature/Library/DocumentGrid.tsx`
- [x] T017 [US2] Build Filter and Pagination controls in `src/components/feature/Library/LibraryControls.tsx`
- [x] T018 [US2] Create Library Page and integrate components in `src/app/library/page.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Document Detail (Priority: P1)

**Goal**: View document metadata, read PDF online, download, and save.

**Independent Test**: Visit `/library/document/1`, verify metadata and custom PDF viewer rendering.

### Implementation for User Story 3

- [x] T019 [US3] Implement Custom PDF Viewer component using react-pdf in `src/components/feature/Library/PdfViewer.tsx`
- [x] T020 [US3] Build Metadata display and Action buttons (Save, Ask AI) in `src/components/feature/Library/DocumentInfo.tsx`
- [x] T021 [US3] Create Document Detail page in `src/app/library/document/[id]/page.tsx`

---

## Phase 6: User Story 4 - Academic AI Assistant (Priority: P1)

**Goal**: Chatbot interface with global/contextual modes and rich citation cards.

**Independent Test**: Send a message in `/ai`, see loading state, and verify rich citation cards appear in response.

### Implementation for User Story 4

- [x] T022 [P] [US4] Create AI Types mapping to data-model in `src/types/ai.ts`
- [x] T023 [P] [US4] Implement AI Service and dummy JSON in `src/services/ai.service.ts` & `src/mocks/ai.json`
- [x] T024 [US4] Build Chat Message and Rich Citation Card components in `src/components/feature/AI/ChatMessage.tsx`
- [x] T025 [US4] Build Chat Input interface in `src/components/feature/AI/ChatInput.tsx`
- [x] T026 [US4] Create AI Chat Page in `src/app/ai/page.tsx`

---

## Phase 7: User Story 7 - Authentication (Priority: P1)

**Goal**: Login/Register flows with validation and secure state.

**Independent Test**: Submit login form with errors, see validation, then succeed and see profile in Navbar.

### Implementation for User Story 7

- [x] T027 [P] [US7] Create Auth Types mapping to data-model in `src/types/auth.ts`
- [x] T028 [P] [US7] Implement Auth Service in `src/services/auth.service.ts`
- [x] T029 [US7] Implement Auth State context/hook in `src/hooks/useAuth.ts`
- [x] T030 [US7] Build Auth Form components with validation in `src/components/feature/Auth/AuthForms.tsx`
- [x] T031 [US7] Create Login/Register pages in `src/app/(auth)/login/page.tsx` and `src/app/(auth)/register/page.tsx`

---

## Phase 8: User Story 5 - Academic Forum (Priority: P2)

**Goal**: Browse posts, read threads, and comment.

**Independent Test**: Navigate to `/forum`, view post list, open a post at `/forum/post/1`, and submit a comment.

### Implementation for User Story 5

- [x] T032 [P] [US5] Create Forum Types mapping to data-model in `src/types/forum.ts`
- [x] T033 [P] [US5] Implement Forum Service and dummy JSON in `src/services/forum.service.ts` & `src/mocks/forum.json`
- [x] T034 [US5] Build Forum Post List, Detail, and Comment UI in `src/components/feature/Forum/`
- [x] T035 [US5] Create Forum Page and Post Detail Page in `src/app/forum/page.tsx` and `src/app/forum/post/[id]/page.tsx`

---

## Phase 9: User Story 6 - Study Groups (Priority: P2)

**Goal**: Browse public groups and join them.

**Independent Test**: Visit `/groups`, see group cards, and click "Join" to see member list update.

### Implementation for User Story 6

- [x] T036 [P] [US6] Create Group Types in `src/types/group.ts`
- [x] T037 [US6] Implement Group Service and Mock data in `src/services/group.service.ts` & `src/mocks/group.json`
- [x] T038 [US6] Build Group List, Detail, and Member Management UI in `src/components/feature/Group/`
- [x] T039 [US6] Create Group Pages in `src/app/groups/page.tsx` and `src/app/groups/[id]/page.tsx`

---

## Phase 10: User Story 8 - Admin Dashboard (Priority: P3)

**Goal**: Admin statistics and basic moderation.

**Independent Test**: Log in as admin, navigate to `/admin`, and view stats. Regular user gets 403.

### Implementation for User Story 8

- [x] T040 [P] [US8] Create Admin Types mapping to data-model in `src/types/admin.ts`
- [x] T041 [US8] Implement Admin Service and Mock data in `src/services/admin.service.ts` & `src/mocks/admin.json`
- [x] T042 [US8] Build Stat widgets and moderation UI in `src/components/feature/Admin/`
- [x] T043 [US8] Create Admin Page with Role Protection in `src/app/admin/page.tsx`

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T044 [P] Update navigation links in `src/components/layout/Navbar.tsx` based on user role and authentication state
- [x] T045 [P] Implement responsive design cleanup (ensure mobile views are polished across all pages)
- [x] T046 [P] Final end-to-end user flow test (mocked) and styling refinement

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-10)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- All Setup and Foundational tasks marked `[P]` can run in parallel.
- Once Foundational completes, User Stories (US1, US2, US4, US7) can be developed entirely in parallel since their services and UI are loosely coupled.

## Implementation Strategy

### MVP First (User Stories 1-4, 7)
1. Complete Setup & Foundational.
2. Develop Auth (US7) and Library (US2, US3).
3. Develop AI (US4) and Home (US1).
4. Launch MVP.

### Incremental Delivery (Post-MVP)
5. Add Forum (US5).
6. Add Study Groups (US6).
7. Add Admin Dashboard (US8).
