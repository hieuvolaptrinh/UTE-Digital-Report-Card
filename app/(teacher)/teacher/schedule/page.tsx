"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { mockSchedule, Schedule } from "@/mork-data";

const daysOfWeek = [
  { day: 2, label: "Thứ Hai" },
  { day: 3, label: "Thứ Ba" },
  { day: 4, label: "Thứ Tư" },
  { day: 5, label: "Thứ Năm" },
  { day: 6, label: "Thứ Sáu" },
  { day: 7, label: "Thứ Bảy" },
];

export default function TeacherSchedulePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [schedule, setSchedule] = useState<Schedule[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || !isTeacher(user))) {
      router.push("/login");
    }

    if (user && isTeacher(user)) {
      const teacherSchedule = mockSchedule.filter(
        (s) => s.teacherId === user.teacherId
      );
      setSchedule(teacherSchedule);
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !isTeacher(user)) {
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

  const getScheduleForDayAndPeriod = (day: number, period: number) => {
    return schedule.find((s) => s.dayOfWeek === day && s.period === period);
  };

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Thời khóa biểu
                </h1>
                <p className="text-muted-foreground mt-1">
                  Lịch giảng dạy của giáo viên
                </p>
              </div>
            </div>
          </motion.div>

          <GlassCard padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-left font-semibold">Tiết</th>
                    {daysOfWeek.map(({ day, label }) => (
                      <th
                        key={day}
                        className="p-4 text-center font-semibold min-w-[150px]"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((period) => (
                    <motion.tr
                      key={period}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: period * 0.1 }}
                      className="border-b border-white/10 hover:bg-white/5 dark:hover:bg-black/5"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">Tiết {period}</span>
                        </div>
                      </td>
                      {daysOfWeek.map(({ day }) => {
                        const scheduleItem = getScheduleForDayAndPeriod(
                          day,
                          period
                        );
                        return (
                          <td key={day} className="p-2">
                            {scheduleItem ? (
                              <div className="bg-primary/10 rounded-lg p-3 text-center">
                                <p className="font-semibold text-sm">
                                  {scheduleItem.subject}
                                </p>
                                <Badge
                                  variant="secondary"
                                  className="mt-1 text-xs"
                                >
                                  {scheduleItem.class}
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {scheduleItem.room}
                                </p>
                              </div>
                            ) : (
                              <div className="text-center text-muted-foreground text-sm">
                                -
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6"
          >
            <GlassCard padding="md">
              <h3 className="font-semibold mb-3">Thống kê giảng dạy</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tổng tiết/tuần
                  </p>
                  <p className="text-2xl font-bold">{schedule.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Số lớp</p>
                  <p className="text-2xl font-bold">{user.classes.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Môn dạy</p>
                  <p className="text-2xl font-bold">{user.subject || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Lớp chủ nhiệm</p>
                  <p className="text-2xl font-bold">
                    {user.homeRoomClass || "Không"}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
