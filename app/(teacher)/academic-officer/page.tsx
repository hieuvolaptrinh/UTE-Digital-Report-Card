"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCard } from "@/components/shared/stat-card";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  BookOpen,
  GraduationCap,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default function AcademicOfficerDashboard() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "Tổng số lớp",
      value: 18,
      trend: { value: 2, isPositive: true },
      icon: Users,
      color: "blue" as const,
    },
    {
      title: "Tổng số học sinh",
      value: 567,
      trend: { value: 12, isPositive: true },
      icon: GraduationCap,
      color: "green" as const,
    },
    {
      title: "Yêu cầu sửa điểm",
      value: 8,
      trend: { value: 3, isPositive: false },
      icon: FileText,
      color: "orange" as const,
    },
    {
      title: "Yêu cầu học bạ",
      value: 15,
      trend: { value: 5, isPositive: false },
      icon: BookOpen,
      color: "purple" as const,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: "Yêu cầu sửa điểm từ GV Phạm Văn D",
      description: "Học sinh Nguyễn Văn A - Môn Toán",
      time: "10 phút trước",
      type: "grade-edit",
      icon: FileText,
    },
    {
      id: 2,
      title: "Yêu cầu học bạ mới",
      description: "Trần Thị B - Lớp 10A1",
      time: "30 phút trước",
      type: "transcript",
      icon: BookOpen,
    },
    {
      id: 3,
      title: "Đã duyệt yêu cầu sửa điểm",
      description: "Lê Văn C - Môn Văn",
      time: "1 giờ trước",
      type: "approved",
      icon: CheckCircle,
    },
    {
      id: 4,
      title: "Cập nhật thời gian nhập điểm",
      description: "Học kỳ 1 - Khối 10",
      time: "2 giờ trước",
      type: "update",
      icon: Clock,
    },
  ];

  const quickActions = [
    {
      title: "Duyệt yêu cầu sửa điểm",
      description: "Xem và phê duyệt các yêu cầu",
      href: "/academic-officer/list-duyet-sua-diem",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Quản lý lớp học",
      description: "Xem danh sách và quản lý lớp",
      href: "/academic-officer/list-lop",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Yêu cầu học bạ",
      description: "Xử lý yêu cầu in học bạ",
      href: "/academic-officer/list-yc-hoc-ba",
      icon: BookOpen,
      color: "bg-purple-500",
    },
    {
      title: "Gửi thông báo",
      description: "Thông báo toàn trường",
      href: "/academic-officer/thong-bao",
      icon: AlertCircle,
      color: "bg-orange-500",
    },
  ];

  return (
    <>
      <Header
        user={{
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role as "teacher" | "academic-officer" | "principal",
        }}
        onLogout={logout}
      />
      <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold bg-linear-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Tổng quan Cán bộ Học vụ
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý học vụ và hồ sơ học sinh
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StatCard {...stat} />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <GlassCard padding="lg">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Thao tác nhanh
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.a
                      key={action.title}
                      href={action.href}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="group relative overflow-hidden rounded-xl border border-border/50 bg-linear-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-900/30 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`${action.color} p-3 rounded-lg text-white`}
                        >
                          <action.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard padding="lg">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Hoạt động gần đây
                </h2>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <activity.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
