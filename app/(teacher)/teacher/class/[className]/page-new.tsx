"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getStudentDetailsByClass } from "@/mork-data";
import Link from "next/link";
import { ArrowLeft, BookOpen, Users, Mail, Phone, Edit } from "lucide-react";

export default function ClassDetailPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const className = decodeURIComponent(params.className as string);

  const students = getStudentDetailsByClass(className);

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
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Link href="/teacher/class">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10 backdrop-blur-sm">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Lớp {className}</h1>
                <p className="text-muted-foreground">
                  {students.length} học sinh - Môn {user.subject}
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
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={`/teacher/class/${className}/${student.studentId}`}>
                  <GlassCard
                    hover
                    padding="md"
                    className="cursor-pointer h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 border-2 border-primary/10">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.studentId}`}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {student.name.split(" ").slice(-1)[0].charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-lg truncate">
                            {student.name}
                          </h3>
                          <Edit className="h-4 w-4 text-muted-foreground shrink-0" />
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate text-xs">
                              {student.email}
                            </span>
                          </div>
                          {student.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="h-3.5 w-3.5 shrink-0" />
                              <span className="text-xs">{student.phone}</span>
                            </div>
                          )}
                          {student.averageGrade !== undefined && (
                            <div className="flex items-center justify-between pt-2 border-t border-border/50">
                              <span className="text-xs text-muted-foreground">
                                Điểm TB:
                              </span>
                              <Badge
                                className={`text-sm font-semibold ${
                                  student.averageGrade >= 8
                                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                                    : student.averageGrade >= 6.5
                                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                                    : "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
                                }`}
                              >
                                {student.averageGrade.toFixed(1)}
                              </Badge>
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
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  Chưa có học sinh trong lớp
                </p>
              </div>
            </GlassCard>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
