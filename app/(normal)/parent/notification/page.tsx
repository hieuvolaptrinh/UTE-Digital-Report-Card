"use client";

import { useAuth, isParent } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { NotificationsList } from "@/components/section/parent/notifications-list";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockNotifications, Notification } from "@/mork-data";
import { Bell, Filter } from "lucide-react";

export default function ParentNotificationPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "important">("all");

  useEffect(() => {
    if (!isLoading && (!user || !isParent(user))) {
      router.push("/login");
    }

    if (user && isParent(user)) {
      const childClasses = user.children.map((c) => c.class);
      let parentNotifications = mockNotifications.filter(
        (n) =>
          n.recipientType === "all" ||
          (n.recipientType === "class" &&
            n.recipientIds?.some((id) => childClasses.includes(id)))
      );

      // Apply filter
      if (filter === "unread") {
        parentNotifications = parentNotifications.filter((n) => !n.isRead);
      } else if (filter === "important") {
        parentNotifications = parentNotifications.filter((n) => n.isImportant);
      }

      setNotifications(parentNotifications);
    }
  }, [user, isLoading, router, filter]);

  if (isLoading || !user || !isParent(user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const headerUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role as "parent",
  };

  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;
  const importantCount = mockNotifications.filter((n) => n.isImportant).length;

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold">Thông báo</h1>
                <p className="text-muted-foreground mt-1">
                  Thông báo từ nhà trường và giáo viên
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats & Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <GlassCard padding="md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Chưa đọc</p>
                    <p className="text-2xl font-bold">{unreadCount}</p>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div>
                    <p className="text-sm text-muted-foreground">Quan trọng</p>
                    <p className="text-2xl font-bold">{importantCount}</p>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng cộng</p>
                    <p className="text-2xl font-bold">{notifications.length}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <div className="flex gap-2">
                    <Button
                      variant={filter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("all")}
                    >
                      Tất cả
                    </Button>
                    <Button
                      variant={filter === "unread" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("unread")}
                    >
                      Chưa đọc
                      {unreadCount > 0 && (
                        <Badge className="ml-1 bg-primary-foreground text-primary">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                    <Button
                      variant={filter === "important" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilter("important")}
                    >
                      Quan trọng
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Notifications List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <NotificationsList notifications={notifications} />
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
