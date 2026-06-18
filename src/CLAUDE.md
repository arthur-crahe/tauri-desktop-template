# Frontend (`src/`)

React + TypeScript (strict) on Vite, rendered in the Tauri 2 WebView. UI built with **`@radix-ui/themes`**.

## Organization (feature-based)

- `app/` — bootstrap: root render, providers, the Radix `<Theme>` wrapper, the error boundary, and the frameless window chrome (`titlebar`, `window-controls`, `window-resizers`).
- `features/` — one folder per feature; colocate that feature's components, hooks and tests. `greeting/` is an example demonstrating the Rust boundary — delete it.
- `components/` — shared presentational components built **on top of** Radix Themes (not a reimplementation of it).
- `stores/` — Zustand stores. One store per concern; expose selectors, colocate actions with state; hook naming `useXStore`.
- `lib/` — framework-agnostic helpers, shared types, and the **Tauri command bindings** (`commands.ts`: typed wrappers over `@tauri-apps/api`'s `invoke` — the single place the frontend talks to Rust). Also `runtime.ts` (Tauri-vs-browser guard), `window.ts` (window controls), `updater.ts` (in-app updater).
- `styles/` — global styles and theme tokens.
- `test/` — Vitest setup (`setup.ts`).

## Conventions

- Cross the Rust boundary only through `lib/` bindings — components never call `invoke` directly.
- Guard Tauri-only calls with `isTauriRuntime()` so the app stays inert under `pnpm dev` in a plain browser.
- `import type` for type-only imports. JSDoc on exported functions, hooks, and types.
- Unit tests colocated as `*.test.ts(x)` (Testing Library + jsdom). No E2E/integration.
