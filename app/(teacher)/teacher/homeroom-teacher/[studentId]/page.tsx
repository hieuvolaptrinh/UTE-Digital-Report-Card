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
import { allMockStudents, type StudentDetail } from "@/mork-data";
import { StudentConductDialog } from "@/components/section/teacher/student-conduct-dialog";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  Calendar,
  CheckCircle2,
  Award,
  Edit,
  Check,
} from "lucide-react";

export default function StudentDetailPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isTeacher(user))) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const foundStudent = allMockStudents.find((s) => s.studentId === studentId);
    if (foundStudent) {
      setStudent(foundStudent);
    }
  }, [studentId]);

  const handleSave = (newConduct: string, newNote: string) => {
    if (student) {
      setStudent({
        ...student,
        conduct: newConduct as any,
        teacherNote: newNote,
      });
    }
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
            role: user.role as any,
          }}
          onLogout={logout}
        />
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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

  const conductColors = {
    Tốt: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    Khá: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "Trung bình":
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    Yếu: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  const attendanceRate = student.attendance
    ? ((student.attendance.present / student.attendance.total) * 100).toFixed(1)
    : "N/A";

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
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <Link href="/teacher/homeroom-teacher">
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
                    {student.class}
                  </Badge>
                  <Badge
                    className={`${
                      conductColors[student.conduct || "Trung bình"]
                    } text-base`}
                  >
                    {student.conduct || "Chưa đánh giá"}
                  </Badge>
                </div>
              </div>
              <Button onClick={() => setDialogOpen(true)} size="lg">
                <Edit className="h-4 w-4 mr-2" />
                Nhập đánh giá
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1 space-y-4"
            >
              <GlassCard padding="md" className="text-center">
                <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold">
                  {student.averageGrade?.toFixed(1) || "N/A"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Điểm trung bình
                </div>
              </GlassCard>

              <GlassCard padding="md" className="text-center">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-3xl font-bold">{attendanceRate}%</div>
                <div className="text-sm text-muted-foreground">
                  Tỷ lệ điểm danh
                </div>
                {student.attendance && (
                  <div className="mt-3 pt-3 border-t text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Có mặt:</span>
                      <span className="font-medium">
                        {student.attendance.present}/{student.attendance.total}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vắng:</span>
                      <span className="font-medium">
                        {student.attendance.absent}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Có phép:</span>
                      <span className="font-medium">
                        {student.attendance.excused}
                      </span>
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              <GlassCard padding="lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Thông tin cá nhân
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Ngày sinh
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{student.dateOfBirth}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Giới tính
                    </div>
                    <div className="font-medium">
                      {student.gender === "male" ? "Nam" : "Nữ"}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Email</div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">
                        {student.email}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Điện thoại
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {student.phone || "N/A"}
                      </span>
                    </div>
                  </div>

                  {student.address && (
                    <div className="space-y-1 sm:col-span-2">
                      <div className="text-sm text-muted-foreground">
                        Địa chỉ
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="font-medium">{student.address}</span>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>

              <GlassCard padding="lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Thông tin phụ huynh
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Họ tên</div>
                    <div className="font-medium">{student.parentName}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Số điện thoại
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{student.parentPhone}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {student.teacherNote && (
                <GlassCard padding="lg">
                  <h2 className="text-xl font-bold mb-4">Nhận xét</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {student.teacherNote}
                  </p>
                </GlassCard>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <StudentConductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        student={student}
        onSave={handleSave}
      />

      <Footer />
    </>
  );
}
