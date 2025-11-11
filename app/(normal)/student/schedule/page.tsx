// app/(normal)/student/schedule/page.tsx
"use client";

import { useAuth, isStudent } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { mockSchedule, timeSlots, Schedule } from "@/mork-data";
import { Calendar, Clock, MapPin, User } from "lucide-react";

const daysOfWeek = [
  { day: 2, label: "Thứ Hai" },
  { day: 3, label: "Thứ Ba" },
  { day: 4, label: "Thứ Tư" },
  { day: 5, label: "Thứ Năm" },
  { day: 6, label: "Thứ Sáu" },
  { day: 7, label: "Thứ Bảy" },
];

export default function StudentSchedulePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [schedule, setSchedule] = useState<Schedule[]>([]);

  useEffect(() => {
    if (!isLoading && (!user || !isStudent(user))) {
      router.push("/login");
    }

    if (user && isStudent(user)) {
      const classSchedule = mockSchedule.filter((s) => s.class === user.class);
      setSchedule(classSchedule);
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !isStudent(user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getScheduleForDayAndPeriod = (day: number, period: number) => {
    return schedule.find((s) => s.dayOfWeek === day && s.period === period);
  };

  const headerUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role as any,
  };

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
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
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Thời khóa biểu
                </h1>
                <p className="text-muted-foreground mt-1">
                  Lớp {user.class} - Học kỳ I, năm học 2024-2025
                </p>
              </div>
            </div>
          </motion.div>

          <GlassCard padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="sticky left-0 bg-background/80 backdrop-blur-sm p-4 text-left font-semibold min-w-[100px]">
                      Tiết / Thứ
                    </th>
                    {daysOfWeek.map(({ day, label }) => (
                      <th
                        key={day}
                        className="p-4 text-center font-semibold min-w-[150px]"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span>{label}</span>
                          <Badge variant="outline" className="text-xs">
                            {day}/12
                          </Badge>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot, index) => (
                    <motion.tr
                      key={slot.period}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-white/10 hover:bg-white/5 dark:hover:bg-black/5"
                    >
                      <td className="sticky left-0 bg-background/80 backdrop-blur-sm p-4">
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            Tiết {slot.period}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                        </div>
                      </td>
                      {daysOfWeek.map(({ day }) => {
                        const scheduleItem = getScheduleForDayAndPeriod(
                          day,
                          slot.period
                        );
                        return (
                          <td key={day} className="p-2">
                            {scheduleItem ? (
                              <div className="p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer">
                                <div className="font-semibold text-sm mb-1">
                                  {scheduleItem.subjectName}
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                  <User className="h-3 w-3" />
                                  <span>{scheduleItem.teacherName}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  <span>Phòng {scheduleItem.room}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="p-3 rounded-lg bg-muted/30 text-center text-xs text-muted-foreground">
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
              <h3 className="font-semibold mb-3">Ghi chú</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Giờ học sáng: 7:00 - 11:05</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Giờ học chiều: 13:00 - 17:05</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Học sinh cần có mặt trước 15 phút mỗi buổi học</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    Thời khóa biểu có thể thay đổi, vui lòng theo dõi thông báo
                  </span>
                </li>
              </ul>
            </GlassCard>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
