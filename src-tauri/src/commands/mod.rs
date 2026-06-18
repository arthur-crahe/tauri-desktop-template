//! Tauri commands — the backend half of the frontend↔Rust boundary.
//!
//! Each command is a thin `#[tauri::command]` wrapper, registered in
//! [`crate::run`] via `generate_handler!` and called from the frontend through
//! the typed bindings in `src/lib/commands.ts`. Custom commands need no plugin
//! permission (the `core:default` capability already covers them).
//!
//! `greet` is an example — replace this module with your own commands.

mod greet;

// Glob re-export so `generate_handler!` finds both the command function and the
// hidden helper items the macro generates (`__cmd__greet`, …).
pub use greet::*;
