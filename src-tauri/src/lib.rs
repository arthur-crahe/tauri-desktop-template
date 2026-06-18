mod commands;

/// Builds and runs the Tauri application.
///
/// Registers the desktop plugins (process + updater) and the command handlers,
/// then starts the event loop. Add your own commands to the `commands` module
/// and list them in `generate_handler!` below.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default().plugin(tauri_plugin_process::init());

    // The updater plugin is desktop-only; gate it so mobile targets still build.
    #[cfg(desktop)]
    let builder = builder.plugin(tauri_plugin_updater::Builder::new().build());

    builder
        // `greet` is an example command — replace with your own.
        .invoke_handler(tauri::generate_handler![commands::greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
