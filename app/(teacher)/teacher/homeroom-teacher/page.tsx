"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getStudentDetailsByClass } from "@/mork-data";
import Link from "next/link";
import { Users, Phone, Mail, UserCheck } from "lucide-react";

export default function HomeroomTeacherPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isTeacher(user))) {
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

  if (!user.homeRoomClass) {
    return (
      <>
        <Header
          user={{
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role as any,
          }}
          onLogout={logout}
        />
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 py-6">
            <GlassCard padding="lg">
              <p className="text-center text-muted-foreground">
                Bạn không phải là giáo viên chủ nhiệm
              </p>
            </GlassCard>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const students = getStudentDetailsByClass(user.homeRoomClass);

  const conductColors = {
    Tốt: "bg-green-500/10 text-green-500 border-green-500/20",
    Khá: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Trung bình": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Yếu: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <>
      <Header
        user={{
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role as any,
        }}
        onLogout={logout}
      />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">
                  Lớp chủ nhiệm {user.homeRoomClass}
                </h1>
                <p className="text-muted-foreground">
                  Quản lý {students.length} học sinh
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student, index) => (
              <motion.div
                key={student.studentId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={`/teacher/homeroom-teacher/${student.studentId}`}>
                  <GlassCard
                    hover
                    padding="md"
                    className="cursor-pointer h-full"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.studentId}`}
                        />
                        <AvatarFallback>
                          {student.name.split(" ").slice(-1)[0].charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">
                          {student.name}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4 shrink-0" />
                            <span className="truncate">{student.email}</span>
                          </div>
                          {student.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="h-4 w-4 shrink-0" />
                              <span>{student.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <Badge
                              variant="outline"
                              className={
                                conductColors[student.conduct || "Trung bình"]
                              }
                            >
                              {student.conduct || "Chưa đánh giá"}
                            </Badge>
                          </div>
                          {student.averageGrade && (
                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="text-muted-foreground">
                                Điểm TB:
                              </span>
                              <span className="font-semibold text-primary">
                                {student.averageGrade.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>

          {students.length === 0 && (
            <GlassCard padding="lg">
              <p className="text-center text-muted-foreground">
                Chưa có học sinh trong lớp
              </p>
            </GlassCard>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
