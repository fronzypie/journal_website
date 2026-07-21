# Project Detail

This document is a running inventory of the current Next.js journal project.
It is written as a practical reference for future work, not as marketing copy.

## What This Project Is

Aster Journal is a premium, dark-first journaling app built with Next.js App
Router, React, TypeScript, Tailwind CSS v4, Framer Motion, and Supabase.

It includes:

- A public landing page
- Authentication flows
- A protected dashboard
- A distraction-free journal editor
- Entry detail pages
- Search, timeline, calendar, collections, and settings surfaces
- Supabase-backed API routes and schema

## Current Folder Structure

### Root

- `README.md` - project overview and setup notes
- `package.json` - app scripts and dependencies
- `next.config.ts` - Next.js configuration
- `eslint.config.mjs` - ESLint setup
- `tsconfig.json` - TypeScript config
- `supabase/` - database schema and migrations
- `public/` - static assets
- `src/` - application code

### `src/app`

Route layer for the app router.

- `src/app/page.tsx` - landing page
- `src/app/layout.tsx` - root layout and providers
- `src/app/globals.css` - global styles and Tailwind theme wiring
- `src/app/dashboard/page.tsx` - authenticated dashboard
- `src/app/write/page.tsx` - editor page
- `src/app/timeline/page.tsx` - timeline archive
- `src/app/calendar/page.tsx` - calendar archive
- `src/app/collections/page.tsx` - collections page
- `src/app/search/page.tsx` - archive search page
- `src/app/settings/page.tsx` - settings page
- `src/app/entry/[id]/page.tsx` - single-entry detail page
- `src/app/(auth)/...` - login, register, forgot password, reset password
- `src/app/api/...` - server routes for entries, collections, search documents, account deletion, debug

### `src/components`

Shared UI and app-level building blocks.

- `components/ui/` - button, card, input, glass panel
- `components/layout/` - app shell
- `components/providers/` - auth and theme sync providers
- `components/search/` - global search launcher and overlay
- `components/auth/` - auth menu

### `src/features`

Feature-scoped UI and data.

- `features/journal/components/` - journal views and landing compositions
- `features/journal/data/` - supporting typed data and legacy seed content
- `features/search/components/` - search results view
- `features/search/data/` - public search documents and shared search helpers
- `features/auth/components/` - forms and auth cards
- `features/auth/lib/` - password strength and validation helpers
- `features/settings/components/` - user settings view

### `src/lib`

Small shared utilities.

- `lib/supabase/` - browser, server, admin, and env helpers
- `lib/markdown.ts` - minimal markdown rendering for previews and entries
- `lib/motion.ts` - animation easing values
- `lib/cn.ts` - class name helper

### `src/types`

- `types/journal.ts` - shared journal types

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Supabase SSR and Supabase JS
- ESLint 9
- Prettier

## Existing Components

### UI Primitives

- `Button` with primary, secondary, ghost, quiet, and danger variants
- `Card` with frosted, elevated, quiet, and outline variants
- `Input` and `Textarea`
- `GlassPanel`

### Layout and Providers

- `AppShell` for the atmospheric page wrapper
- `AuthProvider` for session state and auth actions
- `ThemeSync` for local theme persistence

### Auth Components

- `AuthShell`
- `AuthCard`
- `AuthField`
- `PasswordField`
- `PasswordStrengthIndicator`
- `LoginForm`
- `RegisterForm`
- `ForgotPasswordForm`
- `ResetPasswordForm`
- `AuthLink`

### Journal Components

- `JournalHome`
- `LandingHeader`
- `HeroPromptCard`
- `TrustStrip`
- `RecentEntriesSection`
- `AnimatedJournalPreview`
- `FaqAccordion`
- `DashboardView`
- `DistractionFreeEditor`
- `EntryDetailView`
- `TimelineView`
- `CalendarView`
- `CollectionsView`
- `Reveal`
- `DesignSystemShowcase`

### Search and Settings

- `GlobalSearch`
- `GlobalSearchLoader`
- `SearchResultsView`
- `SettingsView`

## Existing Design System

The app uses a token-driven dark visual language.

### Core Tokens

- Color palette: porcelain, graphite, ink, sage, blue, amber, rose
- Spacing scale in `src/styles/tokens.css`
- Radius scale from small to extra large
- Soft shadows for surfaces and stronger elevation for hero areas
- Motion timings for fast, base, and slow transitions

### CSS Utilities

- `ds-focus-visible`
- `ds-transition`
- `ds-surface`
- `ds-surface-strong`
- `ds-text-display`
- `ds-text-body`
- `ds-caption`
- `ds-page-pad`
- `ds-container`

### Visual Direction

- Dark-first by default
- Frosted surfaces and subtle borders
- Quiet accent colors instead of loud decoration
- Spacious editorial layouts for writing and reading
- Motion used for orientation and reveal, not constant motion noise

## Current Progress

### Working Now

- Public landing page is complete and polished
- Authentication flow is wired up
- Protected routes redirect unauthenticated users
- Dashboard pulls live Supabase entries and collections
- Dashboard streak is calculated from real journal dates
- Entry create, update, delete APIs exist
- Editor autosaves journal drafts and syncs to Supabase
- Entry detail page renders markdown and supports deletion
- Account deletion route exists through Supabase admin client
- Collections are live-backed, including create, update, delete, and reorder
- Search and command palette read from `/api/search-documents`
- Timeline and calendar render from live journal entries
- Supabase schema includes profiles, entries, collections, tags, and RLS policies
- Production build and lint were verified successfully

### Still Seeded or Local

- Some legacy seed data files still exist in `src/features/journal/data`
- Settings preferences are still stored locally in the browser
- The editor Share button still has no action

## Notable Improvements Already In Place

- Shared search ranking helper removed duplication between the search page and global search
- Search documents now come from a single live endpoint with public fallbacks
- Entry metadata generation now scopes to the authenticated user
- Dashboard now reflects actual user data instead of static placeholder cards
- Dashboard streak is based on actual entry dates
- Collections are backed by Supabase instead of `localStorage`
- Timeline and calendar now derive from live entries
- Markdown preview rendering is centralized in one helper

## Issues and Open Improvements

- The editor Share button currently has no behavior
- The custom markdown renderer is intentionally small and may need expansion later
- Account/profile flows would benefit from tighter server-side validation and more robust error handling
- A few legacy seeded data files could be removed once you want to finish the cleanup

## Notes For Future Work

- Keep route files thin and feature composition in `src/features`
- Keep small cross-cutting utilities in `src/lib`
- Preserve the token-based design language unless there is a strong product reason to change it
- Prefer live Supabase data over seeded arrays when a screen is meant to represent user content
- Treat `npm run lint` and `npm run build` as the deploy gate before release
