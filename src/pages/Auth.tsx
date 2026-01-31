import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useI18n } from "@/i18n/i18n";

// Schemas are built inside the component so translation strings can be used

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useI18n();

  const loginSchema = z.object({
    email: z.string().trim().email(t('auth.errors.invalidEmail', 'Invalid email address')),
    password: z.string().min(6, t('auth.errors.passwordMin', 'Password must be at least 6 characters')),
  });

  const signupSchema = z.object({
    name: z.string().trim().min(1, t('auth.errors.nameRequired', 'Name is required')).max(100, t('auth.errors.nameMax', 'Name must be less than 100 characters')),
    email: z.string().trim().email(t('auth.errors.invalidEmail', 'Invalid email address')),
    password: z.string().min(6, t('auth.errors.passwordMin', 'Password must be at least 6 characters')).max(72, t('auth.errors.passwordMax', 'Password must be less than 72 characters')),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth.errors.passwordsNotMatch', "Passwords don't match"),
    path: ["confirmPassword"],
  });

  useEffect(() => {
    // Authentication removed. Redirects are no-ops.
    // If you re-enable auth later, restore supabase.auth listeners here.
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      if (isLogin) {
        const result = loginSchema.safeParse(formData);
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

        // Authentication is disabled. Simulate success for legacy pages.
        toast({
          title: "Auth disabled",
          description: "Authentication has been removed from this app.",
          variant: "destructive",
        });
      } else {
        const result = signupSchema.safeParse(formData);
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

        // Signup removed.
        toast({
          title: "Signup disabled",
          description: "Account creation has been removed from this app.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 bg-hero-glow" />
      <div className="absolute inset-0 dot-pattern opacity-20" />
      
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card variant="glass" className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
              <motion.a
                href="/"
                className="text-2xl font-bold gradient-text inline-block mb-4"
                whileHover={{ scale: 1.05 }}
              >
                {t('nav.brand', 'Portfolio')}
              </motion.a>
              <h1 className="text-2xl font-bold mb-2">
                {isLogin ? t('auth.welcome', 'Welcome back') : t('auth.createAccount', 'Create account')}
              </h1>
              <p className="text-muted-foreground text-sm">
                {isLogin
                  ? t('auth.enterCredentials', 'Enter your credentials to access your account')
                  : t('auth.fillDetails', 'Fill in the details to get started')}
              </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    name="name"
                    placeholder={t('auth.placeholder.name', 'Full name')}
                    value={formData.name}
                    onChange={handleChange}
                    className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-destructive">{errors.name}</p>
                )}
              </div>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  name="email"
                  type="email"
                  placeholder={t('auth.placeholder.email', 'Email address')}
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('auth.placeholder.password', 'Password')}
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder={t('auth.placeholder.confirmPassword', 'Confirm password')}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                t('loading', 'Loading...')
              ) : (
                <>
                  {isLogin ? t('auth.button.signIn', 'Sign in') : t('auth.button.createAccount', 'Create account')}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
              {isLogin ? t('auth.toggles.dontHaveAccount', "Don't have an account?") : t('auth.toggles.alreadyHaveAccount', 'Already have an account?')} {" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setFormData({ name: "", email: "", password: "", confirmPassword: "" });
                }}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? t('auth.button.signUp', 'Sign up') : t('auth.button.signIn', 'Sign in')}
              </button>
            </p>
          </div>

          {/* Back to home */}
          <div className="mt-4 text-center">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {t('backToPortfolio', '← Back to portfolio')}
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
