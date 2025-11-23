"use client";

import { useAuth, isParent } from "@/lib/auth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GradesOverview } from "@/components/section/student/grades-overview";
import { GradesTable } from "@/components/section/student/grades-table";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockGrades, Grade } from "@/mork-data";
import { ArrowLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ChildDetailPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const childId = params.child as string;
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [semester, setSemester] = useState<1 | 2>(1);
  const [childGrades, setChildGrades] = useState<Grade[]>([]);
  const [childInfo, setChildInfo] = useState<{
    name: string;
    class: string;
    studentId: string;
  } | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || !isParent(user))) {
      router.push("/login");
    }

    if (user && isParent(user)) {
      // Find child info
      const child = user.children.find((c) => c.studentId === childId);
      if (!child) {
        router.push("/parent");
        return;
      }

      setChildInfo({
        name: child.name,
        class: child.class,
        studentId: child.studentId,
      });

      // Load grades for this child - hard coded
      const grades = mockGrades.filter(
        (g) =>
          g.studentId === child.studentId &&
          g.academicYear === academicYear &&
          g.semester === semester
      );
      setChildGrades(grades);
    }
  }, [user, isLoading, router, childId, academicYear, semester]);

  if (isLoading || !user || !isParent(user) || !childInfo) {
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
    role: user.role as "parent",
  };

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-6">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <Link href="/parent">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
            </Link>
          </motion.div>

          {/* Child Info Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold">Bảng điểm - {childInfo.name}</h1>
            <p className="text-muted-foreground mt-1">
              Lớp {childInfo.class} | MSSV: {childInfo.studentId}
            </p>
          </motion.div>

          {/* Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <GlassCard padding="md">
              <div className="flex items-center gap-3 mb-4">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Lọc bảng điểm</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Năm học</Label>
                  <Select value={academicYear} onValueChange={setAcademicYear}>
                    <SelectTrigger id="academicYear">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2023-2024">2023-2024</SelectItem>
                      <SelectItem value="2022-2023">2022-2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Học kỳ</Label>
                  <Select
                    value={semester.toString()}
                    onValueChange={(val) => setSemester(parseInt(val) as 1 | 2)}
                  >
                    <SelectTrigger id="semester">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Học kỳ I</SelectItem>
                      <SelectItem value="2">Học kỳ II</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <GradesOverview grades={childGrades} />
          <GradesTable grades={childGrades} />
        </div>
      </main>
      <Footer />
    </>
  );
}
