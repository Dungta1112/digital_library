<!--
Sync Impact Report
Version change: 1.0.0 -> 2.0.0
Modified principles:
- I. Modular NestJS Backend -> I. Frontend Scope and Backend Boundary
- II. RESTful Contracts and Input Validation -> II. Frontend Architecture
- III. Data Integrity with PostgreSQL and Prisma -> III. UI/UX and Academic Aesthetics
- IV. Authentication, Authorization, and Password Security -> IV. Animation and 3D Usage
- V. Document Storage and Environment Boundaries -> V. AI and Citation Strictness
Added sections:
- VI. Quality and Production Readiness
Removed sections:
- Backend Architecture Constraints
Templates requiring updates:
- ✅ updated: .specify/templates/plan-template.md
- ✅ updated: .specify/templates/spec-template.md
- ✅ updated: .specify/templates/tasks-template.md
Follow-up TODOs:
- None
-->
# AI Library Frontend Constitution

## Core Principles

### I. Frontend Scope and Backend Boundary
The frontend MUST NOT create new backend systems, alter the database, Prisma schema, or backend logic. It MUST NOT invent API endpoints. If an endpoint is undefined or missing, a temporary mock service MUST be created with a clear note requiring backend implementation. All real data MUST be fetched through a dedicated service layer; direct API calls inside UI components are strictly forbidden.

Rationale: Clear boundaries ensure frontend development is not blocked while preventing unauthorized backend alterations.

### II. Frontend Architecture
The project MUST use React or Next.js with TypeScript and Tailwind CSS for styling. Code MUST be explicitly modularized by feature: auth, documents, ai, forum, groups, admin. Reusable components MUST reside in `components/ui` or `components/layout`. API calling logic MUST be placed in `services`, custom logic in `hooks`, data types in `types`, and mock data in `mocks` or `fixtures`. Components MUST be kept small and single-responsibility, without hard-coded business data.

Rationale: Maintainable frontend scaling requires strict file organization and separation of logic from presentation.

### III. UI/UX and Academic Aesthetics
The UI MUST be modern, academic, premium, minimalistic, and intuitive. The primary color palette MUST be white, green, with soft red accents. Typography MUST be clear and suited for academic contexts. The navigation bar MUST clearly route between Home, Library, Forum, Study Groups, and AI. All main pages MUST be responsive (desktop, tablet, mobile) and include clear loading, empty, and error states. Forms MUST include clear validation and error messaging. The design MUST NOT look overly colorful or game-like.

Rationale: An academic platform requires a professional, distraction-free environment that builds user trust.

### IV. Animation and 3D Usage
The homepage MAY use scroll-driven storytelling (e.g., GSAP ScrollTrigger) and 3D elements (Three.js/React Three Fiber) to illustrate digital books, knowledge data, AI, and academic networks. 3D elements MUST be restricted primarily to the homepage and MUST NOT be overused in functional pages (Library, AI chat, Forum). Animations MUST serve the content, include proper cleanup to prevent memory leaks, and 3D scenes MUST be lazy-loaded.

Rationale: Rich visual storytelling is valuable for the landing experience, but functional pages must prioritize speed, readability, and task efficiency.

### V. AI and Citation Strictness
The AI page MUST feature a clear chatbot interface. If the backend returns citations or sources, the frontend MUST display them. The frontend MUST NOT invent AI responses when using the real API. Any mock AI responses MUST be explicitly labeled as simulated data. Processing states and API failure states MUST be clearly presented to the user.

Rationale: Academic integrity demands accurate citations and prevents AI hallucinations from being masked by UI.

### VI. Quality and Production Readiness
Code MUST be readable, maintainable, and extensible, prioritizing reusable components. API call logic MUST NOT be duplicated. Secret keys MUST NOT be exposed in the frontend, and the API base URL MUST be loaded from environment variables. The project MUST build successfully in production mode without TypeScript errors or unnecessary `console.log` statements. All main features MUST have user-friendly error handling.

Rationale: The final product must be high enough quality for academic research demonstrations and scalable to a real-world system.

## Frontend Architecture Constraints

- Runtime stack MUST remain React/Next.js with TypeScript and Tailwind CSS unless this constitution is amended.
- Architecture MUST follow modular separation (components, hooks, services, types).
- No direct API calls within UI components; MUST use the service layer.
- Must implement proper loading, error, and empty states.
- 3D/Animation dependencies (Three.js, GSAP) MUST be scoped to appropriate pages and properly cleaned up.

## Delivery Workflow and Quality Gates

Feature plans MUST pass the Constitution Check before research and again after design.
Plans MUST name affected modules, components, services, and UI states. They MUST identify mock endpoints required from the backend.

Specifications MUST include responsive design requirements, UI states, validation rules, and accessibility/error handling. Tasks MUST include component creation, type definitions, service integration, hook logic, and state management.

Implementation is incomplete until the feature works responsively across targeted devices and handles API integrations (or mocks) correctly.

## Governance

This constitution supersedes conflicting project practices and templates. Amendments
MUST update this file, include a Sync Impact Report, and propagate changes to affected
Spec Kit templates and runtime guidance. Reviewers MUST reject feature plans or task
lists that violate the Core Principles without an explicit approved amendment.

Versioning follows semantic versioning. MAJOR versions remove or redefine principles
in a backward-incompatible way. MINOR versions add principles, sections, or material
new guidance. PATCH versions clarify wording without changing governance meaning.

Compliance review is required during planning, task generation, and implementation
review. Any accepted exception MUST be documented in the feature plan's Complexity
Tracking table with the reason and the simpler alternative that was rejected.

**Version**: 2.0.0 | **Ratified**: 2026-05-30 | **Last Amended**: 2026-06-06
