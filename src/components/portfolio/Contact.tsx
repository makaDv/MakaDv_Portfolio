import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, MapPin, Send, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useI18n } from "@/i18n/i18n";
import { sendPortfolioEmail } from "@/lib/email";

export const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const { t } = useI18n();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "", // Honeypot field
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const contactSchema = z.object({
    name: z.string().trim().min(1, t('contact.errors.nameRequired', 'Name is required')).max(100, t('contact.errors.nameMax', 'Name must be less than 100 characters')),
    email: z.string().trim().email(t('contact.errors.invalidEmail', 'Invalid email address')).max(255, t('contact.errors.emailMax', 'Email must be less than 255 characters')),
    message: z.string().trim().min(1, t('contact.errors.messageRequired', 'Message is required')).max(2000, t('contact.errors.messageMax', 'Message must be less than 2000 characters')),
  });

  const contactInfo = [
    {
      icon: Mail,
      label: t('contact.info.emailLabel', 'Email'),
      value: t('contact.info.emailValue', 'dvdavide07@gmail.com'),
      href: `mailto:${t('contact.info.emailValue', 'dvdavide07@gmail.com')}`,
    },
    // NUMERO DI TELEFONO DISABILITATO PER PRIVACY
    /*{
      icon: Phone,
      label: t('contact.info.phoneLabel', 'Phone'),
      value: t('contact.info.phoneValue', '+1 (555) 123-4567'),
      href: `tel:${t('contact.info.phoneHref', '+15551234567')}`,
    },*/
    {
      icon: MapPin,
      label: t('contact.info.locationLabel', 'Location'),
      value: t('contact.info.locationValue', 'Campobasso, CB, Italy'),
      href: null,
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Rate limiting: prevent submissions within 30 seconds
    const now = Date.now();
    if (now - lastSubmitTime < 30000) {
      toast({
        title: t('contact.errorTitle', 'Error'),
        description: 'Please wait 30 seconds before sending another message.',
        variant: 'destructive',
      });
      return;
    }

    // Honeypot check: if website field is filled, it's likely a bot
    if (formData.website.trim()) {
      toast({
        title: t('contact.sentTitle', 'Message sent!'),
        description: t('contact.sentDesc', "Thank you for reaching out. I'll get back to you soon."),
      });
      setFormData({ name: '', email: '', message: '', website: '' });
      setLastSubmitTime(now);
      return;
    }

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await sendPortfolioEmail({
        name: result.data.name,
        email: result.data.email,
        message: result.data.message,
        subject: `New message from ${result.data.name}`,
      });
      toast({
        title: t('contact.sentTitle', 'Message sent!'),
        description: t('contact.sentDesc', "Thank you for reaching out. I'll get back to you soon."),
      });
      setFormData({ name: '', email: '', message: '', website: '' });
      setLastSubmitTime(now);
    } catch (err) {
      try {
        if (import.meta.env.DEV) {
          const fallbackRes = await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: result.data.name, email: result.data.email, message: result.data.message }),
          });
          if (fallbackRes.ok) {
            toast({
              title: t('contact.sentTitle', 'Message sent!'),
              description: t('contact.sentDesc', "Message sent using server fallback. I'll get back to you soon."),
            });
            setFormData({ name: '', email: '', message: '' });
          } else {
            toast({
              title: t('contact.errorTitle', 'Error'),
              description: t('contact.errorDesc', 'Something went wrong. Please try again.'),
              variant: 'destructive',
            });
          }
        } else {
          toast({
            title: t('contact.errorTitle', 'Error'),
            description: typeof err === 'object' && err && 'message' in (err as any)
              ? (err as any).message
              : 'Invio email non configurato in produzione. Controlla le variabili EmailJS.',
            variant: 'destructive',
          });
        }
      } catch {
        toast({
          title: t('contact.errorTitle', 'Error'),
          description: t('contact.errorDesc', 'Something went wrong. Please try again.'),
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-section-glow opacity-30" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="gradient-text">{t('contact.title', 'Get in touch')}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('contact.intro', "Have a project in mind or just want to chat? I'd love to hear from you.")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-4">{t('contact.connectTitle', "Let's connect")}</h3>
              <p className="text-muted-foreground">
                {t('contact.connectDesc', 'Feel free to reach out through any of these channels. I typically respond within 24 hours.')}
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex items-center gap-4 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 group"
                    >
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="text-foreground font-medium">{item.value}</p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-card/50 border border-border/50">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="text-foreground font-medium">{item.value}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card variant="glass" className="p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    {t('contact.form.name', 'Name')}
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('contact.form.namePlaceholder', 'Your name')}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    {t('contact.form.email', 'Email')}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('contact.form.emailPlaceholder', 'your@email.com')}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    {t('contact.form.message', 'Message')}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('contact.form.messagePlaceholder', 'Tell me about your project...')}
                    rows={5}
                    className={errors.message ? "border-destructive" : ""}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-destructive">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    t('contact.sending', 'Sending...')
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t('contact.form.send', 'Send Message')}
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
