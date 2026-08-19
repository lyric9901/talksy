# Talksy — finish and fix the app

Yes, I have the PRD/TRD context: AI conversation coach + Instagram profile analyzer, free to run (no database, history in the browser), OpenRouter with Gemma 4 26B A4B free as primary and Gemini 2.5 Flash Lite as fallback, mobile-first, ad-friendly later.

## Why it's broken right now

The preview still shows the blank placeholder page and the build has real errors:

- `src/routes/index.tsx` is still the Lovable placeholder, so `/` shows nothing of the app.
- The app shell (nav), toast host, and fonts are never mounted in `src/routes/__root.tsx`, so no page has navigation.
- Type errors block the build: strict index-signature access in `analyze.tsx` / `profile.tsx`, a `risk` prop that can be undefined, and the router not recognising `/coach` and `/practice` because those pages are unreachable from a working tree.

## What I'll build

1. **Brand it Talksy**
   - Your uploaded white "Talksy" wordmark becomes the header logo (works on the dark theme) and the favicon/social image.
   - Rename every "Converse Coach" string, page titles, meta descriptions, and OG/Twitter tags to Talksy.

2. **Fix the build**
   - Type the AI results properly so the strict rules pass (typed shapes for analysis, profile, practice results instead of loose objects).
   - Make the risk badge accept a missing value.
   - Confirm all five routes register cleanly.

3. **Home page (`/`)** — a real Talksy dashboard: logo hero, one-line pitch, four large tap targets (Analyze chat, Profile analyzer, Practice, Coach), today's challenge, recent saved items, and a short privacy line.

4. **Shell + polish**
   - Mount `AppShell`, the toaster, and the Google Fonts link in the root route.
   - Mobile-first pass on every page: safe-area bottom nav, no clipped headers, thumb-friendly buttons, sticky action bars, readable at 360px width.
   - Reserve a quiet ad slot area (unused for now) at the bottom of content so adding AdSense later doesn't shift layout.

5. **Verify end to end** — run a real analysis through OpenRouter, plus a profile, practice turn and style-profile run, and check the mobile layout in the browser.

## Technical notes

- No backend/database; all history and style profile stay in `localStorage`.
- AI stays server-side in `src/lib/ai.server.ts` via `createServerFn`; keys never reach the browser.
- Logo added through the asset pointer flow, not committed as a binary.
