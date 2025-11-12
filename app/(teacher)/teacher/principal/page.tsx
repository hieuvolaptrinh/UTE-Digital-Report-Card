"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function PrincipalDashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (
      !isLoading &&
      (!user || !isTeacher(user) || user.role !== "principal")
    ) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !isTeacher(user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user.role !== "principal") {
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
            <GlassCard padding="lg">
              <p className="text-center text-muted-foreground">
                Bạn không có quyền truy cập trang này
              </p>
            </GlassCard>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const statsData = [
    {
      title: "Tổng số giáo viên",
      value: "45",
      change: "+2",
      icon: Users,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      trend: "up",
    },
    {
      title: "Tổng số học sinh",
      value: "1,234",
      change: "+18",
      icon: BookOpen,
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
      trend: "up",
    },
    {
      title: "Điểm trung bình",
      value: "8.2",
      change: "+0.3",
      icon: Award,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      trend: "up",
    },
    {
      title: "Tỷ lệ đạt",
      value: "94.5%",
      change: "+1.2%",
      icon: TrendingUp,
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      trend: "up",
    },
  ];

  const pendingRequests = [
    {
      type: "Yêu cầu sửa điểm",
      count: 5,
      icon: AlertCircle,
      color: "text-red-500",
      href: "/teacher/principal/list-sua-diem",
    },
    {
      type: "Đơn xin nghỉ",
      count: 8,
      icon: Clock,
      color: "text-yellow-500",
      href: "/teacher/principal/leave-requests",
    },
    {
      type: "Yêu cầu đã duyệt",
      count: 24,
      icon: CheckCircle,
      color: "text-green-500",
      href: "/teacher/principal/approved",
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-lg bg-primary/10">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Báo cáo thống kê</h1>
                <p className="text-muted-foreground">
                  Tổng quan hoạt động nhà trường
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <GlassCard hover padding="lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-500 font-medium">
                          {stat.change}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          so với tháng trước
                        </span>
                      </div>
                    </div>
                    <div className={cn("p-3 rounded-lg", stat.color)}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Pending Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Yêu cầu chờ xử lý</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pendingRequests.map((request) => (
                <GlassCard
                  key={request.type}
                  hover
                  padding="lg"
                  className="cursor-pointer"
                  onClick={() => router.push(request.href)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <request.icon className={cn("h-8 w-8", request.color)} />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {request.type}
                        </p>
                        <h3 className="text-2xl font-bold">{request.count}</h3>
                      </div>
                    </div>
                    <Badge
                      variant={request.count > 0 ? "destructive" : "secondary"}
                    >
                      {request.count > 0 ? "Cần xử lý" : "Đã xử lý"}
                    </Badge>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Hoạt động gần đây</h2>
            <GlassCard padding="lg">
              <div className="space-y-4">
                {[
                  {
                    action: "GV. Nguyễn Văn A đã gửi yêu cầu sửa điểm",
                    time: "5 phút trước",
                    status: "pending",
                  },
                  {
                    action: "GV. Trần Thị B đã gửi thông báo cho lớp 10A1",
                    time: "30 phút trước",
                    status: "completed",
                  },
                  {
                    action: "Đã duyệt yêu cầu sửa điểm cho lớp 11A2",
                    time: "1 giờ trước",
                    status: "completed",
                  },
                  {
                    action: "GV. Lê Văn C đã cập nhật điểm học kỳ 1",
                    time: "2 giờ trước",
                    status: "completed",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between py-3 border-b border-border/40 last:border-0"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full mt-2",
                          activity.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        )}
                      />
                      <div>
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        activity.status === "pending" ? "outline" : "secondary"
                      }
                    >
                      {activity.status === "pending"
                        ? "Chờ xử lý"
                        : "Hoàn thành"}
                    </Badge>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
