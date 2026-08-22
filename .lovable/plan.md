# Talksy — Reliability, Cost-Saving AI, History, Settings & Polish

## What we'll build

### 1. Fix broken images
- Verify the Talksy logo CDN asset and favicon actually serve; re-upload the logo as a fresh asset if it fails.
- Add image fallbacks (`onError` → branded placeholder) so nothing ever renders as a broken icon.
- Fix screenshot thumbnails in the dropzone (they can break with very large data URLs — see compression below).

### 2. Illustrations & device-aware animation
- Generate 3 lightweight on-brand illustrations (dark charcoal + mint) for empty states: Analyze, Profile, Practice/History.
- CSS-only micro-animations (fade/slide-in on panels, subtle hero glow) using `transform`/`opacity` only.
- All animations gated behind `prefers-reduced-motion` and reduced automatically on low-end/mobile devices — no JS animation libraries, no layout-thrashing effects, so the app stays fast.

### 3. AI credit optimization (best answers, fewer calls)
- **Client cache**: identical requests (same text/images/context hash) return the saved result instantly from localStorage instead of a new AI call.
- **Screenshot compression**: resize uploads to max ~1024px JPEG before sending — big token/cost savings and faster uploads on mobile data.
- **Lean prompts**: tighten system prompts (concise but never truncating useful detail — the AI gives long, thorough answers whenever the conversation needs them), cap practice history sent to the last ~12 messages, cap suggestions at 4.
- Keep the existing free-primary → fallback model chain; cache + compression sit on top.

### 4. History page (local storage only)
- New `/history` route: full list of past chat analyses, profile analyses and practice sessions with type filter, reopen-to-view, single delete and clear-all. Nothing leaves the device.

### 5. Fix profile analyzer for username/URL input
- Today entering only `@not_4_shah` errors because Talksy can't (and won't) scrape Instagram. Fix the experience:
  - Accept `@handle` or full profile URL with proper cleaning/validation.
  - Server makes a best-effort fetch of the **public** profile page metadata; if Instagram blocks it (usual), show a friendly guided state: "Instagram doesn't allow automatic access — paste the bio or upload screenshots" with the handle pre-filled, instead of a raw error toast.

### 6. Settings page + themes
- New `/settings` route: theme selector (**System / Light / Dark**, default dark), "use my style" toggle, data management.
- Add a light theme token set to `styles.css`; theme applies via `.dark` class on `<html>` with a tiny inline init script (no flash of wrong theme), persisted in localStorage, respects OS setting on "System".
- Settings & History added to nav (desktop header + mobile bottom bar stays at 5 items: Home, Analyze, Practice, History, Settings — Profile & Coach reachable from Home tiles; or via a "More" sheet if preferred).

### 7. Hinglish support
- Update all AI system prompts: fully understand Hinglish/Hindi-English mixed input (romanized Hindi like "kya hua tha ki mai bahar jaa rha tha"), and write reply suggestions in the **same language/register as the conversation** (English chat → English replies; Hinglish chat → Hinglish replies).

### 8. Speed & mobile
- Compression + caching make repeat use near-instant; keep bundle lean (no new heavy deps).
- Mobile layout sweep on all pages after changes (Playwright, mobile viewport) to confirm nothing overflows and tap targets are comfortable.

## Technical notes
- New routes: `src/routes/history.tsx`, `src/routes/settings.tsx`; nav updated in `AppShell.tsx`.
- Theme: light tokens in `src/styles.css`, init script in `__root.tsx` head, `ThemeProvider` reading `cc.theme` from localStorage.
- AI layer changes in `src/lib/ai.server.ts` (prompt language rules) and `src/lib/coach.functions.ts` (trimmed payloads); client cache + image compression in `src/lib/store.ts` / `coach-ui.tsx`.
- Illustrations generated with the image tool, stored as Lovable Assets.
- Verification: build log clean, mobile + desktop preview screenshots, one real AI call per changed flow.
