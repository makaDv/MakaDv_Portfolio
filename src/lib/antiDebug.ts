// antiDebug.ts
// Adds handlers that call `debugger` when devtools shortcuts or right-click are used.
// You (the developer) can control whether the debugger pause is triggered by
// editing the `STOP_ON_DEBUGGER` flag below in this file.

import { STOP_ON_DEBUGGER, ENABLE_ANTI_DEBUG } from "@/config/security";

function isDevtoolsShortcut(e: KeyboardEvent) {
  if (e.key === "F12" || e.keyCode === 123) return true;
  const combo = (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C");
  return !!combo;
}

function shouldPause(): boolean {
  // Runtime override: if you set `window.__ANTIDEBUG_STOP` in the console
  // or another script, it will take precedence. Otherwise use the file flag.
  try {
    const w = window as any;
    if (typeof w.__ANTIDEBUG_STOP !== "undefined") return !!w.__ANTIDEBUG_STOP;
    // The security config may also expose a runtime flag
    if (typeof w.__ALLOW_ANTIDEBUG !== "undefined") return !!w.__ALLOW_ANTIDEBUG;
  } catch (e) {
    // ignore
  }
  return STOP_ON_DEBUGGER;
}

export default function initAntiDebug() {
  // If anti-debugging is disabled in config, do nothing.
  try {
    if (!ENABLE_ANTI_DEBUG) return;
  } catch (e) {
    // ignore and continue
  }
  try {
    // Call debugger on F12 / devtools shortcuts
    window.addEventListener("keydown", (e) => {
      if (isDevtoolsShortcut(e)) {
        e.preventDefault();
        if (!shouldPause()) return;
        try {
          // eslint-disable-next-line no-debugger
          debugger;
        } catch (err) {
          // ignore
        }
      }
    });

    // Block context menu and pause execution if configured
    window.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      if (!shouldPause()) return;
      try {
        // eslint-disable-next-line no-debugger
        debugger;
      } catch (err) {
        // ignore
      }
    });
  } catch (err) {
    // fail silently
  }
}