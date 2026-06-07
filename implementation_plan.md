# Goal Description

Create a modern, premium sports equipment e-commerce and community frontend web application inspired by Meta's design system (as documented in `DESIGN-meta.md`). The application will feature a green, red, and white color scheme, with smooth scroll-driven storytelling animations using GSAP and ThreeJS, alongside Framer Motion for UI interactions.

## User Review Required

> [!IMPORTANT]
> **Project Location:** I propose generating the Next.js project inside `d:\project\ailibrary\frontend`. Is this location acceptable, or would you prefer a different directory structure (e.g., a separate repository)?

> [!WARNING]
> **ThreeJS Scope:** ThreeJS can be very complex. I will create a base canvas setup with a modern 3D floating abstract shape on the hero section to meet the "scroll driven storytelling" requirement. Let me know if you have a specific 3D model (GLTF/GLB) you want to use, otherwise I will use a procedural geometry.

## Open Questions

1. **Routing:** I plan to use the Next.js App Router (`app/`) for modern server components and layouts. Is this okay?
2. **Icons:** I plan to use `lucide-react` for premium, minimalistic icons. Is this acceptable?
3. **Typography:** `DESIGN-meta.md` mentions "Optimistic VF". Since this is a proprietary Meta font, I will fallback to a premium system font stack (like Inter or Roboto) unless you have the font files to provide.
4. **Integration:** Should I configure the Next.js app to point to your existing NestJS backend at `http://localhost:3000`?

## Proposed Changes

### Setup & Infrastructure
- Initialize Next.js project with TypeScript and Tailwind CSS in `d:\project\ailibrary\frontend`.
- Install dependencies: `framer-motion`, `gsap`, `three`, `@react-three/fiber`, `@react-three/drei`.
- Configure `tailwind.config.ts` using the colors, typography, and spacing extracted from `DESIGN-meta.md` (adapting primary colors to the requested green, red, and white theme while keeping the premium spacing/radius).

### Component Library (Meta Design System)
- **Button:** Primary (ink-button), Secondary (outlined), Ghost, Buy CTA.
- **Card:** Premium product cards with large border-radius (24-32px).
- **Typography:** Implementation of the three-tier text hierarchy.
- **Canvas/3D:** Reusable 3D scene container for ThreeJS objects.

### Pages to Implement
1. **Homepage:** Large hero banner with ThreeJS 3D element and GSAP scroll-driven animations. Product showcase cards.
2. **Library (Thư viện):** Grid of documents/resources/products.
3. **Forum (Diễn đàn):** Discussion list with tight typography.
4. **Study Groups (Nhóm học tập):** Group cards and membership status.
5. **Login (Đăng nhập):** Minimalistic form with clear CTA.
6. **Profile (Trang cá nhân):** User details, activity history.
7. **Admin Dashboard:** Sidebar layout, statistics overview, basic data tables.

## Verification Plan

### Automated Tests
- Run `npm run lint` and `npm run build` to ensure the frontend compiles without errors.

### Manual Verification
- Start the Next.js development server (`npm run dev` in the frontend directory).
- Verify responsive design across desktop and mobile views.
- Test scroll animations (GSAP) and 3D rendering (ThreeJS) performance.
- Navigate through all required pages to ensure proper routing and layout consistency.
