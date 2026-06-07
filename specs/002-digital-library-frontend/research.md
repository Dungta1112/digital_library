# Research & Decisions: Digital Library Frontend

## 1. Framework Selection: React vs Next.js
- **Decision**: Next.js (App Router)
- **Rationale**: The project requires robust routing for multiple distinct modules (Library, AI, Forum, Groups, Admin). Next.js provides a built-in file-system router, superior SEO capabilities (crucial for an academic library indexing documents), and optimized image/font loading out of the box.
- **Alternatives considered**: Pure React (Vite). Rejected because implementing routing (react-router), SSR, and SEO optimizations manually would increase boilerplate and maintenance.

## 2. Mocking Strategy
- **Decision**: Custom Service Layer with Promise-based Delays.
- **Rationale**: The constitution strictly requires comprehensive mock services with simulated delays. By building a custom `services/api.ts` that conditionally returns `mocks/*.json` wrapped in `setTimeout`, we can seamlessly switch to the real `fetch` calls once the backend is ready.
- **Alternatives considered**: MSW (Mock Service Worker). While powerful, MSW intercepts network requests at the browser level which can overcomplicate simple JSON mocking for a team just needing fast UI iteration. A clean service layer abstraction is simpler and meets all requirements.

## 3. PDF Viewing
- **Decision**: `react-pdf`
- **Rationale**: Provides fine-grained control over PDF rendering inside the app UI, allowing us to build custom pagination, zoom, and link it seamlessly with the AI Chat side-panel, avoiding the disjointed UX of the browser's native PDF viewer.
- **Alternatives considered**: Browser native `<iframe src="...pdf">`. Rejected because it lacks UI customization and integration with our specific academic features.

## 4. 3D and Animation
- **Decision**: GSAP ScrollTrigger + React Three Fiber.
- **Rationale**: R3F integrates 3D cleanly into React's component lifecycle, making it easier to handle the constitution's requirement for strict memory cleanup on unmount. GSAP handles scroll-driven narrative animations efficiently.
- **Alternatives considered**: Pure Three.js. Rejected as it requires manual DOM manipulation that clashes with React's virtual DOM.
