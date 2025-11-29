"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function PrincipalDashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [selectedGrade, setSelectedGrade] = useState("10");
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [selectedSemester, setSelectedSemester] = useState("1");

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

  // Data for academic performance charts
  const academicPerformanceData = [
    { name: "10A1", excellent: 12, good: 18, average: 8, weak: 2 },
    { name: "10A2", excellent: 10, good: 20, average: 7, weak: 3 },
    { name: "10A3", excellent: 15, good: 16, average: 6, weak: 3 },
    { name: "10A4", excellent: 8, good: 22, average: 8, weak: 2 },
    { name: "10A5", excellent: 14, good: 17, average: 7, weak: 2 },
  ];

  const gradeDistributionData = [
    { name: "Xuất sắc (9-10)", value: 59, color: "#ef4444" },
    { name: "Giỏi (8-8.9)", value: 93, color: "#f97316" },
    { name: "Khá (7-7.9)", value: 36, color: "#eab308" },
    { name: "Trung bình (5-6.9)", value: 12, color: "#3b82f6" },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-[6px] border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold">{payload[0].payload.name}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-xs">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = gradeDistributionData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);
      return (
        <div className="bg-background/95 backdrop-blur-[6px] border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold">{data.name}</p>
          <p className="text-xs text-muted-foreground">
            Số lượng: {data.value}
          </p>
          <p className="text-xs text-muted-foreground">
            Tỷ lệ: {percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

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

          {/* Academic Performance Report */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-4">Báo cáo kết quả học tập</h2>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Khối</label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">Khối 10</SelectItem>
                    <SelectItem value="11">Khối 11</SelectItem>
                    <SelectItem value="12">Khối 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Năm học</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2022-2023">2022-2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Học kỳ</label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Học kỳ 1</SelectItem>
                    <SelectItem value="2">Học kỳ 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <GlassCard padding="lg">
                <h3 className="text-lg font-semibold mb-4">
                  Kết quả học tập theo khối
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={academicPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                    <XAxis dataKey="name" stroke="currentColor" />
                    <YAxis stroke="currentColor" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="excellent" stackId="a" fill="#ef4444" name="Xuất sắc" />
                    <Bar dataKey="good" stackId="a" fill="#f97316" name="Giỏi" />
                    <Bar dataKey="average" stackId="a" fill="#eab308" name="Khá" />
                    <Bar dataKey="weak" stackId="a" fill="#3b82f6" name="Trung bình" />
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>

              {/* Pie Chart */}
              <GlassCard padding="lg">
                <h3 className="text-lg font-semibold mb-4">
                  Phân bố xếp loại học sinh
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gradeDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <GlassCard padding="lg">
                <p className="text-sm text-muted-foreground mb-1">Tổng học sinh</p>
                <p className="text-2xl font-bold">200</p>
                <p className="text-xs text-muted-foreground mt-2">Khối {selectedGrade}</p>
              </GlassCard>
              <GlassCard padding="lg">
                <p className="text-sm text-muted-foreground mb-1">Điểm trung bình</p>
                <p className="text-2xl font-bold">7.8</p>
                <p className="text-xs text-green-500 mt-2">↑ 0.2 so với kỳ trước</p>
              </GlassCard>
              <GlassCard padding="lg">
                <p className="text-sm text-muted-foreground mb-1">Tỷ lệ đạt</p>
                <p className="text-2xl font-bold">96.5%</p>
                <p className="text-xs text-green-500 mt-2">↑ 1.5% so với kỳ trước</p>
              </GlassCard>
              <GlassCard padding="lg">
                <p className="text-sm text-muted-foreground mb-1">Tỷ lệ xuất sắc</p>
                <p className="text-2xl font-bold">29.5%</p>
                <p className="text-xs text-green-500 mt-2">↑ 2.1% so với kỳ trước</p>
              </GlassCard>
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
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
