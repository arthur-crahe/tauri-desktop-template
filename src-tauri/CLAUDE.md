# Backend (`src-tauri/`)

Rust + Tauri 2. Entry split: `src/main.rs` is the thin binary (`app_lib::run()`); `src/lib.rs` holds `run()` and wires the app (plugins + command handlers). `[lib].name = "app_lib"` in `Cargo.toml` must match the `app_lib::run()` call.

## Commands — the frontend↔Rust boundary

- `commands/` — Tauri commands, each a thin `#[tauri::command]`. Register them in `lib.rs` via `tauri::generate_handler![…]`. The frontend calls them through the typed bindings in `src/lib/commands.ts` — never via raw `invoke`.
- `greet` (`commands/greet.rs`) is an example round-trip; replace it with your own commands.
- Prefer `async` commands with owned `String` args and `Result<T, E>` returns (with `E: serde::Serialize`) once you add fallible work. Introduce a single `thiserror` error enum that serializes to the frontend when you need structured errors.

## Notes

- Custom commands need no plugin permission; `capabilities/default.json` grants `core:default` to the `main` window, plus the explicit window/updater/process permissions the chrome and updater use. Add plugin permissions there only when you introduce a plugin.
- The updater plugin is desktop-gated in `lib.rs` so mobile targets still build (this template targets desktop).
- Icons in `icons/` are generated via `pnpm tauri icon <source.png>` — regenerate them with your own art; don't hand-author.
- `gen/` is build-generated (gitignored) — never authored or committed.
- Versions: `tauri`/`tauri-build`/`@tauri-apps/cli` share a minor; keep `Cargo.toml`, `Cargo.lock`, `package.json` and `tauri.conf.json` versions in sync (the `/release` command does this).
