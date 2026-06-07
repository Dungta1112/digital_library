# Feature Specification: Digital Library Frontend

**Feature Branch**: `002-digital-library-frontend`

**Created**: 2026-06-06

**Status**: Draft

**Input**: User description: "$ARGUMENTS"

## Clarifications

### Session 2026-06-06
- Q: Phạm vi MVP (Minimum Viable Product) - Những phân hệ nào bắt buộc phải hoàn thành ở phiên bản đầu tiên? → A: Tất cả các trang: Bắt buộc hoàn thiện toàn bộ (Home, Library, Detail, AI, Forum, Groups, Auth, Admin) trong MVP.
- Q: Cách thức hoạt động của AI và Trích dẫn (Citations) - Tính năng AI chat sẽ cho phép truy vấn trên toàn thư viện hay trên từng tài liệu cụ thể? Trích dẫn cần hiển thị thế nào? → A: Cả hai chế độ + Rich Citations: Cho phép chat chung và chat theo tài liệu. Trích dẫn là các UI Component Card có thể click để đọc tiếp.
- Q: Tính năng Tìm kiếm & Đọc tài liệu ở Thư viện - Mức độ phức tạp của bộ lọc và cách thức đọc tài liệu (PDF) trên web sẽ như thế nào? → A: Nâng cao: Lọc đa chiều (danh mục, năm, tác giả). Tích hợp custom PDF viewer. Dùng phân trang (Pagination).
- Q: Chiến lược Mock Data & Kết nối Backend - Mức độ hoàn thiện của Mock Service đối với endpoint chưa có? → A: Mock toàn diện: Xây dựng service layer hoàn chỉnh trả về JSON giả lập (có giả lập delay/loading). Ghi chú rõ các endpoint còn thiếu cho Backend.
- Q: Cân bằng UI/UX - Hiệu ứng 3D & Storytelling vs Hiệu năng - Chiến lược đánh đổi trên thiết bị di động? → A: Cân bằng: Trải nghiệm 3D đầy đủ trên Desktop/Tablet. Trên Mobile, vô hiệu hóa 3D (dùng fallback image), giữ lại animation nhẹ nhàng.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Homepage Discovery and Storytelling (Priority: P1)

A prospective student visits the platform for the first time and is guided through a scroll-driven visual story (with 3D elements) that explains the problem of fragmented study materials and how this platform solves it using AI, forums, and study groups. The user is prompted to explore the library or ask the AI.

**Why this priority**: First impressions are critical for user onboarding. The homepage sets the academic and modern tone for the entire platform.

**Independent Test**: Can be fully tested by loading the root URL (`/`) on desktop and mobile, ensuring animations trigger correctly on scroll, and verifying that CTA buttons navigate to the correct sections.

**Acceptance Scenarios**:

1. **Given** a user lands on the homepage, **When** they scroll down, **Then** narrative sections fade in/animate without causing performance lag.
2. **Given** a user is on a mobile device, **When** they view the homepage, **Then** the 3D elements are either gracefully degraded or responsive to prevent horizontal scrolling.

---

### User Story 2 - Library Browse and Search (Priority: P1)

A student needs to find research materials. They navigate to the Library page, enter a keyword in the search bar, and apply a filter for "Computer Science". They browse the results presented as cards and sort them by "Most Relevant".

**Why this priority**: Core value proposition. Without finding documents, the rest of the library is useless.

**Independent Test**: Can be tested by navigating to `/library`, typing a search query, applying a filter, and verifying the displayed mock/real data reflects the criteria.

**Acceptance Scenarios**:

1. **Given** the library page is loaded, **When** the user applies a category filter, **Then** the list updates to show only documents in that category.
2. **Given** the backend API is slow, **When** the user searches, **Then** a clear skeleton loading state is shown.
3. **Given** a search yields no results, **When** the query completes, **Then** a friendly "No documents found" empty state is displayed.

---

### User Story 3 - Document Detail and Interaction (Priority: P1)

A student selects a document from the library. They view the document's full metadata, read its description, and decide to click "Save to Favorites". After reading, they click "Ask AI about this document" to jump to the AI assistant with the document context pre-loaded.

**Why this priority**: Essential for content consumption and bridging the gap between passive reading and active learning (AI/saving).

**Independent Test**: Can be tested by visiting `/library/document/:id`, verifying metadata is rendered, and ensuring action buttons (Save, Download, Ask AI) trigger the appropriate side-effects or navigation.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user views a document, **When** they click "Save", **Then** they are prompted to log in.
2. **Given** a user clicks "Ask AI", **When** they are redirected, **Then** the AI page loads with the document context attached.

---

### User Story 4 - Academic AI Assistant (Priority: P1)

A student wants to understand a complex concept. They navigate to the AI Chat page, type a question, and receive a detailed answer. The answer includes explicit citations pointing to specific documents in the library.

**Why this priority**: The AI assistant is a primary differentiator of the platform, enabling deeper, guided learning.

**Independent Test**: Can be tested by sending a message in the chat interface and verifying the UI displays a "thinking" state, followed by the response and rendered citation links.

**Acceptance Scenarios**:

1. **Given** the user submits a prompt, **When** the AI is processing, **Then** a professional loading indicator is shown.
2. **Given** the AI returns an answer with sources, **When** it renders, **Then** citations are clearly visible and clickable.
3. **Given** the AI API fails, **When** the request times out, **Then** a clear error message suggests trying again later.

---

### User Story 5 - Academic Forum Interaction (Priority: P2)

A user navigates to the Forum to discuss a topic. They browse posts by the tag "Machine Learning", click on an interesting topic to read the full thread, and add a comment to participate in the discussion.

**Why this priority**: Fosters community and peer-to-peer knowledge sharing, which is crucial for engagement but secondary to core document/AI features.

**Independent Test**: Can be tested by navigating to `/forum`, viewing the list of posts, viewing a single post at `/forum/post/:id`, and submitting a new comment.

**Acceptance Scenarios**:

1. **Given** a user views a post, **When** they submit a comment, **Then** the comment appears at the bottom of the thread.
2. **Given** the backend endpoint for forums is not ready, **When** the page loads, **Then** it renders mock data via the service layer.

---

### User Story 6 - Study Groups (Priority: P2)

A student wants to collaborate. They visit the Study Groups page, browse available public groups, and click "Join" on a group studying "Data Structures".

**Why this priority**: Enhances collaborative learning.

**Independent Test**: Can be tested by viewing `/groups`, seeing group cards, and verifying the "Join" action triggers an API call/mock success.

**Acceptance Scenarios**:

1. **Given** a user is logged in, **When** they click join on a public group, **Then** they are added to the member list.
2. **Given** a group has no members, **When** the detail page loads, **Then** an appropriate empty state is shown for the member list.

---

### User Story 7 - Authentication (Priority: P1)

A user wants to save a document, which requires an account. They navigate to the Login page, enter their email and password, and upon success, are redirected back to the document with their logged-in state preserved.

**Why this priority**: Fundamental requirement for any personalized actions (saving, joining groups, posting).

**Independent Test**: Can be tested by submitting the login form, observing validation errors for bad input, and verifying secure session storage on success.

**Acceptance Scenarios**:

1. **Given** the login form, **When** the user submits an invalid email format, **Then** an inline validation error is shown before submission.
2. **Given** successful login, **When** the user returns to the app, **Then** their profile/avatar is visible in the navigation bar.

---

### User Story 8 - Admin Dashboard (Priority: P3)

An administrator logs in and accesses the Admin Dashboard. They view system statistics (total users, documents) and have interfaces to manage (hide/delete) inappropriate forum posts or user accounts.

**Why this priority**: Important for platform moderation, but standard users do not interact with it.

**Independent Test**: Can be tested by logging in as an admin, navigating to `/admin`, and verifying statistical data is displayed.

**Acceptance Scenarios**:

1. **Given** a non-admin user attempts to access `/admin`, **When** the route resolves, **Then** they are redirected to an unauthorized/403 page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a responsive homepage with scroll-driven storytelling. For Desktop/Tablet, this MAY include 3D elements (with strict memory cleanup). For Mobile, the system MUST prioritize performance by using static fallback images instead of 3D, keeping only lightweight animations.
- **FR-002**: System MUST allow users to search, filter (by category, discipline, type, year, author), and sort documents in the library, using traditional pagination for results.
- **FR-003**: System MUST display detailed document metadata, including stats, and provide actions to read (via a custom integrated PDF viewer), download, or save.
- **FR-004**: System MUST support both global library AI chat and contextual document-specific AI chat. Citations MUST be rendered as interactive rich UI cards (showing title, page, etc.) that users can click to view the source, rather than plain text links. The frontend must not invent hallucinated responses.
- **FR-005**: System MUST allow users to view academic forum topics, filter by tags, and participate in discussions if authenticated.
- **FR-006**: System MUST provide a directory of study groups and allow authenticated users to join or create them.
- **FR-007**: System MUST provide authentication workflows (login/register) with client-side validation and secure state management.
- **FR-008**: System MUST provide an admin dashboard to view system statistics and manage content (if supported by backend).
- **FR-009**: System MUST define UI components, hooks, and service integrations using React/Next.js, TypeScript, and Tailwind CSS.
- **FR-010**: System MUST gracefully handle all UI states including loading skeletons, informative empty states, and user-friendly error messages.
- **FR-011**: System MUST isolate API calls within the service layer. If backend endpoints are unavailable, the system MUST implement comprehensive mock services (returning dummy JSON with simulated network delays) to fully support UI development and testing, and explicitly document missing APIs.

### Key Entities

- **Document**: Represents a learning resource. Attributes: ID, title, description, author, category, type, publishDate, coverImage, stats (views, downloads, saves).
- **User**: Represents a platform member. Attributes: ID, email, name, role (student/faculty/admin), savedDocuments, joinedGroups.
- **ForumPost**: Represents a discussion thread. Attributes: ID, title, summary, author, createdAt, tags, commentCount, upvotes.
- **StudyGroup**: Represents a collaborative workspace. Attributes: ID, name, description, subject, memberCount, creator, isPublic.
- **AIChatMessage**: Represents a single AI interaction. Attributes: ID, role (user/ai), content, citations, timestamp.

### Access Control

- **Actor/Role**: Guest (Unauthenticated)
- **Protected API**: Saving documents, posting in forums, joining groups, asking AI (depending on backend config).
- **Denied Behavior**: Redirected to login page or shown a login modal with a clear explanation.
- **Actor/Role**: Admin
- **Protected API**: Accessing `/admin` routes, deleting user posts.
- **Denied Behavior**: Redirected to 403 Forbidden page.

### Validation Rules

- **DTO/Input**: User Login/Registration forms.
- **Invalid Input Behavior**: Real-time inline field errors (e.g., "Invalid email format", "Password must be at least 8 characters").
- **DTO/Input**: Forum Post Creation.
- **Invalid Input Behavior**: Submit button disabled until title and content meet minimum length requirements.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can locate a relevant document using search and filters in under 60 seconds.
- **SC-002**: AI chatbot responses always display source citations clearly when provided by the backend API.
- **SC-003**: The frontend application maintains a responsive, horizontally-scroll-free layout across standard mobile (320px+), tablet, and desktop viewports.
- **SC-004**: System handles missing backend endpoints by rendering informative mock states 100% of the time, preventing white-screen crashes.
- **SC-005**: Navigation between major modules (Home, Library, Forum, AI) occurs without full page reloads, utilizing client-side routing.

## Assumptions

- The MVP scope includes all identified modules (Home, Library, Detail, AI, Forum, Groups, Auth, Admin) for the first release.
- The backend will use standard REST or GraphQL JSON formats.
- Real-time features (like live typing indicators or live chat in study groups) are out of scope for the MVP unless standard polling or existing API endpoints support it.
- Authentication relies on a standard JWT or session cookie mechanism provided by the backend.
- The platform's color palette strictly adheres to white, green, and soft red accents as requested.
