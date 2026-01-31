import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Palette, Rocket, Zap } from "lucide-react";
import { useI18n } from "@/i18n/i18n";

// Highlights are built inside the component so they can use translations

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useI18n();
  const highlights = [
    {
      icon: Code2,
      title: t('about.highlights.cleanCode.title', 'Clean Code'),
      description: t('about.highlights.cleanCode.description', 'Writing maintainable, scalable code with best practices'),
    },
    {
      icon: Palette,
      title: t('about.highlights.uiux.title', 'UI/UX Design'),
      description: t('about.highlights.uiux.description', 'Creating intuitive and visually stunning interfaces'),
    },
    {
      icon: Rocket,
      title: t('about.highlights.performance.title', 'Performance'),
      description: t('about.highlights.performance.description', 'Optimizing for speed and exceptional user experience'),
    },
    {
      icon: Zap,
      title: t('about.highlights.innovation.title', 'Innovation'),
      description: t('about.highlights.innovation.description', 'Embracing cutting-edge technologies and trends'),
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-section-glow opacity-50" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {t('about.title', 'About')} <span className="gradient-text">{t('about.title', 'Me')}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('about.p1', "I'm a full-stack developer with over 5 years of experience in building modern web applications. My journey started with a curiosity for how things work on the internet, and it has evolved into a passion for creating digital experiences that make a difference.")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about.p1', "I'm a full-stack developer with over 5 years of experience in building modern web applications. My journey started with a curiosity for how things work on the internet, and it has evolved into a passion for creating digital experiences that make a difference.")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about.p2', "I specialize in React, TypeScript, and Node.js, but I'm always eager to learn new technologies. I believe in writing clean, efficient code and creating user interfaces that are both beautiful and functional.")}
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about.p3', "When I'm not coding, you can find me exploring new design trends, contributing to open-source projects, or enjoying a good cup of coffee while reading about the latest tech innovations.")}
            </p>
          </motion.div>

          {/* Highlights Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
