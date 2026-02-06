# Scout Access Gateway

A secure access portal built with React, TypeScript, and Supabase. This application provides email-based authentication with allowlist-based access control.

## Technologies

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Authentication & Database)
- **Routing**: React Router DOM
- **State Management**: TanStack Query

## Prerequisites

- Node.js 18+ (or use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- npm or bun
- A Supabase project ([create one here](https://app.supabase.com))

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
bun install
```

### 2. Set Up Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_N8N_WEBHOOK_URL=  # Optional: for n8n workflow automation
```

Get your Supabase credentials from your [Supabase Dashboard](https://app.supabase.com) → Settings → API.

### 2b. Configure Vercel Environment Variables (Deployment)

When deploying to Vercel, add the same variables in the Vercel project settings:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_N8N_WEBHOOK_URL` (optional)

Vercel builds the app using `npm run build` and serves the `dist/` output. Client-side routing is handled via a rewrite to `index.html` (see `vercel.json`).

### 3. Set Up Database

Run the database migrations to create the required tables and functions:

**Option A: Using Supabase CLI**
```bash
supabase link --project-ref your-project-ref
supabase db push
```

**Option B: Manual Setup**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration files from `supabase/migrations/` in order

### 4. Add Users to Allowlist

After setting up the database, add allowed users:

```sql
INSERT INTO public.allowed_users (email, enabled)
VALUES ('user@example.com', true);
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/     # React components
│   └── ui/        # shadcn/ui components
├── hooks/         # Custom React hooks
├── integrations/  # Third-party integrations (Supabase)
├── lib/           # Utility functions
├── pages/         # Page components
└── App.tsx        # Main app component
```

## Features

- ✅ Email/password authentication via Supabase
- ✅ Allowlist-based access control
- ✅ Secure RPC-based allowlist checking
- ✅ Modern, responsive UI with shadcn/ui
- ✅ PWA support with service worker
- ✅ Optional n8n webhook integration

## Migration from Lovable.dev

If you're migrating from Lovable.dev, see the comprehensive migration guide in [`cursor-migration.md`](./cursor-migration.md).

## Documentation

For detailed setup instructions, troubleshooting, and development guidelines, see [`cursor-migration.md`](./cursor-migration.md).

## License

Private project
