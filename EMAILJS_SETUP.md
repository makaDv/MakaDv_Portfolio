# EmailJS setup (quick guide)

This small guide explains how to configure EmailJS for the contact form in this project and how to test it locally.

Important: do NOT commit your `.env` file or any secret keys.

---

## 1) Create an EmailJS account

1. Go to https://www.emailjs.com/ and sign up.
2. Add an email service (for example Gmail via OAuth or another SMTP provider) and note the `service_id` shown in the dashboard.
3. Create a new email template and note the `template_id`.
4. Grab your `user_id` (public key) from the EmailJS dashboard (Settings / Integration). In Vite we expose it as `VITE_EMAILJS_USER_ID` (public keys are OK to use client-side).

## 2) Template variables

The form sends the following template parameters:

- `name` — sender's name
- `email` — sender's email (reply-to)
- `message` — the message body
- `to_email` — destination address (we set this to `dvdavide07@gmail.com` by default via translations)
- `subject` — subject line

When creating the template in EmailJS, use variables like `{{name}}`, `{{email}}`, `{{message}}`, `{{to_email}}`, `{{subject}}` where appropriate. Example template subject and body:

Subject:
```
New message from {{name}} — {{subject}}
```

HTML body (simple):
```html
<p>You received a new message from {{name}} ({{email}})</p>
<p><strong>Message:</strong></p>
<p>{{message}}</p>
```

If your EmailJS plan or template does not allow dynamic recipient override by `to_email`, you can set the recipient address directly inside the template (hard-code `dvdavide07@gmail.com`) in the EmailJS template receiver settings.

## 3) Add environment variables

Create a `.env` file in the project root (DO NOT commit it):

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_USER_ID=your_user_id_or_public_key
```

Note: I have pre-populated your project `.env` with the `service_id` you provided (`service_jp5q1tp`). You still need to replace `VITE_EMAILJS_TEMPLATE_ID` and `VITE_EMAILJS_USER_ID` with the values from your EmailJS dashboard, then restart the dev server.

Restart the dev server after editing `.env`.

## 4) Local testing

Start the dev server:

```powershell
npm install
npm run dev
```

Open the app and submit the contact form. If the request fails, check the browser DevTools `Network` tab for a POST to:

```
https://api.emailjs.com/api/v1.0/email/send
```

Look at the response body and status. In development mode (Vite `import.meta.env.DEV`) the app will show the response body in a destructive toast to help debugging.

You can also reproduce the request with `curl` (PowerShell example):

```powershell
curl -X POST https://api.emailjs.com/api/v1.0/email/send `
  -H "Content-Type: application/json" `
  -d '{
    "service_id":"YOUR_SERVICE_ID",
    "template_id":"YOUR_TEMPLATE_ID",
    "user_id":"YOUR_USER_ID",
    "template_params": {
      "to_email":"dvdavide07@gmail.com",
      "name":"Test",
      "email":"test@example.com",
      "message":"Hello from curl",
      "subject":"Test message"
    }
  }'
```

## 5) Common errors

- 401 / 403: wrong `user_id` or service not configured. Check your keys.
- 400 with "template param missing": ensure your template defines the variables referenced in `template_params` and that required template fields are present.
- CORS: EmailJS should be reachable from the browser; if you see CORS errors, try using a server-side endpoint or check EmailJS docs.

## 6) Alternatives

If you prefer not to use EmailJS (client-side), you can:

- Add a serverless function (Vercel/Lambda) that calls an SMTP provider (SendGrid, Mailgun) and hide credentials server-side.
- Use a form backend service like Formspree, which can accept direct POSTs and forward to email.

---

If you want, I can also provide a ready-to-import EmailJS template JSON (if needed) or a sample serverless function to call SendGrid instead.
