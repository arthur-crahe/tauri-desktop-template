# Tauri Desktop Template

A reusable skeleton for a **cross-platform desktop app (Linux + Windows)** built with Tauri 2 — fully local, no backend service, no account system. Clone it, rename it (see `README.md`), and build your features on top.

The skeleton ships working: a custom frameless window chrome, an in-app updater wired to GitHub Releases, a release pipeline, strict TypeScript + Rust, and unit tests from the start. An example feature (`greeting`) demonstrates the React↔Rust boundary and is meant to be deleted.

## Stack — locked decisions

- **Tauri 2** desktop shell, targets **Linux + Windows**.
- **React + TypeScript (strict)** on **Vite**.
- **UI: `@radix-ui/themes`** — the themed component library, not only the `@radix-ui/react-*` primitives.
- **State: Zustand.**
- **Package manager: pnpm.** **Lint + format: Biome.** **Tests: Vitest (unit only).**
- **Frameless window** (`decorations: false`) with a custom titlebar, window controls and resize grips. Switch to native OS decorations by setting `decorations: true` and removing `src/app/{titlebar,window-controls,window-resizers}.tsx` + `src/lib/window.ts`.

## Layout

```
CLAUDE.md            this file
README.md            getting started + rename checklist + updater setup
package.json         frontend manifest (pnpm)
pnpm-workspace.yaml  pnpm settings + build-script allowlist
tsconfig.json        strict TS for the app (src/)
tsconfig.node.json   strict TS for build tooling (vite/vitest config)
biome.json           lint + format
vite.config.ts       Vite + Tauri dev/build
vitest.config.ts     unit tests (jsdom), merges the Vite config
index.html           Vite entry
rust-toolchain.toml  Rust = stable
docs/adr/            architecture decision records (MADR)
docs/reference/      durable technical references (tauri2-window-options.md — Tauri 2 window/webview option catalog)
src/                 frontend (feature-based) — see src/CLAUDE.md
src-tauri/           Rust/Tauri backend — see src-tauri/CLAUDE.md
```

`src/`: `app/` (bootstrap, providers, Radix theme, window chrome) · `features/` (one folder per feature) · `components/` (shared, over Radix Themes) · `stores/` (Zustand) · `lib/` (helpers, types, Tauri command bindings) · `styles/` · `test/` (Vitest setup).

## Conventions

- TypeScript strict; `import type` for type-only imports (`verbatimModuleSyntax`).
- Feature-based frontend; idiomatic Rust backend (`commands/` = Tauri commands).
- Cross the Rust boundary only through `src/lib/` bindings — components never call `invoke` directly.
- Naming: files kebab-case; React components PascalCase; hooks `useX`; Zustand stores `useXStore`.
- Commits: Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `chore:`).

## Engineering standards

- Low cyclomatic complexity, single responsibility, no duplication, no dead code — keep it testable.
- Vitest **unit tests from the start**. No E2E, no integration tests.
- Complete, consistent JSDoc (TS) / doc comments (Rust), kept in sync with the code.
- Performance is a first-class concern in design choices.

## Work principles

- **CLI over hand-editing.** Prefer official CLIs (`tauri`, `pnpm`, `biome`) to generate and update config rather than hand-authoring it.
- **Research before acting.** For anything that moves (versions, schemas, tooling conventions), verify against current official sources — don't rely on memory.
- **No AI slop.** Sober, intentional code and UI; no filler comments, no redundant `.md` files.
- **Professional bar.** Sound architecture, maintainability, and performance throughout.

## Installation & running

- `pnpm install` — install frontend dependencies (pinned via `pnpm-lock.yaml`).
- `pnpm dev` — frontend only (Vite) at http://localhost:1420. Tauri/window/updater APIs are inert here.
- `pnpm tauri dev` — native desktop window. Requires first: the **Rust toolchain** (`rustup`, stable) and the **Tauri Linux system libs** — on Debian/Ubuntu: `sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev`.

Version constraints to honor: `tauri`/`tauri-build`/`@tauri-apps/cli` share the same **minor**; pnpm ≥ 11 would require Node ≥ 22 and the `allowBuilds` map (this repo is on pnpm 10 → `onlyBuiltDependencies` array).

## Releases & distribution

Installers are **never committed** — they ship as **GitHub Release assets**. `.github/workflows/release.yml` builds them on a matrix (`ubuntu-22.04` for portable `.deb`/`.rpm`/`.AppImage`, `windows-latest` for NSIS `.exe` + MSI) via `tauri-action`, on every `app-v*` tag. Cut a release with the **`/release`** command (`.claude/commands/release.md`): it bumps the version across `tauri.conf.json`/`package.json`/`Cargo.toml`/`Cargo.lock`, runs the gate, commits, tags `app-v<version>`, and pushes. The pipeline then creates a **draft** Release to review and publish. Build releases only through CI (`ubuntu-22.04`) — never from a dev box, whose newer glibc breaks portability on older distros.

The in-app updater needs a **minisign keypair** and the endpoint/owner wired in — see "Configure the updater" in `README.md`. Until configured, the updater is dormant: the launch check fails silently and the app runs normally.

## Docker — decision: not adopted

No Docker / Compose. A Tauri GUI needs a native WebView, windowing and GPU; the **Windows** target cannot be cross-built from a Linux container (it needs an MSVC host + signtool), and the maintained Tauri CI path uses bare runners. Reproducibility comes from `rust-toolchain.toml`, a pinned Node, and the documented apt one-liner for Tauri's Linux deps.

## Targets

Desktop **Linux + Windows**, professional use, **no account system**, fully local.
