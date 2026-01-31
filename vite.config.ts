import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import * as https from "node:https";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "development" && {
      name: "dev-send-email-endpoint",
      configureServer(server) {
        server.middlewares.use("/api/send-email", async (req, res, next) => {
          if (req.method !== "POST") return next();
          let body = "";
          req.on("data", (chunk) => (body += chunk));
          await new Promise((resolve) => req.on("end", resolve));
          try {
            const doPost = async (urlStr: string, headers: Record<string, string>, bodyStr: string) => {
              const u = new URL(urlStr);
              return await new Promise<{ status: number; text: string }>((resolve, reject) => {
                const req = https.request(
                  {
                    hostname: u.hostname,
                    path: u.pathname + (u.search || ""),
                    method: "POST",
                    headers,
                  },
                  (resp) => {
                    let data = "";
                    resp.on("data", (chunk) => (data += chunk));
                    resp.on("end", () => resolve({ status: resp.statusCode || 0, text: data }));
                  }
                );
                req.on("error", reject);
                req.write(bodyStr);
                req.end();
              });
            };
            const parsed = JSON.parse(body || "{}");
            const name = parsed?.name;
            const email = parsed?.email;
            const message = parsed?.message;
            if (!name || !email || !message) {
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Missing required fields" }));
              return;
            }
            const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
            const SENDGRID_FROM = process.env.SENDGRID_FROM || "no-reply@example.com";
            const SENDGRID_TO = process.env.SENDGRID_TO || "dvdavide07@gmail.com";
            if (!SENDGRID_API_KEY) {
              res.setHeader("Content-Type", "application/json");
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "SendGrid API key not configured" }));
              return;
            }
            const payload = {
              personalizations: [
                {
                  to: [{ email: SENDGRID_TO }],
                  subject: `New message from ${name}`,
                },
              ],
              from: { email: SENDGRID_FROM },
              reply_to: { email },
              content: [
                {
                  type: "text/plain",
                  value: `Name: ${name}\nEmail: ${email}\n\n${message}`,
                },
              ],
            };
            const fetchFn = typeof globalThis.fetch === "function" ? globalThis.fetch : null;
            let status = 0;
            let text = "";
            if (fetchFn) {
              const r = await fetchFn("https://api.sendgrid.com/v3/mail/send", {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${SENDGRID_API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              });
              status = r.status;
              text = await r.text();
            } else {
              const resPost = await doPost(
                "https://api.sendgrid.com/v3/mail/send",
                {
                  Authorization: `Bearer ${SENDGRID_API_KEY}`,
                  "Content-Type": "application/json",
                },
                JSON.stringify(payload)
              );
              status = resPost.status;
              text = resPost.text;
            }
            if (status < 200 || status >= 300) {
              res.setHeader("Content-Type", "application/json");
              res.statusCode = status;
              res.end(text || JSON.stringify({ error: "SendGrid error" }));
              return;
            }
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify({ ok: true }));
          } catch (_err) {
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Internal server error" }));
          }
        });
      },
    },
  ].filter(Boolean),
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
}));
