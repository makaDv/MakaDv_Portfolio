# SendGrid / Serverless setup (project fallback)

This guide explains how to configure the provided serverless fallback (`/api/send-email`) that uses SendGrid to deliver messages when EmailJS fails.

Files added to the repo:
- `api/send-email.js` — simple Vercel/Netlify-style serverless handler that sends email via SendGrid.
- `.env` (already contains placeholders): `SENDGRID_API_KEY`, `SENDGRID_FROM`, `SENDGRID_TO`.

Important: DO NOT commit real API keys. Use environment variables in your deployment platform.

## 1) Create a SendGrid account and API key

1. Sign up / login at https://sendgrid.com/.
2. In the dashboard, go to Settings > API Keys > Create API Key.
3. Choose "Full Access" or give the minimum scopes for Mail Send.
4. Copy the generated API key — you'll use it as `SENDGRID_API_KEY`.

## 2) Configure environment variables

Locally: add to your `.env` (already has placeholders)

```
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY
SENDGRID_FROM=no-reply@yourdomain.com
SENDGRID_TO=dvdavide07@gmail.com
```

On Vercel:
- Go to your project > Settings > Environment Variables.
- Add the variables above for the appropriate environment (Preview/Production).

## 3) Deploying the serverless function

- For Vercel: the `api/send-email.js` file will be deployed automatically as an API route at `https://<your-vercel-app>/api/send-email`.
- For Netlify: use Netlify Functions or adapt the handler (Netlify needs a different export style). The provided function works out-of-the-box on Vercel.

## 4) Testing the function locally

If you use Vercel CLI (recommended) you can run functions locally:

```powershell
npm i -g vercel
vercel dev
```

Or test the endpoint via `curl` (PowerShell example):

```powershell
curl -X POST http://localhost:3000/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello from local"}'
```

Note: When using `vercel dev`, the URL and port may differ — check the CLI output.

## 5) How Contact.tsx uses the fallback

- The contact form will first attempt EmailJS endpoints (`/api/v1.0/email/send`, fallback `/api/v1.0/email/send-form`).
- If both fail it will POST to `/api/send-email` (relative URL, so it works on the same domain when deployed).
- The serverless function will attempt to send via SendGrid and return 200 on success.

## 6) Troubleshooting

- SendGrid 401/403: verify `SENDGRID_API_KEY` is correct and has Mail Send scope.
- 400 errors: inspect the response body (the serverless function logs it and returns it in the response) — missing fields, invalid email format.
- Deployment errors on Vercel: check Vercel function logs in the dashboard.

## 7) Security note

- Using a serverless function hides your SendGrid API key from the client and is more secure than doing everything client-side.
- Keep `.env` out of source control. Use platform environment settings for production.

---

If you want, I can:
- Provide a production-ready HTML email template and richer personalizations.
- Adapt the function to work on Netlify or AWS Lambda.
- Add simple rate-limiting or CAPTCHA hooks to the serverless function to reduce abuse.
