import { invoke } from '@tauri-apps/api/core'

/**
 * Typed bindings over the Rust commands exposed by the Tauri backend.
 *
 * This module is the **single place** the frontend talks to Rust: components and
 * stores import these functions, never `invoke` directly. One function per Rust
 * `#[tauri::command]`, with the argument/return types kept in sync with the
 * backend (`src-tauri/src/commands/`).
 *
 * The example below (`greet`) mirrors `src-tauri/src/commands/greet.rs`. Replace
 * it with your own commands.
 */

/**
 * Example command: asks the Rust backend to build a greeting.
 *
 * @param name - the name to greet.
 * @returns the greeting string produced by Rust.
 * @throws if invoked outside the Tauri WebView (no IPC available).
 */
export async function greet(name: string): Promise<string> {
  return invoke<string>('greet', { name })
}
