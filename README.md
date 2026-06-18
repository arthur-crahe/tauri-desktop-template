# Tauri Desktop Template

A reusable, production-shaped skeleton for a **cross-platform desktop app (Linux + Windows)** — fully local, no backend, no accounts.

**Stack:** Tauri 2 · React 19 + TypeScript (strict) · Vite · Radix Themes · Zustand · pnpm · Biome · Vitest · Rust (stable).

**What ships working out of the box**

- Custom **frameless window chrome** — seamless titlebar, min/maximize/close controls, and resize grips (`decorations: false`).
- **In-app updater** wired to GitHub Releases (Tauri updater plugin) — dormant until you configure it.
- **Release pipeline** — `.github/workflows/release.yml` + the `/release` command build signed installers on `app-v*` tags.
- Strict TypeScript + Rust, **Biome** lint/format, **Vitest** unit tests, and an error boundary + anti-flash launch.
- An example feature (`src/features/greeting`) demonstrating the **React ↔ Rust** boundary — delete it when you start.

## Prerequisites

- **Node ≥ 22** and **pnpm 10** (`corepack enable` or `npm i -g pnpm@10`).
- **Rust** (stable) via `rustup`.
- **Tauri Linux system libs** (Debian/Ubuntu):
  ```sh
  sudo apt install libwebkit2gtk-4.1-dev build-essential curl wget file \
    libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev
  ```

## Run

```sh
pnpm install
pnpm dev          # frontend only (Vite) at http://localhost:1420 — Tauri APIs inert
pnpm tauri dev    # native desktop window (requires Rust + the libs above)
```

Quality gate:

```sh
pnpm typecheck    # tsc (app + tooling configs)
pnpm lint         # biome check
pnpm test         # vitest (unit)
pnpm format       # biome format --write
```

## Make it yours — rename checklist

Replace these identifiers across the repo, then `pnpm install` to refresh the lockfile importer name:

| Token | Where | Replace with |
|---|---|---|
| `tauri-desktop-template` | `package.json` (`name`), `src-tauri/Cargo.toml` (`[package].name`), `src-tauri/Cargo.lock` (the matching package block), `.claude/commands/release.md` (Cargo.lock matcher) | your **kebab-case** package/crate name |
| `Tauri Desktop Template` | `index.html` (`<title>`), `src-tauri/tauri.conf.json` (`productName`, window `title`), `src/app/app.tsx`, `src/app/titlebar.tsx`, `.github/workflows/release.yml` (`releaseName`) | your **display name** |
| `com.example.desktop` | `src-tauri/tauri.conf.json` (`identifier`) | your reverse-DNS **bundle identifier** |
| `OWNER/REPO` | `src-tauri/tauri.conf.json` (updater endpoint), `.github/workflows/release.yml`, `.claude/commands/release.md`, `docs/adr/0002-*.md` | your GitHub `owner/repo` |

Then:

1. **Icons** — drop your art in and regenerate: `pnpm tauri icon path/to/icon.png` (overwrites `src-tauri/icons/` and `app-icon.png`).
2. **Delete the example** — remove `src/features/greeting/`, its import in `src/app/app.tsx`, `src/lib/commands.ts` (+ test) if unused, and `src-tauri/src/commands/greet.rs` (+ its `generate_handler!` entry and the `pub use` in `commands/mod.rs`).
3. **Theme** — adjust the Radix `<Theme>` props in `src/main.tsx` (`accentColor`, `grayColor`, `radius`, `appearance`) and `--titlebar-height` / colors in `src/styles/global.css`.
4. **Language** — the UI strings are in French; translate as needed.

Want **native OS window decorations** instead of the custom chrome? Set `decorations: true` in `tauri.conf.json`, delete `src/app/{titlebar,window-controls,window-resizers}.tsx`, `src/lib/window.ts`, drop the `.app-shell`/`.titlebar`/`.win-*` CSS, and remove the `core:window:allow-*` permissions from `src-tauri/capabilities/default.json` plus the `revealWindow`/`WindowResizers` usage in `app.tsx` and `error-boundary.tsx`.

## Configure the updater

The updater is **wired but dormant**: with the placeholder pubkey the launch check fails silently and the app runs fine. To enable self-updates:

1. **Generate a signing keypair** (do this once; back it up — it is irreplaceable):
   ```sh
   pnpm tauri signer generate -w ~/.tauri/myapp.key
   ```
2. **Public key** → `src-tauri/tauri.conf.json` → `plugins.updater.pubkey` (replace `REPLACE_WITH_YOUR_MINISIGN_PUBLIC_KEY`).
3. **Endpoint** → same file → set `OWNER/REPO` in the `endpoints` URL.
4. **Private key + password** → GitHub repo secrets `TAURI_SIGNING_PRIVATE_KEY` (file contents) and `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`.

The full rationale, channel choices, and key-rotation runbook live in [`docs/adr/0002-update-and-distribution-strategy.md`](docs/adr/0002-update-and-distribution-strategy.md).

> Local `pnpm tauri build` with `createUpdaterArtifacts: true` needs the signing env vars too. For a quick unsigned local build, temporarily set `createUpdaterArtifacts: false`.

## Release

Installers are **never committed** — they ship as GitHub Release assets. Cut a release with the **`/release`** Claude Code command (or follow its steps manually): it bumps the version across all four files, runs the gate, commits, tags `app-v<version>`, and pushes. The `app-v*` tag triggers the matrix build (`ubuntu-22.04` → `.deb`/`.rpm`/`.AppImage`; `windows-latest` → NSIS `.exe` + MSI), which creates a **draft** Release for you to review and publish.

Build releases only through CI — a dev box's newer glibc breaks portability on older distros.

## Project layout

```
src/
  app/         bootstrap, Radix theme, error boundary, frameless window chrome
  features/    one folder per feature (greeting/ is an example — delete it)
  components/  shared components built on Radix Themes
  stores/      Zustand stores (use-update-store)
  lib/         Tauri command bindings, runtime/window/updater helpers
  styles/      global CSS + theme tokens
  test/        Vitest setup
src-tauri/
  src/         lib.rs (wiring), main.rs (binary), commands/ (Tauri commands)
  capabilities/ window/updater/process permissions
  tauri.conf.json, Cargo.toml
docs/
  adr/         architecture decisions (0002: update & distribution)
  reference/   tauri2-window-options.md (full window/webview option catalog)
```

See `CLAUDE.md`, `src/CLAUDE.md`, and `src-tauri/CLAUDE.md` for the conventions and architecture in detail.
