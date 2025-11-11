"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { allMockStudents } from "@/mork-data";
import Link from "next/link";
import { BookOpen, Users, ArrowRight } from "lucide-react";

export default function ClassListPage() {
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

  const classesData = user.classes.map((className) => {
    const students = allMockStudents.filter((s) => s.class === className);
    return {
      name: className,
      studentCount: students.length,
      subject: user.subject,
    };
  });

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
      <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Lớp giảng dạy</h1>
                <p className="text-muted-foreground">
                  Quản lý {user.classes.length} lớp - Môn {user.subject}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classesData.map((classData, index) => (
              <motion.div
                key={classData.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <GlassCard hover padding="lg" className="h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">
                          {classData.name}
                        </h3>
                        <Badge variant="secondary">{classData.subject}</Badge>
                      </div>
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {classData.studentCount} học sinh
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Link href={`/teacher/class/${classData.name}`}>
                        <Button variant="outline" className="w-full group">
                          Xem danh sách & nhập điểm
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {classesData.length === 0 && (
            <GlassCard padding="lg">
              <p className="text-center text-muted-foreground">
                Chưa có lớp nào được phân công
              </p>
            </GlassCard>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
