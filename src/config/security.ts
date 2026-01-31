// security.ts
// Centralized toggles for runtime protections (anti-debug and obfuscation).
// Edit these values to enable/disable behavior. You can also override at runtime
// from the browser console by setting the corresponding window.<...> variables.

/** Enable anti-debug handlers (F12 / context menu). */
export const ENABLE_ANTI_DEBUG = false; // default: disabled to allow inspection

/**
 * When anti-debug is enabled, STOP_ON_DEBUGGER controls whether a `debugger`
 * statement is triggered when devtools shortcuts are used. You can override
 * at runtime by setting `window.__ANTIDEBUG_STOP = false` in the console.
 */
export const STOP_ON_DEBUGGER = false; // default: disabled to allow inspection

/** Enable obfuscation of script tags after initial load. */
export const ENABLE_OBFUSCATE = false; // disabled by default during development

/**
 * Runtime overrides available in the console:
 * - window.__ANTIDEBUG_STOP === boolean -> controls whether anti-debug pauses
 * - window.__ALLOW_OBFUSCATE === boolean -> controls whether obfuscation runs
 */

// Attach defaults to window for quick runtime toggles (optional)
try {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__ANTIDEBUG_STOP = typeof (window as any).__ANTIDEBUG_STOP !== 'undefined' ? (window as any).__ANTIDEBUG_STOP : STOP_ON_DEBUGGER;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__ALLOW_OBFUSCATE = typeof (window as any).__ALLOW_OBFUSCATE !== 'undefined' ? (window as any).__ALLOW_OBFUSCATE : ENABLE_OBFUSCATE;
} catch (e) {
  // ignore in restricted environments
}
