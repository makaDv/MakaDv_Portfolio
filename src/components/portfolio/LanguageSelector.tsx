import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../../i18n/i18n';

const LanguageSelector: React.FC = () => {
  const { lang, setLang, t } = useI18n();

  return (
    <div className="ml-4">
      <div className="relative inline-grid grid-cols-2 gap-1 bg-card/30 border border-border/30 rounded-full px-1 py-0.5 backdrop-blur-sm items-center" style={{ width: 120 }}>
        {/* animated indicator */}
        <motion.div
          layout
          initial={false}
          animate={{ left: lang === 'en' ? 0 : '50%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="absolute top-0 bottom-0 w-1/2 rounded-full bg-primary/80"
          style={{ zIndex: 0 }}
        />

        <button
          type="button"
          aria-pressed={lang === 'en'}
          onClick={() => setLang('en')}
          className={`relative z-10 flex items-center justify-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-150 focus:outline-none ${
            lang === 'en' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <span className="uppercase">{t('language.en', 'English')}</span>
          <img src="/src/img/Flag_of_the_United_Kingdom_(3-5).svg.png" alt={t('language.en', 'English')} className="w-5 h-5 rounded-sm" />
        </button>

        <button
          type="button"
          aria-pressed={lang === 'it'}
          onClick={() => setLang('it')}
          className={`relative z-10 flex items-center justify-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-150 focus:outline-none ${
            lang === 'it' ? 'text-primary-foreground' : 'text-muted-foreground hover:text-primary'
          }`}
        >
          <span className="uppercase">{t('language.it', 'Italian')}</span>
          <img src="/src/img/Flag_of_Italy.svg.webp" alt={t('language.it', 'Italian')} className="w-5 h-5 rounded-sm" />
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
