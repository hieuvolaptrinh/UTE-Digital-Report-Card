"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Users,
  ClipboardList,
  TrendingUp,
  Bell,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export default function TeacherPage() {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tổng quan</h1>
          <p className="text-muted-foreground mt-2">
            Chào mừng bạn đến với bảng điều khiển giáo viên
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Lớp chủ nhiệm",
              value: "10A1",
              icon: Users,
              color: "text-blue-500",
              bgColor: "bg-blue-500/10",
            },
            {
              label: "Số học sinh",
              value: "42",
              icon: Users,
              color: "text-green-500",
              bgColor: "bg-green-500/10",
            },
            {
              label: "Tiết dạy tuần này",
              value: "24",
              icon: Calendar,
              color: "text-purple-500",
              bgColor: "bg-purple-500/10",
            },
            {
              label: "Chưa nhập điểm",
              value: "3",
              icon: ClipboardList,
              color: "text-orange-500",
              bgColor: "bg-orange-500/10",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <Card className="border-border/40 hover:border-primary/20 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}
                    >
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Schedule Today */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="border-border/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Lịch dạy hôm nay
                      </CardTitle>
                      <CardDescription>
                        Thứ Hai, 11 Tháng 11, 2025
                      </CardDescription>
                    </div>
                    <Link href="/teacher/schedule">
                      <Button variant="outline" size="sm">
                        Xem tất cả
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      time: "07:00 - 08:00",
                      class: "10A1",
                      subject: "Toán",
                      room: "A201",
                    },
                    {
                      time: "08:15 - 09:15",
                      class: "11A2",
                      subject: "Toán",
                      room: "B105",
                    },
                    {
                      time: "09:30 - 10:30",
                      class: "10A1",
                      subject: "Toán",
                      room: "A201",
                    },
                  ].map((lesson, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="shrink-0 w-24 text-sm font-medium text-muted-foreground">
                        {lesson.time}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {lesson.subject}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Lớp {lesson.class} • Phòng {lesson.room}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        Sắp diễn ra
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Classes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Lớp học của tôi
                  </CardTitle>
                  <CardDescription>
                    Danh sách các lớp đang giảng dạy
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      name: "10A1",
                      students: 42,
                      subject: "Toán",
                      progress: 75,
                    },
                    {
                      name: "11A2",
                      students: 38,
                      subject: "Toán",
                      progress: 60,
                    },
                    {
                      name: "12A3",
                      students: 40,
                      subject: "Toán",
                      progress: 85,
                    },
                  ].map((classItem, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">
                            Lớp {classItem.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {classItem.students} học sinh • {classItem.subject}
                          </p>
                        </div>
                        <Link href={`/teacher/classes/${classItem.name}`}>
                          <Button size="sm" variant="outline">
                            Xem chi tiết
                          </Button>
                        </Link>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            Tiến độ giảng dạy
                          </span>
                          <span className="font-medium text-foreground">
                            {classItem.progress}%
                          </span>
                        </div>
                        <Progress value={classItem.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="text-base">Thao tác nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    {
                      label: "Nhập điểm",
                      icon: ClipboardList,
                      href: "/teacher/grades",
                      color: "text-blue-500",
                    },
                    {
                      label: "Nhập hạnh kiểm",
                      icon: CheckCircle,
                      href: "/teacher/conduct",
                      color: "text-green-500",
                    },
                    {
                      label: "Gửi thông báo",
                      icon: Bell,
                      href: "/teacher/notifications",
                      color: "text-purple-500",
                    },
                    {
                      label: "Xem thời khóa biểu",
                      icon: Calendar,
                      href: "/teacher/schedule",
                      color: "text-orange-500",
                    },
                  ].map((action, index) => (
                    <Link key={index} href={action.href}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 h-12"
                      >
                        <action.icon className={`h-5 w-5 ${action.color}`} />
                        <span>{action.label}</span>
                      </Button>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    Thông báo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    {
                      title: "Nhắc nhở nhập điểm",
                      desc: "Còn 3 lớp chưa nhập điểm giữa kỳ",
                      time: "2 giờ trước",
                      type: "warning",
                    },
                    {
                      title: "Họp phụ huynh",
                      desc: "Lớp 10A1 - 15:00 ngày mai",
                      time: "5 giờ trước",
                      type: "info",
                    },
                    {
                      title: "Hoàn thành báo cáo",
                      desc: "Báo cáo tháng 10 đã được duyệt",
                      time: "1 ngày trước",
                      type: "success",
                    },
                  ].map((notif, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div
                        className={`mt-0.5 ${
                          notif.type === "warning"
                            ? "text-orange-500"
                            : notif.type === "info"
                            ? "text-blue-500"
                            : "text-green-500"
                        }`}
                      >
                        {notif.type === "warning" ? (
                          <AlertCircle className="h-4 w-4" />
                        ) : notif.type === "info" ? (
                          <Bell className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {notif.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {notif.desc}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Thống kê
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Điểm trung bình lớp
                      </span>
                      <span className="font-semibold text-foreground">7.8</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Tỷ lệ hoàn thành bài tập
                      </span>
                      <span className="font-semibold text-foreground">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Tỷ lệ tham gia lớp
                      </span>
                      <span className="font-semibold text-foreground">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
