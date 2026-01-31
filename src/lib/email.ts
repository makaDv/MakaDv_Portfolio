import emailjs from "@emailjs/browser";

const getEnv = (k: string) => (import.meta.env as unknown as Record<string, string | undefined>)[k];

let isInitialized = false;

export const initEmailJS = () => {
  if (isInitialized) return;
  const publicKey = getEnv("VITE_EMAILJS_PUBLIC_KEY") || getEnv("VITE_EMAILJS_USER_ID");
  if (!publicKey) {
    throw new Error("Configurazione EmailJS mancante: VITE_EMAILJS_PUBLIC_KEY (o VITE_EMAILJS_USER_ID)");
  }
  emailjs.init(publicKey);
  isInitialized = true;
};

type SendArgs = {
  name: string;
  email: string;
  message: string;
  subject?: string;
  toEmail?: string;
};

export const sendPortfolioEmail = async (args: SendArgs) => {
  const serviceId = getEnv("VITE_EMAILJS_SERVICE_ID");
  const templateId = getEnv("VITE_EMAILJS_TEMPLATE_ID");
  const toEmail = args.toEmail || getEnv("VITE_EMAILJS_TO_EMAIL");
  if (!serviceId || !templateId) {
    const missing = [
      !serviceId ? "VITE_EMAILJS_SERVICE_ID" : null,
      !templateId ? "VITE_EMAILJS_TEMPLATE_ID" : null,
    ].filter(Boolean).join(", ");
    throw new Error(`Configurazione EmailJS mancante: ${missing}`);
  }
  const params: Record<string, string> = {
    name: args.name,
    email: args.email,
    from_name: args.name,
    reply_to: args.email,
    message: args.message,
    subject: args.subject || `New message from ${args.name}`,
  };
  if (toEmail) params.to_email = toEmail;
  initEmailJS();
  return emailjs.send(serviceId, templateId, params);
};
