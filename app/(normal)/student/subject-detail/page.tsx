"use client";

import { useAuth, isStudent } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  Upload,
  X,
  FileImage,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

type ScoreItem = {
  id: string;
  type: "oral" | "test15min" | "test45min" | "midterm" | "final";
  label: string;
  value: number;
  index?: number;
};

export default function SubjectDetailPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [selectedScores, setSelectedScores] = useState<ScoreItem[]>([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [reason, setReason] = useState("");
  const [proposedScores, setProposedScores] = useState<{
    [key: string]: string;
  }>({});
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidencePreview, setEvidencePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleScoreSelect = (score: ScoreItem) => {
    setSelectedScores((prev) => {
      const exists = prev.find((s) => s.id === score.id);
      if (exists) {
        return prev.filter((s) => s.id !== score.id);
      }
      return [...prev, score];
    });
  };

  const handleOpenEditPopup = () => {
    if (selectedScores.length === 0) {
      alert("Vui lòng chọn ít nhất một điểm để sửa");
      return;
    }
    setShowEditPopup(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Chỉ chấp nhận file hình ảnh");
        return;
      }
      setEvidenceFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidencePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setEvidenceFile(null);
    setEvidencePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setShowSuccess(true);
    setIsSubmitting(false);

    // Reset form after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setShowEditPopup(false);
      setSelectedScores([]);
      setReason("");
      setProposedScores({});
      setEvidenceFile(null);
      setEvidencePreview("");
    }, 2000);
  };

  const handleProposedScoreChange = (scoreId: string, value: string) => {
    setProposedScores((prev) => ({
      ...prev,
      [scoreId]: value,
    }));
  };

  if (showSuccess) {
    return (
      <>
        <Header user={headerUser} onLogout={logout} />
        <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <div className="container mx-auto px-4 py-6 sm:py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto mt-20"
            >
              <GlassCard padding="lg">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Gửi yêu cầu thành công!
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Yêu cầu sửa điểm của bạn đã được gửi đến giáo viên. Vui lòng
                    chờ phản hồi từ giáo viên.
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
                      {MOCK_CONFIG.phase === "final" ? (
                        <>
                          <div
                            className={`text-3xl font-bold ${getGradeColor(
                              subjectGrade.average
                            )}`}
                          >
                            {subjectGrade.average.toFixed(1)}
                          </div>
                          <Badge
                            variant={
                              subjectGrade.average >= 8.0
                                ? "default"
                                : "secondary"
                            }
                          >
                            {getGradeLabel(subjectGrade.average)}
                          </Badge>
                        </>
                      ) : (
                        <>
                          <div className="text-3xl font-bold text-gray-300 dark:text-gray-700">
                            --
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Chưa tổng kết
                          </span>
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
                    <Button
                      size="sm"
                      className="gap-2"
                      onClick={handleOpenEditPopup}
                    >
                      <FileEdit className="h-4 w-4" />
                      Yêu cầu sửa điểm{" "}
                      {selectedScores.length > 0 &&
                        `(${selectedScores.length})`}
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-white/5 dark:bg-black/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Điểm miệng</span>
                        <span className="text-sm text-muted-foreground">
                          Hệ số: 1
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {subjectGrade.scores.oral.map((score, idx) => {
                          const scoreItem: ScoreItem = {
                            id: `oral-${idx}`,
                            type: "oral",
                            label: `Điểm miệng lần ${idx + 1}`,
                            value: score,
                            index: idx,
                          };
                          const isSelected = selectedScores.some(
                            (s) => s.id === scoreItem.id
                          );
                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 p-2 rounded border-2 transition-colors cursor-pointer ${
                                isSelected
                                  ? "border-primary bg-primary/10"
                                  : "border-transparent hover:border-primary/50"
                              }`}
                              onClick={() => handleScoreSelect(scoreItem)}
                            >
                              <Checkbox checked={isSelected} />
                              <Badge variant="outline" className="text-base">
                                {score}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5 dark:bg-black/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Điểm 15 phút</span>
                        <span className="text-sm text-muted-foreground">
                          Hệ số: 1
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {subjectGrade.scores.test15min.map((score, idx) => {
                          const scoreItem: ScoreItem = {
                            id: `test15min-${idx}`,
                            type: "test15min",
                            label: `Điểm 15 phút lần ${idx + 1}`,
                            value: score,
                            index: idx,
                          };
                          const isSelected = selectedScores.some(
                            (s) => s.id === scoreItem.id
                          );
                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 p-2 rounded border-2 transition-colors cursor-pointer ${
                                isSelected
                                  ? "border-primary bg-primary/10"
                                  : "border-transparent hover:border-primary/50"
                              }`}
                              onClick={() => handleScoreSelect(scoreItem)}
                            >
                              <Checkbox checked={isSelected} />
                              <Badge variant="outline" className="text-base">
                                {score}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5 dark:bg-black/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Điểm 1 tiết</span>
                        <span className="text-sm text-muted-foreground">
                          Hệ số: 2
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {subjectGrade.scores.test45min.map((score, idx) => {
                          const scoreItem: ScoreItem = {
                            id: `test45min-${idx}`,
                            type: "test45min",
                            label: `Điểm 1 tiết lần ${idx + 1}`,
                            value: score,
                            index: idx,
                          };
                          const isSelected = selectedScores.some(
                            (s) => s.id === scoreItem.id
                          );
                          return (
                            <div
                              key={idx}
                              className={`flex items-center gap-2 p-2 rounded border-2 transition-colors cursor-pointer ${
                                isSelected
                                  ? "border-primary bg-primary/10"
                                  : "border-transparent hover:border-primary/50"
                              }`}
                              onClick={() => handleScoreSelect(scoreItem)}
                            >
                              <Checkbox checked={isSelected} />
                              <Badge variant="outline" className="text-base">
                                {score}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5 dark:bg-black/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Điểm giữa kỳ</span>
                        <span className="text-sm text-muted-foreground">
                          Hệ số: 2
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-2 p-2 rounded border-2 transition-colors cursor-pointer w-fit ${
                          selectedScores.some((s) => s.id === "midterm")
                            ? "border-primary bg-primary/10"
                            : "border-transparent hover:border-primary/50"
                        }`}
                        onClick={() =>
                          handleScoreSelect({
                            id: "midterm",
                            type: "midterm",
                            label: "Điểm giữa kỳ",
                            value: subjectGrade.scores.midterm,
                          })
                        }
                      >
                        <Checkbox
                          checked={selectedScores.some(
                            (s) => s.id === "midterm"
                          )}
                        />
                        <Badge
                          variant="outline"
                          className="text-lg font-semibold"
                        >
                          {subjectGrade.scores.midterm}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-white/5 dark:bg-black/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Điểm cuối kỳ</span>
                        <span className="text-sm text-muted-foreground">
                          Hệ số: 3
                        </span>
                      </div>
                      {MOCK_CONFIG.phase === "final" ? (
                        <div
                          className={`flex items-center gap-2 p-2 rounded border-2 transition-colors cursor-pointer w-fit ${
                            selectedScores.some((s) => s.id === "final")
                              ? "border-primary bg-primary/10"
                              : "border-transparent hover:border-primary/50"
                          }`}
                          onClick={() =>
                            handleScoreSelect({
                              id: "final",
                              type: "final",
                              label: "Điểm cuối kỳ",
                              value: subjectGrade.scores.final,
                            })
                          }
                        >
                          <Checkbox
                            checked={selectedScores.some(
                              (s) => s.id === "final"
                            )}
                          />
                          <Badge
                            variant="outline"
                            className="text-lg font-semibold"
                          >
                            {subjectGrade.scores.final}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-600 font-medium text-lg">
                          --
                        </span>
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
                  {MOCK_CONFIG.phase === "final" &&
                  subjectGrade.teacherComment ? (
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

      {/* Edit Score Popup */}
      <AnimatePresence>
        {showEditPopup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Yêu cầu sửa điểm</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEditPopup(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {subjectGrade.subjectName} - {subjectGrade.teacherName}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Selected Scores */}
                <div className="space-y-2">
                  <Label>Các điểm đã chọn ({selectedScores.length})</Label>
                  <div className="space-y-3">
                    {selectedScores.map((score) => (
                      <div
                        key={score.id}
                        className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="font-medium">{score.label}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Điểm hiện tại:{" "}
                              <Badge variant="outline">{score.value}</Badge>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleScoreSelect(score)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`proposed-${score.id}`}>
                            Điểm đề xuất *
                          </Label>
                          <Input
                            id={`proposed-${score.id}`}
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            placeholder="Nhập điểm đề xuất (0-10)"
                            value={proposedScores[score.id] || ""}
                            onChange={(e) =>
                              handleProposedScoreChange(
                                score.id,
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reason */}
                <div className="space-y-2">
                  <Label htmlFor="reason">Lý do yêu cầu sửa điểm *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Vui lòng mô tả rõ lý do bạn cho rằng điểm cần được xem xét lại..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={5}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Hãy giải thích chi tiết và rõ ràng để giáo viên có thể xem
                    xét
                  </p>
                </div>

                {/* Evidence Upload */}
                <div className="space-y-2">
                  <Label htmlFor="evidence">Hình ảnh minh chứng</Label>
                  {!evidenceFile ? (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Input
                        id="evidence"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="evidence" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-1">
                          Nhấn để tải lên hình ảnh
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, JPEG (Tối đa 5MB)
                        </p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative border border-gray-300 dark:border-gray-700 rounded-lg p-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="absolute top-2 right-2 h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="flex items-start gap-4">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={evidencePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <FileImage className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                              {evidenceFile.name}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {(evidenceFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Tải lên hình ảnh bài làm, bài kiểm tra hoặc tài liệu liên
                    quan (không bắt buộc)
                  </p>
                </div>

                {/* Important Notes */}
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <div className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                      <p className="font-semibold">Lưu ý quan trọng:</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>
                          Yêu cầu sửa điểm chỉ được chấp nhận trong vòng 7 ngày
                          kể từ khi công bố điểm
                        </li>
                        <li>
                          Giáo viên sẽ xem xét và phản hồi trong vòng 3-5 ngày
                          làm việc
                        </li>
                        <li>
                          Kết quả xem xét của giáo viên là quyết định cuối cùng
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      selectedScores.length === 0 ||
                      !reason ||
                      !selectedScores.every((s) => proposedScores[s.id])
                    }
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang gửi...
                      </>
                    ) : (
                      "Gửi yêu cầu"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditPopup(false)}
                    disabled={isSubmitting}
                  >
                    Hủy
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
