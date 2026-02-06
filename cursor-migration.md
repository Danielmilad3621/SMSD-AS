# Scout Access Gateway - Migration Guide

## Overview

This document provides a comprehensive guide to migrating the Scout Access Gateway project from Lovable.dev to a local development environment. The project is a secure access portal built with React, TypeScript, Vite, and Supabase.

## Codebase Overview

### Project Structure

```
scout-access-gateway/
├── src/
│   ├── components/          # React components including shadcn/ui components
│   │   ├── ui/             # shadcn/ui component library
│   │   ├── LoadingSpinner.tsx
│   │   ├── NavLink.tsx
│   │   └── ScoutLogo.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts     # Authentication hook with Supabase
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── integrations/       # Third-party integrations
│   │   └── supabase/       # Supabase client and types
│   ├── lib/                # Utility functions
│   │   ├── n8n.ts         # n8n webhook integration
│   │   └── utils.ts       # General utilities
│   ├── pages/              # Page components
│   │   ├── Login.tsx      # Login page with access control
│   │   ├── Splash.tsx     # Splash screen
│   │   └── NotFound.tsx   # 404 page
│   ├── App.tsx             # Main app component with routing
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── supabase/               # Supabase configuration and migrations
│   ├── config.toml        # Supabase project config
│   └── migrations/        # Database migration files
├── public/                 # Static assets
│   ├── sw.js              # Service worker for PWA
│   └── manifest.json      # PWA manifest
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### Technology Stack

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM 6.30.1
- **Backend**: Supabase (Authentication & Database)
- **State Management**: TanStack Query (React Query) 5.83.0
- **Form Handling**: React Hook Form 7.61.1 with Zod validation
- **PWA Support**: Service Worker for offline capabilities
- **Optional Integration**: n8n webhook automation

### Key Features

1. **Authentication System**
   - Email/password authentication via Supabase
   - Allowlist-based access control
   - Automatic session management
   - Access granted/denied states

2. **Access Control**
   - Database-backed allowlist (`allowed_users` table)
   - RPC function `is_user_allowed()` for secure checks
   - Row Level Security (RLS) policies

3. **User Interface**
   - Modern, responsive design with Tailwind CSS
   - shadcn/ui component library
   - Loading states and animations
   - PWA-ready with service worker

4. **Integration Points**
   - Supabase for auth and database
   - Optional n8n webhook integration for workflow automation

## Migration Steps

### Step 1: Remove Lovable Dependencies

The following Lovable-specific dependencies have been removed:

- ✅ `lovable-tagger` package removed from `package.json`
- ✅ `componentTagger()` plugin removed from `vite.config.ts`
- ✅ README.md updated (see Step 4)

**Files Modified:**
- `package.json` - Removed `lovable-tagger` from devDependencies
- `vite.config.ts` - Removed import and plugin usage

### Step 2: Set Up Environment Variables

1. Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

2. Configure your Supabase credentials:

   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project (or create a new one)
   - Navigate to Settings → API
   - Copy the following values:
     - **Project URL** → `VITE_SUPABASE_URL`
     - **anon/public key** → `VITE_SUPABASE_PUBLISHABLE_KEY`

3. (Optional) Configure n8n webhook URL if using workflow automation:
   - Set `VITE_N8N_WEBHOOK_URL` to your n8n webhook base URL

**Example `.env` file:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
```

### Step 3: Set Up Supabase Database

The project requires a Supabase database with the following schema:

1. **Run Database Migrations**

   The migrations are located in `supabase/migrations/`. You have two options:

   **Option A: Using Supabase CLI (Recommended)**
   ```bash
   # Install Supabase CLI if not already installed
   npm install -g supabase
   
   # Link to your Supabase project
   supabase link --project-ref your-project-ref
   
   # Run migrations
   supabase db push
   ```

   **Option B: Manual Setup via Supabase Dashboard**
   
   1. Go to your Supabase project dashboard
   2. Navigate to SQL Editor
   3. Run the migration files in order:
      - `20260206165113_2f11a089-ec8b-4e01-b592-0daa22420b75.sql`
      - `20260206165119_a5560c44-d7d4-4c76-bc31-88484e4e644d.sql`

2. **Database Schema Overview**

   - **`allowed_users` table**: Stores the email allowlist
     - `id` (UUID, primary key)
     - `email` (TEXT, unique, required)
     - `enabled` (BOOLEAN, default: true)
     - `created_at` (TIMESTAMP)
     - `updated_at` (TIMESTAMP)
   
   - **`is_user_allowed()` function**: RPC function to check if a user email is in the allowlist
     - Returns `BOOLEAN`
     - Uses `SECURITY DEFINER` for secure access
   
   - **Row Level Security (RLS)**: Enabled on `allowed_users` table
     - Policy prevents direct table access
     - All checks must go through the RPC function

3. **Add Users to Allowlist**

   After setting up the database, add allowed users:

   ```sql
   INSERT INTO public.allowed_users (email, enabled)
   VALUES 
     ('user1@example.com', true),
     ('user2@example.com', true);
   ```

### Step 4: Install Dependencies

```bash
# Navigate to project directory
cd scout-access-gateway

# Install dependencies
npm install

# Or if using bun (lockfile present)
bun install
```

### Step 5: Update Project Configuration

1. **Update Supabase Project ID** (if needed)

   The `supabase/config.toml` file contains:
   ```toml
   project_id = "dxgiaqxigzdbjzhejnaa"
   ```
   
   If you're using a different Supabase project, update this value.

2. **Verify TypeScript Path Aliases**

   The project uses `@/` alias for imports. This is configured in:
   - `tsconfig.json` - TypeScript path mapping
   - `vite.config.ts` - Vite resolve alias

   Both should point to `./src/*`.

### Step 6: Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:8080` (configured in `vite.config.ts`).

### Step 7: Test the Application

1. **Access the Application**
   - Open `http://localhost:8080` in your browser
   - You should see the Splash screen, which redirects to `/login` after 2 seconds

2. **Test Authentication**
   - Try logging in with an email that's NOT in the allowlist → Should show "Access Denied"
   - Add the email to the allowlist in Supabase
   - Try logging in again → Should show "Access Granted"

3. **Verify Supabase Connection**
   - Check browser console for any Supabase connection errors
   - Verify that authentication state is being managed correctly

## Development Workflow

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Project Conventions

- **Component Structure**: Components are in `src/components/`
- **UI Components**: shadcn/ui components in `src/components/ui/`
- **Pages**: Route components in `src/pages/`
- **Hooks**: Custom hooks in `src/hooks/`
- **Utilities**: Helper functions in `src/lib/`
- **Imports**: Use `@/` alias for src imports (e.g., `@/components/Button`)

### Code Style

- TypeScript strict mode is disabled (see `tsconfig.json`)
- ESLint configured with React hooks and refresh plugins
- Tailwind CSS for styling with custom theme configuration
- Component naming: PascalCase for components, camelCase for utilities

## Troubleshooting

### Common Issues

1. **Supabase Connection Errors**
   - Verify `.env` file exists and contains correct values
   - Check that environment variables start with `VITE_` prefix
   - Restart dev server after changing `.env` file
   - Verify Supabase project is active and accessible

2. **Database Migration Errors**
   - Ensure you have proper permissions in Supabase
   - Check that migrations are run in correct order
   - Verify RLS policies are correctly set up

3. **Build Errors**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Clear Vite cache: `rm -rf node_modules/.vite`
   - Check TypeScript errors: `npm run lint`

4. **Port Already in Use**
   - Change port in `vite.config.ts` server.port
   - Or kill process using port 8080

5. **Module Resolution Errors**
   - Verify `@/` alias is working: check `tsconfig.json` and `vite.config.ts`
   - Restart TypeScript server in your IDE

### Environment-Specific Notes

- **Development**: Uses Vite dev server with HMR
- **Production**: Build output in `dist/` directory
- **PWA**: Service worker registered automatically in development
- **Testing**: Vitest configured with jsdom for React component testing

## Next Steps

1. **Customize Branding**
   - Update `ScoutLogo` component with your logo
   - Modify colors in `tailwind.config.ts`
   - Update `index.html` meta tags

2. **Configure Authentication**
   - Set up email templates in Supabase
   - Configure password reset flows
   - Add social authentication if needed

3. **Enhance Security**
   - Review and adjust RLS policies
   - Implement rate limiting
   - Add additional security headers

4. **Deploy**
   - Build for production: `npm run build`
   - Deploy `dist/` folder to your hosting provider
   - Configure environment variables in production environment

## Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Summary of Changes Made

✅ Removed `lovable-tagger` from `package.json`  
✅ Removed `componentTagger()` from `vite.config.ts`  
✅ Created `.env.example` with required environment variables  
✅ Created this migration guide (`cursor-migration.md`)  

The project is now fully independent of Lovable.dev and ready for local development!

