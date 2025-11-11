"use client";

import { useAuth, isParent } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCard } from "@/components/shared/stat-card";
import { ChildrenList } from "@/components/section/parent/children-list";
import { LeaveRequestForm } from "@/components/section/parent/leave-request-form";
import { NotificationsList } from "@/components/section/parent/notifications-list";
import { mockNotifications, Notification } from "@/mork-data";
import { Users, Bell, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ParentPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || !isParent(user))) {
      router.push("/login");
    }

    if (user && isParent(user)) {
      // Load notifications for parent's children's classes
      const childClasses = user.children.map((c) => c.class);
      const parentNotifications = mockNotifications.filter(
        (n) =>
          n.recipientType === "all" ||
          (n.recipientType === "class" &&
            n.recipientIds?.some((id) => childClasses.includes(id)))
      );
      setNotifications(parentNotifications.slice(0, 10));
    }
  }, [user, isLoading, router]);

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
    role: user.role as any,
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Xin chào, {user.name}!
                </h1>
                <p className="text-muted-foreground mt-1">
                  Theo dõi kết quả học tập của con em
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Số con em"
              value={user.children.length}
              icon={Users}
              description="Đang theo học"
              color="blue"
              delay={0}
            />
            <StatCard
              title="Thông báo mới"
              value={unreadNotifications}
              icon={Bell}
              description="Chưa đọc"
              color="orange"
              delay={0.1}
            />
            <StatCard
              title="Đơn xin nghỉ"
              value={0}
              icon={FileText}
              description="Đang chờ duyệt"
              color="purple"
              delay={0.2}
            />
            <StatCard
              title="Lịch họp PH"
              value={1}
              icon={Calendar}
              description="Tháng này"
              color="green"
              delay={0.3}
            />
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <GlassCard padding="md">
              <h3 className="text-lg font-semibold mb-4">Truy cập nhanh</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Link href="/parent/xin-vang-hoc">
                  <Button variant="outline" className="w-full gap-2 h-auto py-3">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">Xin nghỉ học</span>
                  </Button>
                </Link>
                <Link href="/parent/notification">
                  <Button variant="outline" className="w-full gap-2 h-auto py-3">
                    <Bell className="h-4 w-4" />
                    <span className="text-sm">Thông báo</span>
                  </Button>
                </Link>
                <Button variant="outline" className="w-full gap-2 h-auto py-3">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Lịch họp</span>
                </Button>
                <Button variant="outline" className="w-full gap-2 h-auto py-3">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Liên hệ GV</span>
                </Button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Children List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <ChildrenList parent={user} />
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <NotificationsList notifications={notifications} />
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
