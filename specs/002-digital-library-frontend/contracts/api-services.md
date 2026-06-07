# API Service Contracts & Mocking Strategy

The frontend strictly isolates backend communication in the `src/services` layer. Until backend endpoints are ready, these services will return Promise-wrapped mock data with simulated network delays.

## Mock Strategy Configuration

```typescript
// src/config.ts
export const config = {
  // Toggle this to false to hit the real backend
  USE_MOCKS: process.env.NEXT_PUBLIC_USE_MOCKS === 'true' || true,
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  MOCK_DELAY_MS: 800,
};
```

## Core Service Contracts

### 1. Library Service (`src/services/library.service.ts`)
```typescript
interface DocumentFilters {
  query?: string;
  category?: string;
  year?: number;
  author?: string;
  page?: number;
  limit?: number;
}

export const LibraryService = {
  getDocuments: async (filters: DocumentFilters): Promise<{ data: Document[], total: number }> => { ... },
  getDocumentById: async (id: string): Promise<Document> => { ... },
  saveDocument: async (id: string): Promise<void> => { ... }
};
```

### 2. AI Service (`src/services/ai.service.ts`)
```typescript
export const AIService = {
  // contextDocumentId is optional for global chat
  askQuestion: async (query: string, contextDocumentId?: string): Promise<AIChatMessage> => { ... },
  getChatHistory: async (): Promise<AIChatMessage[]> => { ... }
};
```

### 3. Forum Service (`src/services/forum.service.ts`)
```typescript
export const ForumService = {
  getPosts: async (tags?: string[]): Promise<ForumPost[]> => { ... },
  getPostById: async (id: string): Promise<{ post: ForumPost, comments: ForumComment[] }> => { ... },
  createPost: async (title: string, content: string, tags: string[]): Promise<ForumPost> => { ... },
  addComment: async (postId: string, content: string): Promise<ForumComment> => { ... }
};
```

### 4. Auth Service (`src/services/auth.service.ts`)
```typescript
export const AuthService = {
  login: async (email: string, password: string): Promise<{ token: string, user: User }> => { ... },
  logout: async (): Promise<void> => { ... },
  getCurrentUser: async (): Promise<User | null> => { ... }
};
```

All methods will check `config.USE_MOCKS`. If true, they import the corresponding JSON from `src/mocks/` and return it after a `setTimeout` of `config.MOCK_DELAY_MS`.
