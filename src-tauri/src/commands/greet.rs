/// Example command: builds a greeting for `name`.
///
/// Demonstrates the React → Rust round-trip; the frontend calls it through
/// `greet()` in `src/lib/commands.ts`. Delete it (and its registration in
/// [`crate::run`]) once you add real commands.
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {name}! This greeting came from Rust.")
}
