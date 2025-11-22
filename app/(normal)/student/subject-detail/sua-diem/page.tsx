"use client";

import { useAuth, isStudent } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  FileImage,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Hard coded data cho môn Toán
const SUBJECT_DATA = {
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
};

export default function GradeEditRequestPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [scoreType, setScoreType] = useState("");
  const [reason, setReason] = useState("");
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

    // Reset form after 2 seconds and redirect
    setTimeout(() => {
      router.push("/student/subject-detail");
    }, 2000);
  };

  const getCurrentScore = () => {
    if (!scoreType) return null;

    switch (scoreType) {
      case "oral":
        return subjectGrade.scores.oral[subjectGrade.scores.oral.length - 1];
      case "test15min":
        return subjectGrade.scores.test15min[
          subjectGrade.scores.test15min.length - 1
        ];
      case "test45min":
        return subjectGrade.scores.test45min[
          subjectGrade.scores.test45min.length - 1
        ];
      case "midterm":
        return subjectGrade.scores.midterm;
      case "final":
        return subjectGrade.scores.final;
      default:
        return null;
    }
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
                  <p className="text-xs text-muted-foreground">
                    Đang chuyển hướng...
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
            <Link href="/student/subject-detail">
              <Button variant="ghost" size="sm" className="mb-4 gap-2">
                <ChevronLeft className="h-4 w-4" />
                Quay lại
              </Button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold">Yêu cầu sửa điểm</h1>
            <p className="text-muted-foreground mt-1">
              {subjectGrade.subjectName} - {subjectGrade.teacherName}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <GlassCard padding="md">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Score Type Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="scoreType">Loại điểm cần sửa *</Label>
                    <Select
                      value={scoreType}
                      onValueChange={setScoreType}
                      required
                    >
                      <SelectTrigger id="scoreType">
                        <SelectValue placeholder="Chọn loại điểm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oral">
                          Điểm miệng (Điểm gần nhất:{" "}
                          {
                            subjectGrade.scores.oral[
                              subjectGrade.scores.oral.length - 1
                            ]
                          }
                          )
                        </SelectItem>
                        <SelectItem value="test15min">
                          Điểm 15 phút (Điểm gần nhất:{" "}
                          {
                            subjectGrade.scores.test15min[
                              subjectGrade.scores.test15min.length - 1
                            ]
                          }
                          )
                        </SelectItem>
                        <SelectItem value="test45min">
                          Điểm 1 tiết (Điểm gần nhất:{" "}
                          {
                            subjectGrade.scores.test45min[
                              subjectGrade.scores.test45min.length - 1
                            ]
                          }
                          )
                        </SelectItem>
                        <SelectItem value="midterm">
                          Điểm giữa kỳ (Điểm hiện tại:{" "}
                          {subjectGrade.scores.midterm})
                        </SelectItem>
                        <SelectItem value="final">
                          Điểm cuối kỳ (Điểm hiện tại:{" "}
                          {subjectGrade.scores.final})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {scoreType && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">
                          Điểm hiện tại:
                        </span>
                        <Badge variant="outline" className="font-semibold">
                          {getCurrentScore()}
                        </Badge>
                      </div>
                    )}
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

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !scoreType || !reason}
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
                    <Link href="/student/subject-detail">
                      <Button type="button" variant="outline">
                        Hủy
                      </Button>
                    </Link>
                  </div>
                </form>
              </GlassCard>
            </motion.div>

            {/* Sidebar - Instructions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <GlassCard padding="md">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-2">Lưu ý quan trọng</h3>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Yêu cầu sửa điểm chỉ được chấp nhận trong vòng 7 ngày kể
                      từ khi công bố điểm
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Nêu rõ lý do và cung cấp bằng chứng cụ thể để yêu cầu được
                      xem xét
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Giáo viên sẽ xem xét và phản hồi trong vòng 3-5 ngày làm
                      việc
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Kết quả xem xét của giáo viên là quyết định cuối cùng
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>
                      Bạn có thể theo dõi trạng thái yêu cầu trong mục lịch sử
                    </span>
                  </li>
                </ul>
              </GlassCard>

              <GlassCard padding="md">
                <h3 className="font-semibold mb-3">Thông tin môn học</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Môn học:</span>
                    <span className="font-medium">
                      {subjectGrade.subjectName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Giáo viên:</span>
                    <span className="font-medium">
                      {subjectGrade.teacherName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Học kỳ:</span>
                    <span className="font-medium">
                      HK{subjectGrade.semester} - {subjectGrade.academicYear}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Điểm TB:</span>
                    <Badge variant="outline" className="font-semibold">
                      {subjectGrade.average}
                    </Badge>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
