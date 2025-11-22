"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getStudentDetailsByClass,
  getGradesByClassAndSubject,
  type StudentSubjectGrade,
} from "@/mork-data";
import { StudentGradeDialog } from "@/components/section/teacher/student-grade-dialog";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  TrendingUp,
  Edit,
  Check,
  BookOpen,
} from "lucide-react";

export default function StudentGradePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const className = decodeURIComponent(params.className as string);
  // Hardcode studentId to always be 2024001
  const studentId = "2024001";

  const [dialogOpen, setDialogOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [studentGrades, setStudentGrades] =
    useState<StudentSubjectGrade | null>(null);

  const students = getStudentDetailsByClass(className);
  const student = students.find((s) => s.studentId === studentId);

  useEffect(() => {
    if (!isLoading && (!user || !isTeacher(user))) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && isTeacher(user) && student) {
      // Hardcode to always use Toán học subject for demo
      const subject = "Toán học";
      const grades = getGradesByClassAndSubject(className, subject);
      const studentGrade = grades.find(
        (g) => g.studentId === student.studentId
      );
      setStudentGrades(
        studentGrade || {
          studentId: student.studentId,
          subjectId: "",
          subjectName: subject,
          oral: [],
          test15min: [],
          test45min: [],
          midterm: null,
          final: null,
        }
      );
    }
  }, [user, student, className]);

  const handleSave = (grades: StudentSubjectGrade) => {
    setStudentGrades(grades);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading || !user || !isTeacher(user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!student) {
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
                Không tìm thấy thông tin học sinh
              </p>
            </GlassCard>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const calculateAverage = (grades: StudentSubjectGrade): number => {
    const oralAvg =
      grades.oral.length > 0
        ? grades.oral.reduce((a, b) => a + b, 0) / grades.oral.length
        : 0;
    const test15Avg =
      grades.test15min.length > 0
        ? grades.test15min.reduce((a, b) => a + b, 0) / grades.test15min.length
        : 0;
    const test45Avg =
      grades.test45min.length > 0
        ? grades.test45min.reduce((a, b) => a + b, 0) / grades.test45min.length
        : 0;

    let sum = 0;
    let weight = 0;

    if (grades.oral.length > 0) {
      sum += oralAvg * 1;
      weight += 1;
    }
    if (grades.test15min.length > 0) {
      sum += test15Avg * 1;
      weight += 1;
    }
    if (grades.test45min.length > 0) {
      sum += test45Avg * 2;
      weight += 2;
    }
    if (grades.midterm) {
      sum += grades.midterm * 2;
      weight += 2;
    }
    if (grades.final) {
      sum += grades.final * 3;
      weight += 3;
    }

    return weight > 0 ? parseFloat((sum / weight).toFixed(2)) : 0;
  };

  const avg = studentGrades ? calculateAverage(studentGrades) : 0;

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
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <Link href={`/teacher/class/${className}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-green-600 dark:text-green-400"
                >
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Đã lưu</span>
                </motion.div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.studentId}`}
                />
                <AvatarFallback className="text-2xl">
                  {student.name.split(" ").slice(-1)[0].charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="text-base">
                    {className}
                  </Badge>
                  <Badge variant="outline" className="text-base">
                    <BookOpen className="h-3 w-3 mr-1" />
                    Toán học
                  </Badge>
                </div>
              </div>
              <Button onClick={() => setDialogOpen(true)} size="lg">
                <Edit className="h-4 w-4 mr-2" />
                Nhập điểm
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Average Score */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <GlassCard padding="lg" className="text-center h-full">
                <TrendingUp className="h-10 w-10 text-primary mx-auto mb-3" />
                <div className="text-4xl font-bold text-primary mb-2">
                  {avg > 0 ? avg.toFixed(1) : "—"}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  Điểm trung bình môn
                </div>
                <div className="pt-4 border-t">
                  <div className="text-xs text-muted-foreground mb-2">
                    Xếp loại
                  </div>
                  <Badge
                    className={`text-base ${
                      avg >= 9
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                        : avg >= 8
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                        : avg >= 6.5
                        ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
                        : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                    }`}
                  >
                    {avg >= 9
                      ? "Xuất sắc"
                      : avg >= 8
                      ? "Giỏi"
                      : avg >= 6.5
                      ? "Khá"
                      : avg >= 5
                      ? "Trung bình"
                      : avg > 0
                      ? "Yếu"
                      : "Chưa có điểm"}
                  </Badge>
                </div>
              </GlassCard>
            </motion.div>

            {/* Grade Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 space-y-4"
            >
              {studentGrades && (
                <>
                  {/* Oral Scores */}
                  <GlassCard padding="md">
                    <h3 className="font-semibold mb-3 flex items-center justify-between">
                      <span>Điểm miệng (Hệ số 1)</span>
                      <Badge variant="outline">
                        {studentGrades.oral.length} điểm
                      </Badge>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {studentGrades.oral.length > 0 ? (
                        studentGrades.oral.map((score, idx) => (
                          <Badge
                            key={idx}
                            className="text-base px-3 py-1 bg-primary/10 text-primary border-primary/20"
                          >
                            {score.toFixed(1)}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Chưa có điểm
                        </span>
                      )}
                    </div>
                  </GlassCard>

                  {/* 15min Test Scores */}
                  <GlassCard padding="md">
                    <h3 className="font-semibold mb-3 flex items-center justify-between">
                      <span>Kiểm tra 15 phút (Hệ số 1)</span>
                      <Badge variant="outline">
                        {studentGrades.test15min.length} điểm
                      </Badge>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {studentGrades.test15min.length > 0 ? (
                        studentGrades.test15min.map((score, idx) => (
                          <Badge
                            key={idx}
                            className="text-base px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                          >
                            {score.toFixed(1)}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Chưa có điểm
                        </span>
                      )}
                    </div>
                  </GlassCard>

                  {/* 45min Test Scores */}
                  <GlassCard padding="md">
                    <h3 className="font-semibold mb-3 flex items-center justify-between">
                      <span>Kiểm tra 45 phút (Hệ số 2)</span>
                      <Badge variant="outline">
                        {studentGrades.test45min.length} điểm
                      </Badge>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {studentGrades.test45min.length > 0 ? (
                        studentGrades.test45min.map((score, idx) => (
                          <Badge
                            key={idx}
                            className="text-base px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
                          >
                            {score.toFixed(1)}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Chưa có điểm
                        </span>
                      )}
                    </div>
                  </GlassCard>

                  {/* Major Exams */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <GlassCard padding="md">
                      <h3 className="font-semibold mb-3">Giữa kỳ (Hệ số 2)</h3>
                      {studentGrades.midterm ? (
                        <Badge className="text-xl px-4 py-2 bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20">
                          {studentGrades.midterm.toFixed(1)}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Chưa có điểm
                        </span>
                      )}
                    </GlassCard>

                    <GlassCard padding="md">
                      <h3 className="font-semibold mb-3">Cuối kỳ (Hệ số 3)</h3>
                      {studentGrades.final ? (
                        <Badge className="text-xl px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">
                          {studentGrades.final.toFixed(1)}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Chưa có điểm
                        </span>
                      )}
                    </GlassCard>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <StudentGradeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        studentName={student.name}
        subject="Toán học"
        initialGrades={studentGrades}
        onSave={handleSave}
      />

      <Footer />
    </>
  );
}
