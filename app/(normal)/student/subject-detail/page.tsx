"use client";

import { useAuth, isStudent } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockGradeEditRequests } from "@/mork-data";
import {
  BookOpen,
  ChevronLeft,
  FileEdit,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MessageSquare, 
} from "lucide-react";
import Link from "next/link";

// --- CẤU HÌNH TRẠNG THÁI ---
const MOCK_CONFIG = {
  // 'midterm': Giữa kỳ -> Hiện khung CK và Nhận xét nhưng để trống
  // 'final': Cuối kỳ -> Hiện đầy đủ dữ liệu
  phase: "midterm" as "midterm" | "final", 
};

// Hard coded data cho môn Toán
const SUBJECT_DATA = {
  studentId: "2024001",
  subjectId: "TOAN",
  subjectName: "Toán học",
  semester: 1,
  academicYear: "2024-2025",
  scores: {
    oral: [8, 9, 7],
    test15min: [8.5, 9],
    test45min: [8, 9],
    midterm: 8.5,
    final: 9, 
  },
  average: 8.6,
  teacherId: "GV001",
  teacherName: "Phạm Văn D",
  teacherComment:
    "Em có năng lực toán học tốt, tư duy logic rõ ràng. Tiếp tục phát huy và rèn luyện thêm về giải toán nâng cao.",
};

export default function SubjectDetailPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isStudent(user))) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !isStudent(user)) {
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
    role: user.role as "student",
  };

  const subjectGrade = SUBJECT_DATA;

  const editRequests = mockGradeEditRequests.filter(
    (req) => req.subjectId === "TOAN"
  );

  const getGradeColor = (average: number) => {
    if (average >= 9.0) return "text-green-600 dark:text-green-400";
    if (average >= 8.0) return "text-blue-600 dark:text-blue-400";
    if (average >= 6.5) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getGradeLabel = (average: number) => {
    if (average >= 9.0) return "Xuất sắc";
    if (average >= 8.0) return "Giỏi";
    if (average >= 6.5) return "Khá";
    if (average >= 5.0) return "Trung bình";
    return "Yếu";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Từ chối";
      case "pending":
        return "Đang xử lý";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/10 text-green-600";
      case "rejected":
        return "bg-red-500/10 text-red-600";
      case "pending":
        return "bg-orange-500/10 text-orange-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
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
            <Link href="/student">
              <Button variant="ghost" size="sm" className="mb-4 gap-2">
                <ChevronLeft className="h-4 w-4" />
                Quay lại bảng điểm
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {subjectGrade.subjectName}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Học kỳ {subjectGrade.semester} - Năm học{" "}
                  {subjectGrade.academicYear}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left column - Grade details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <GlassCard padding="md">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Tổng quan</h3>
                    <div className="text-right">
                      {MOCK_CONFIG.phase === 'final' ? (
                        <>
                          <div className={`text-3xl font-bold ${getGradeColor(subjectGrade.average)}`}>
                            {subjectGrade.average.toFixed(1)}
                          </div>
                          <Badge variant={subjectGrade.average >= 8.0 ? "default" : "secondary"}>
                            {getGradeLabel(subjectGrade.average)}
                          </Badge>
                        </>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-gray-300 dark:text-gray-700">--</div>
                          <span className="text-xs text-muted-foreground">Chưa tổng kết</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Giáo viên:</span>
                      <div className="font-medium mt-1">
                        {subjectGrade.teacherName}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Mã môn:</span>
                      <div className="font-medium mt-1">
                        {subjectGrade.subjectId}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Scores Detail */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <GlassCard padding="md">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Chi tiết điểm số</h3>
                    <Link href="/student/subject-detail/sua-diem">
                      <Button size="sm" className="gap-2">
                        <FileEdit className="h-4 w-4" />
                        Yêu cầu sửa điểm
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5 dark:bg-black/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Điểm miệng</span>
                        <span className="text-sm text-muted-foreground">Hệ số: 1</span>
                      </div>
                      <div className="flex gap-2">
                        {subjectGrade.scores.oral.map((score, idx) => (
                          <Badge key={idx} variant="outline" className="text-base">{score}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5 dark:bg-black/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Điểm 15 phút</span>
                        <span className="text-sm text-muted-foreground">Hệ số: 1</span>
                      </div>
                      <div className="flex gap-2">
                        {subjectGrade.scores.test15min.map((score, idx) => (
                          <Badge key={idx} variant="outline" className="text-base">{score}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5 dark:bg-black/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Điểm 1 tiết</span>
                        <span className="text-sm text-muted-foreground">Hệ số: 2</span>
                      </div>
                      <div className="flex gap-2">
                        {subjectGrade.scores.test45min.map((score, idx) => (
                          <Badge key={idx} variant="outline" className="text-base">{score}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5 dark:bg-black/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Điểm giữa kỳ</span>
                        <span className="text-sm text-muted-foreground">Hệ số: 2</span>
                      </div>
                      <Badge variant="outline" className="text-lg font-semibold">
                        {subjectGrade.scores.midterm}
                      </Badge>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5 dark:bg-black/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Điểm cuối kỳ</span>
                        <span className="text-sm text-muted-foreground">Hệ số: 3</span>
                      </div>
                      {MOCK_CONFIG.phase === 'final' ? (
                        <Badge variant="outline" className="text-lg font-semibold">
                          {subjectGrade.scores.final}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-600 font-medium text-lg">--</span>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <GlassCard padding="md">
                  <h3 className="text-lg font-semibold mb-4">
                    Nhận xét của giáo viên
                  </h3>
                  {MOCK_CONFIG.phase === 'final' && subjectGrade.teacherComment ? (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm leading-relaxed">
                        {subjectGrade.teacherComment}
                      </p>
                      <div className="mt-3 pt-3 border-t border-primary/10">
                        <span className="text-xs text-muted-foreground">
                          Giáo viên: {subjectGrade.teacherName}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 rounded-lg border-2 border-dashed border-gray-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
                      <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-full mb-2">
                         <MessageSquare className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Chưa có nhận xét cho học kỳ này
                      </p>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <GlassCard padding="md">
                  <h3 className="text-lg font-semibold mb-4">
                    Lịch sử yêu cầu sửa điểm
                  </h3>
                  {editRequests.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Chưa có yêu cầu nào</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {editRequests.map((request, index) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="p-4 rounded-lg bg-white/5 dark:bg-black/5 hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(request.status)}
                              <span className="font-medium text-sm">
                                {request.scoreTypeLabel}
                              </span>
                            </div>
                            <Badge className={getStatusColor(request.status)}>
                              {getStatusLabel(request.status)}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            Điểm hiện tại:{" "}
                            <span className="font-semibold">
                              {request.currentScore}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {request.reason}
                          </div>
                          {request.teacherResponse && (
                            <div className="mt-2 pt-2 border-t border-white/10">
                              <div className="text-xs font-medium mb-1">
                                Phản hồi:
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {request.teacherResponse}
                              </div>
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mt-2">
                            {new Date(request.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <GlassCard padding="md">
                  <h3 className="font-semibold mb-3">Công thức tính điểm</h3>
                  <div className="text-xs text-muted-foreground space-y-2">
                    <p>
                      ĐTB = (ΣĐmiệng×1 + ΣĐ15p×1 + ΣĐ1tiết×2 + Đgiữakỳ×2 +
                      Đcuốikỳ×3) / Tổng hệ số
                    </p>
                    <div className="pt-2 border-t border-white/10">
                      <p className="font-medium">Hệ số:</p>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        <li>Điểm miệng: 1</li>
                        <li>Điểm 15 phút: 1</li>
                        <li>Điểm 1 tiết: 2</li>
                        <li>Điểm giữa kỳ: 2</li>
                        <li>Điểm cuối kỳ: 3</li>
                      </ul>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}