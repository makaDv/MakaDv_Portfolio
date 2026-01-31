import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, InfinityIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/i18n/i18n";

interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link: string | null;
  technologies: string[] | null;
}

// Fallback projects for when database is empty
const fallbackProjects: Project[] = [
  /*        --AGGIUNGERE LAVORI SUCCESSIVAMENTE--
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "A modern e-commerce platform built with React and Node.js, featuring real-time inventory management and secure payment processing.",
    image_url: null,
    link: "https://example.com",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
  },
  {
    id: "2",
    title: "AI Dashboard",
    description: "An intelligent analytics dashboard that uses machine learning to provide insights and predictions for business metrics.",
    image_url: null,
    link: "https://example.com",
    technologies: ["TypeScript", "Python", "TensorFlow", "D3.js"],
  },
  {
    id: "3",
    title: "Mobile Banking App",
    description: "A secure and intuitive mobile banking application with biometric authentication and real-time transaction tracking.",
    image_url: null,
    link: "https://example.com",
    technologies: ["React Native", "Node.js", "MongoDB", "AWS"],
  },*/
];

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useI18n();

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      // Supabase integration is disabled in this build. Return fallback data.
      return fallbackProjects;
    },
  });

  const displayProjects = projects.length > 0 ? projects : fallbackProjects;

  return (
    <section id="projects" className="py-20 lg:py-32 relative">
      <div className="absolute inset-0 bg-section-glow opacity-30" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            {t('projects.featured', 'Featured')} <span className="gradient-text">{t('projects.title', 'Projects')}</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('projects.subtitle', 'A selection of my recent work showcasing creativity and technical expertise')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayProjects.length === 0 ? (
            <div className="col-span-full">
              <motion.div
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "loop", ease: "easeIn"}}
                className="flex items-center justify-center"
              >
                <Card variant="glass" className="p-12 text-center mx-auto max-w-2xl">
                  <h3 className="text-2xl sm:text-3xl font-semibold mb-2 gradient-text">{t('projects.empty.title', 'Ancora nessun progetto realizzato')}</h3>
                  <p className="text-muted-foreground">{t('projects.empty.description', 'Sto preparando nuovi lavori — torna a trovarmi presto!')}</p>
                </Card>
              </motion.div>
            </div>
          ) : (
            displayProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  variant="glow"
                  className="h-full overflow-hidden group cursor-pointer"
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className="text-4xl font-bold gradient-text">
                          {project.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      {project.link && (
                        <Button
                          variant="neon"
                          size="icon"
                          asChild
                        >
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="neon-violet"
                        size="icon"
                        asChild
                      >
                        <a href="https://github.com/makaDv" target="_blank" rel="noopener noreferrer">
                          <Github className="w-5 h-5" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary border border-primary/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
