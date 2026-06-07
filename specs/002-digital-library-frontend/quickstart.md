# Quickstart: Digital Library Frontend

## Prerequisites
- Node.js (v18+)
- npm or pnpm

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_USE_MOCKS=true
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Notes on Mocking
Because `NEXT_PUBLIC_USE_MOCKS=true` is set, the application will not attempt to connect to a real backend. All API calls made through the service layer will return data from `src/mocks/*.json` with an artificial delay to simulate network latency.
