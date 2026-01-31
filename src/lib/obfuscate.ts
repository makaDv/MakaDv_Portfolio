// obfuscate.ts
// After initial load, replace script tag contents with an unreadable placeholder
// to make the page scripts less directly readable from the DOM.

import { ENABLE_OBFUSCATE } from "@/config/security";

export default function initObfuscate() {
  try {
    // allow runtime override via window.__ALLOW_OBFUSCATE
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    const allow = typeof w.__ALLOW_OBFUSCATE !== 'undefined' ? !!w.__ALLOW_OBFUSCATE : ENABLE_OBFUSCATE;
    if (!allow) return;

    // Wait a short time to allow scripts to execute
    setTimeout(() => {
      try {
        const scripts = Array.from(document.getElementsByTagName("script"));
        scripts.forEach((s, idx) => {
          try {
            // Only mutate visible DOM script content to avoid breaking execution
            if (s.src) {
              // Replace external script with a placeholder and remove src
              s.removeAttribute("src");
              s.type = "text/plain";
              s.textContent = `/* script-${idx} obfuscated */`;
            } else {
              // Inline script: replace content
              s.type = "text/plain";
              s.textContent = "/* inline script obfuscated */";
            }
          } catch (e) {
            // ignore per-script errors
          }
        });
      } catch (e) {
        // ignore
      }
    }, 700);
  } catch (e) {
    // ignore
  }
}
