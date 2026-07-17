# Aster Journal

A premium digital journal web application built with Next.js App Router,
React, TypeScript, Tailwind CSS, and Framer Motion. The product direction is
calm, elegant, immersive, and dark by default.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run format
npm run format:check
```

## Folder Structure

`src/app` contains App Router routes, layouts, metadata, and global CSS entry
points. Keep route files thin and compose feature-level components from here.

`src/components/ui` contains reusable, domain-agnostic interface primitives
such as buttons and panels. These should stay small, typed, accessible, and
easy to reuse across future pages.

`src/components/layout` contains layout primitives that define page structure
and atmosphere, such as the application shell. These components should not own
journal business logic.

`src/features/journal` contains journal-specific UI, data models, and future
behavior. Feature folders keep product logic isolated as the app grows.

`src/features/journal/components` contains components that belong only to the
journal experience, including the home composition and motion wrapper.

`src/features/journal/data` contains typed local seed data used before Supabase
is introduced. Later, this folder can shrink or become adapters around server
queries.

`src/lib` contains tiny shared utilities that are not tied to a route or
feature. Keep this folder selective so it does not become a junk drawer.

`src/styles` contains design tokens and shared styling inputs. The app is dark
by default through CSS variables defined here.

`src/types` contains shared TypeScript types that may be consumed by multiple
features or infrastructure layers.

`public` is reserved for static assets served directly by Next.js.

## Architecture Notes

The home route remains a Server Component by default. Framer Motion is isolated
inside `Reveal`, a small Client Component, so the interactive JavaScript surface
stays intentionally narrow.

Authentication and Supabase are intentionally not implemented yet. The current
data is typed local seed content so the UI and information architecture can
mature before persistence is added.

## Design System

The design system lives in CSS tokens, Tailwind utilities, and typed React
components.

Color palette: `porcelain`, `graphite`, `ink`, `sage`, `blue`, `amber`, and
`rose` are defined in `src/styles/tokens.css` and exposed through Tailwind in
`src/app/globals.css`. The palette is dark-first, neutral-led, and uses quiet
accent colors for premium depth instead of loud decoration.

Typography: use `ds-text-display` for hero/display moments, `ds-text-body` for
long-form copy, and `ds-caption` for labels and metadata. Display text uses
tight line-height and balanced wrapping; body text uses softer contrast and
generous line-height.

Spacing system: spacing tokens follow a 4px base scale with larger rhythm steps
at 16, 24, 32, 48, 64, 80, and 96px. Use `ds-container` and `ds-page-pad` for
page structure.

Border radius: use restrained radii from `xs` through `xl`. Cards and inputs
prefer `md` or `lg`; pill buttons use full radius.

Shadows: use soft elevation rather than heavy drop shadows. `ds-surface` is for
standard frosted surfaces, `ds-surface-strong` is for elevated hero/editor
surfaces, and `shadow-glow` is reserved for the primary button.

Motion guidelines: use 160ms for immediate tactile feedback, 240ms for
component state changes, and 520ms for scene-level reveals. `ds-transition`
keeps hover/focus behavior consistent, while Framer Motion handles larger
entrance transitions.

Buttons: `Button` supports `primary`, `secondary`, `ghost`, `quiet`, and
`danger`, with `sm`, `md`, and `lg` sizes.

Cards: `Card` supports `frosted`, `elevated`, `quiet`, and `outline` variants.
`GlassPanel` remains available for larger atmospheric sections.

Inputs: `Input` and `Textarea` share the same field styling, focus ring,
hairline shadow, disabled states, and dark-first contrast.

### SUPABASE_SERVICE_ROLE_KEY (obtaining and verifying)

1. Find the key in Supabase:
	- Go to your project in the Supabase dashboard → Settings → API.
	- Under "Project API keys" click "Reveal" on the `service_role` (Service role) key and copy it.

2. Set it locally (do NOT commit):
	- Create/update `.env.local` at the repo root and add:

```
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
ENABLE_ENV_DEBUG=true
```

	- Important: never prefix the service role key with `NEXT_PUBLIC_` — keep it server-only.
	- `ENABLE_ENV_DEBUG` is optional and used only for a temporary, guarded verification endpoint (described next).

3. Set in production:
	- Vercel: Project → Settings → Environment Variables → add `SUPABASE_SERVICE_ROLE_KEY` (and `SUPABASE_URL`/`SUPABASE_ANON_KEY`), save and redeploy.
	- Netlify/Other: Use equivalent environment/secret settings in your host and redeploy.

4. Optional: temporary verification route
	- This repo includes a small server-only verification route at `/api/debug/env`. It is intentionally disabled by default and only responds when `ENABLE_ENV_DEBUG=true` is set in the environment.
	- To test locally: add `ENABLE_ENV_DEBUG=true` to `.env.local`, start the dev server, then:

```bash
curl http://localhost:3000/api/debug/env
```

	- The endpoint returns JSON `{ "serviceRoleKeyPresent": true }` or `{ "serviceRoleKeyPresent": false }` and never returns the key value itself.
	- IMPORTANT: Do NOT enable `ENABLE_ENV_DEBUG` in production for longer than necessary. Remove it after verification.

5. Security notes
	- The service role key grants full DB privileges. Never expose it to clients or commit it to source control.
	- Rotate the key in the Supabase dashboard if it may have been exposed.

