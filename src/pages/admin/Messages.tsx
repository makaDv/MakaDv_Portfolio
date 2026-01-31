import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Trash2, Eye, Clock } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/i18n/i18n";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean | null;
  created_at: string;
}

const AdminMessages = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
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

  // DB disabled: return empty message list
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["adminMessages"],
    queryFn: async () => {
      return [] as Contact[];
    },
    enabled: isAdmin,
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      console.warn('Mark read called but DB disabled', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMessages"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
      queryClient.invalidateQueries({ queryKey: ["messagesCount"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      console.warn('Delete message called but DB disabled', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminMessages"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
      queryClient.invalidateQueries({ queryKey: ["messagesCount"] });
      toast({ title: "Message deleted (local)" });
    },
    onError: () => {
      toast({ title: "Failed to delete message", variant: "destructive" });
    },
  });

  if (isLoading || messagesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">{t('loading', 'Loading...')}</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <AdminLayout currentPage="messages">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('admin.messages.title', 'Messages')}</h1>
          <p className="text-muted-foreground">{t('admin.messages.subtitle', 'Contact form submissions from visitors')}</p>
        </div>

        {messages.length === 0 ? (
          <Card variant="glass" className="p-12 text-center">
            <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{t('admin.messages.noMessages', 'No messages yet')}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  variant={message.read ? "glass" : "glow"}
                  className={`p-6 ${!message.read ? "border-primary/40" : ""}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-lg">{message.name}</h3>
                        {!message.read && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary border border-primary/30">
                            New
                          </span>
                        )}
                      </div>
                      <a
                        href={`mailto:${message.email}`}
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <Mail className="w-4 h-4" />
                        {message.email}
                      </a>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {message.message}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {format(new Date(message.created_at), "PPp")}
                      </div>
                    </div>
                    <div className="flex gap-2 lg:flex-col">
                      {!message.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markReadMutation.mutate(message.id)}
                        >
                          <Eye className="w-4 h-4" />
                          {t('admin.messages.markRead', 'Mark Read')}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                          onClick={() => {
                          if (confirm(t('admin.messages.confirmDelete', 'Delete this message?'))) {
                            deleteMutation.mutate(message.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
