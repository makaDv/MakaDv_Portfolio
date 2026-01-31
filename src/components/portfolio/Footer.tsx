import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/i18n";

const socialLinks = [
  { icon: Github, href: "https://github.com/makaDv", label: "GitHub" },
  //{ icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  //{ icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Mail, href: "https://mail.google.com/mail/?view=cm&fs=1&to=dvdavide07@gmail.com", label: "Email" },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useI18n();

  return (
    <footer className="py-12 border-t border-border/50 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <p className="text-xl font-bold gradient-text mb-2">{t('nav.brand', 'Portfolio')}</p>
            <p className="text-sm text-muted-foreground">
              © {currentYear} {t('footer.rights', 'All rights reserved.')}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>

          {/* Credits */}
          <p className="text-sm text-muted-foreground text-center md:text-right">
            {t('footer.designedBy', 'Designed & Built by')} MakaDv
          </p>
        </div>
      </div>
    </footer>
  );
};
