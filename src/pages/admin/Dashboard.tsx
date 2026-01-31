import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FolderKanban, MessageSquare, Users, TrendingUp } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/i18n/i18n";

const AdminDashboard = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        navigate("/");
      }
    }
  }, [user, isAdmin, isLoading, navigate]);

  // DB disabled: return zero counts for dashboard stats
  const { data: projectsCount = 0 } = useQuery({
    queryKey: ["projectsCount"],
    queryFn: async () => 0,
    enabled: isAdmin,
  });

  const { data: messagesCount = 0 } = useQuery({
    queryKey: ["messagesCount"],
    queryFn: async () => 0,
    enabled: isAdmin,
  });

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unreadCount"],
    queryFn: async () => 0,
    enabled: isAdmin,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">{t('loading', 'Loading...')}</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const stats = [
    {
      title: t('admin.stats.totalProjects', 'Total Projects'),
      value: projectsCount,
      icon: FolderKanban,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: t('admin.stats.totalMessages', 'Total Messages'),
      value: messagesCount,
      icon: MessageSquare,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: t('admin.stats.unreadMessages', 'Unread Messages'),
      value: unreadCount,
      icon: TrendingUp,
      color: "text-neon-cyan",
      bgColor: "bg-neon-cyan/10",
    },
  ];

  return (
    <AdminLayout currentPage="dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('admin.dashboard.title', 'Dashboard')}</h1>
          <p className="text-muted-foreground">{t('admin.dashboard.welcome', "Welcome back! Here's an overview of your portfolio.")}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="glow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{t('admin.dashboard.quickActions', 'Quick Actions')}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card
              variant="glass"
              className="p-6 cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => navigate("/admin/projects")}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <FolderKanban className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{t('admin.manageProjects', 'Manage Projects')}</h3>
                  <p className="text-sm text-muted-foreground">{t('admin.projects.manageDesc', 'Add, edit, or remove portfolio projects')}</p>
                </div>
              </div>
            </Card>
            <Card
              variant="glass"
              className="p-6 cursor-pointer hover:border-primary/30 transition-colors"
              onClick={() => navigate("/admin/messages")}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <MessageSquare className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">{t('admin.viewMessages', 'View Messages')}</h3>
                  <p className="text-sm text-muted-foreground">{t('admin.messages.subtitle', 'Check contact form submissions')}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
