"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Users,
  Edit,
  Calendar,
  Lock,
  Eye,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock Data: Danh sách các kỳ học
const SCHOOL_TERMS = [
  {
    id: "all",
    label: "Tất cả các kỳ học",
    isCurrent: false,
    year: "Tất cả",
    term: "Tất cả",
  },
  {
    id: "HK1_2025-2026",
    label: "Học kỳ 1 - Năm học 2025-2026",
    isCurrent: true,
    year: "2025-2026",
    term: "Học kỳ 1",
  },
  {
    id: "HK2_2024-2025",
    label: "Học kỳ 2 - Năm học 2024-2025",
    isCurrent: false,
    year: "2024-2025",
    term: "Học kỳ 2",
  },
  {
    id: "HK1_2024-2025",
    label: "Học kỳ 1 - Năm học 2024-2025",
    isCurrent: false,
    year: "2024-2025",
    term: "Học kỳ 1",
  },
  {
    id: "HK2_2023-2024",
    label: "Học kỳ 2 - Năm học 2023-2024",
    isCurrent: false,
    year: "2023-2024",
    term: "Học kỳ 2",
  },
  {
    id: "HK1_2023-2024",
    label: "Học kỳ 1 - Năm học 2023-2024",
    isCurrent: false,
    year: "2023-2024",
    term: "Học kỳ 1",
  },
];

// Interface cho dữ liệu lớp học
interface ClassData {
  id: string;
  name: string;
  studentCount: number;
  subject: string;
  termId: string;
  year: string;
  term: string;
  hasEnteredGrades: boolean;
  studentsWithGrades: number; // Số học sinh đã nhập điểm
}

// Mock Data: Danh sách lớp giảng dạy theo kỳ học
const MOCK_CLASSES_BY_TERM: Record<string, ClassData[]> = {
  "HK1_2025-2026": [
    {
      id: "10A1-2025",
      name: "10A1",
      studentCount: 45,
      subject: "Toán học",
      termId: "HK1_2025-2026",
      year: "2025-2026",
      term: "HK1",
      hasEnteredGrades: true,
      studentsWithGrades: 45,
    },
    {
      id: "10A2-2025",
      name: "10A2",
      studentCount: 42,
      subject: "Toán học",
      termId: "HK1_2025-2026",
      year: "2025-2026",
      term: "HK1",
      hasEnteredGrades: false,
      studentsWithGrades: 28,
    },
    {
      id: "11A1-2025",
      name: "11A1",
      studentCount: 40,
      subject: "Vật lý",
      termId: "HK1_2025-2026",
      year: "2025-2026",
      term: "HK1",
      hasEnteredGrades: true,
      studentsWithGrades: 40,
    },
    {
      id: "11A2-2025",
      name: "11A2",
      studentCount: 38,
      subject: "Vật lý",
      termId: "HK1_2025-2026",
      year: "2025-2026",
      term: "HK1",
      hasEnteredGrades: false,
      studentsWithGrades: 15,
    },
    {
      id: "12A1-2025",
      name: "12A1",
      studentCount: 41,
      subject: "Hóa học",
      termId: "HK1_2025-2026",
      year: "2025-2026",
      term: "HK1",
      hasEnteredGrades: true,
      studentsWithGrades: 41,
    },
    {
      id: "12A2-2025",
      name: "12A2",
      studentCount: 39,
      subject: "Hóa học",
      termId: "HK1_2025-2026",
      year: "2025-2026",
      term: "HK1",
      hasEnteredGrades: false,
      studentsWithGrades: 0,
    },
  ],
  "HK2_2024-2025": [
    {
      id: "10A1-2024-2",
      name: "10A1",
      studentCount: 43,
      subject: "Toán học",
      termId: "HK2_2024-2025",
      year: "2024-2025",
      term: "HK2",
      hasEnteredGrades: true,
      studentsWithGrades: 43,
    },
    {
      id: "11A3-2024-2",
      name: "11A3",
      studentCount: 41,
      subject: "Vật lý",
      termId: "HK2_2024-2025",
      year: "2024-2025",
      term: "HK2",
      hasEnteredGrades: true,
      studentsWithGrades: 41,
    },
    {
      id: "12A3-2024-2",
      name: "12A3",
      studentCount: 40,
      subject: "Hóa học",
      termId: "HK2_2024-2025",
      year: "2024-2025",
      term: "HK2",
      hasEnteredGrades: true,
      studentsWithGrades: 40,
    },
  ],
  "HK1_2024-2025": [
    {
      id: "10A1-2024-1",
      name: "10A1",
      studentCount: 44,
      subject: "Toán học",
      termId: "HK1_2024-2025",
      year: "2024-2025",
      term: "HK1",
      hasEnteredGrades: true,
      studentsWithGrades: 44,
    },
    {
      id: "10A3-2024-1",
      name: "10A3",
      studentCount: 43,
      subject: "Toán học",
      termId: "HK1_2024-2025",
      year: "2024-2025",
      term: "HK1",
      hasEnteredGrades: true,
      studentsWithGrades: 43,
    },
    {
      id: "11A1-2024-1",
      name: "11A1",
      studentCount: 39,
      subject: "Vật lý",
      termId: "HK1_2024-2025",
      year: "2024-2025",
      term: "HK1",
      hasEnteredGrades: true,
      studentsWithGrades: 39,
    },
    {
      id: "11A4-2024-1",
      name: "11A4",
      studentCount: 37,
      subject: "Vật lý",
      termId: "HK1_2024-2025",
      year: "2024-2025",
      term: "HK1",
      hasEnteredGrades: true,
      studentsWithGrades: 37,
    },
  ],
  "HK2_2023-2024": [
    {
      id: "9A1-2023-2",
      name: "9A1",
      studentCount: 42,
      subject: "Toán học",
      termId: "HK2_2023-2024",
      year: "2023-2024",
      term: "HK2",
      hasEnteredGrades: true,
      studentsWithGrades: 42,
    },
    {
      id: "10A4-2023-2",
      name: "10A4",
      studentCount: 40,
      subject: "Vật lý",
      termId: "HK2_2023-2024",
      year: "2023-2024",
      term: "HK2",
      hasEnteredGrades: true,
      studentsWithGrades: 40,
    },
  ],
  "HK1_2023-2024": [
    {
      id: "9A1-2023-1",
      name: "9A1",
      studentCount: 41,
      subject: "Toán học",
      termId: "HK1_2023-2024",
      year: "2023-2024",
      term: "HK1",
      hasEnteredGrades: true,
      studentsWithGrades: 41,
    },
    {
      id: "9A2-2023-1",
      name: "9A2",
      studentCount: 40,
      subject: "Toán học",
      termId: "HK1_2023-2024",
      year: "2023-2024",
      term: "HK1",
      hasEnteredGrades: true,
      studentsWithGrades: 40,
    },
    {
      id: "10A5-2023-1",
      name: "10A5",
      studentCount: 38,
      subject: "Vật lý",
      termId: "HK1_2023-2024",
      year: "2023-2024",
      term: "HK1",
      hasEnteredGrades: true,
      studentsWithGrades: 38,
    },
  ],
};

// Hàm lấy tất cả các lớp
const getAllClasses = (): ClassData[] => {
  return Object.values(MOCK_CLASSES_BY_TERM).flat();
};

export default function TeachingClassesPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // 1. State cho bộ lọc (Mặc định là tất cả)
  const [selectedTermId, setSelectedTermId] = useState<string>("all");

  // Lấy thông tin chi tiết của kỳ đang chọn
  const selectedTermInfo =
    SCHOOL_TERMS.find((t) => t.id === selectedTermId) || SCHOOL_TERMS[0];

  // Lấy danh sách lớp theo kỳ học đã chọn
  const currentClasses =
    selectedTermId === "all"
      ? getAllClasses()
      : MOCK_CLASSES_BY_TERM[selectedTermId] || [];
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

  const headerUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role as "teacher" | "academic-officer" | "principal",
  };

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                {/* Tiêu đề động theo kỳ học */}
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Các lớp giảng dạy tại {selectedTermInfo.term} năm{" "}
                  {selectedTermInfo.year}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Quản lý danh sách lớp và nhập điểm môn học
                </p>
              </div>
            </div>

            {/* Combobox Filter */}
            <div className="w-full md:w-[300px]">
              <Select value={selectedTermId} onValueChange={setSelectedTermId}>
                <SelectTrigger className="w-full bg-white dark:bg-gray-900 border-primary/20 h-11">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <SelectValue placeholder="Chọn kỳ học" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {SCHOOL_TERMS.map((term) => (
                    <SelectItem key={term.id} value={term.id}>
                      {term.label} {term.isCurrent && "(Hiện tại)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Class Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="overflow-hidden">
              {currentClasses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                    <BookOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Không có lớp học
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Không tìm thấy lớp học nào trong kỳ học này
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 w-20">
                          STT
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                          Lớp
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                          Niên khóa
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300">
                          Môn học
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-center">
                          Sĩ số
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-center">
                          Trạng thái
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-center">
                          Nhập điểm
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 dark:text-gray-300 text-right">
                          Thao tác
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentClasses.map((classroom, index) => (
                        <TableRow
                          key={classroom.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
                        >
                          <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Users className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {classroom.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {classroom.year}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {classroom.term}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-normal"
                            >
                              {classroom.subject}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Users className="h-3.5 w-3.5" />
                              {classroom.studentCount}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            {SCHOOL_TERMS.find((t) => t.id === classroom.termId)
                              ?.isCurrent ? (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Đang dạy
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Đã dạy
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {SCHOOL_TERMS.find((t) => t.id === classroom.termId)
                              ?.isCurrent ? (
                              classroom.hasEnteredGrades ? (
                                <div className="flex flex-col items-center gap-1">
                                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Đã nhập
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {classroom.studentsWithGrades}/
                                    {classroom.studentCount} học sinh
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-1">
                                  <Badge
                                    variant="outline"
                                    className="bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800"
                                  >
                                    <Lock className="h-3 w-3 mr-1" />
                                    Chưa nhập
                                  </Badge>
                                  <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                                    Còn{" "}
                                    {classroom.studentCount -
                                      classroom.studentsWithGrades}
                                    /{classroom.studentCount} học sinh
                                  </span>
                                </div>
                              )
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500"
                              >
                                -
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              {/* Nút Xem danh sách - Luôn trỏ về lớp 10A1 */}
                              <Link href="/teacher/class/10A1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-blue-950 dark:hover:text-blue-400"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Xem DS
                                </Button>
                              </Link>

                              {/* Nút Nhập điểm - Chỉ cho phép nếu là kỳ hiện tại, luôn trỏ về lớp 10A1 */}
                              {SCHOOL_TERMS.find(
                                (t) => t.id === classroom.termId
                              )?.isCurrent ? (
                                <Link href="/teacher/class/10A1">
                                  <Button
                                    size="sm"
                                    className="bg-primary hover:bg-primary/90"
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Nhập điểm
                                  </Button>
                                </Link>
                              ) : (
                                <Button
                                  size="sm"
                                  disabled
                                  className="opacity-50 cursor-not-allowed"
                                >
                                  <Lock className="h-4 w-4 mr-1" />
                                  Nhập điểm
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </GlassCard>

            {/* Summary Stats */}
            {currentClasses.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 space-y-4"
              >
                {/* Thống kê tổng quan */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Tổng số lớp:</span>
                    <strong className="text-lg text-gray-900 dark:text-gray-100">
                      {currentClasses.length}
                    </strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      Tổng số học sinh:
                    </span>
                    <strong className="text-lg text-gray-900 dark:text-gray-100">
                      {currentClasses.reduce(
                        (sum, c) => sum + c.studentCount,
                        0
                      )}
                    </strong>
                  </div>

                  {/* Thống kê lớp đang dạy */}
                  {(() => {
                    const currentTermClasses = currentClasses.filter(
                      (c) =>
                        SCHOOL_TERMS.find((t) => t.id === c.termId)?.isCurrent
                    );
                    const enteredGradesCount = currentTermClasses.filter(
                      (c) => c.hasEnteredGrades
                    ).length;
                    const notEnteredCount =
                      currentTermClasses.length - enteredGradesCount;

                    if (currentTermClasses.length > 0) {
                      return (
                        <>
                          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                              Lớp đang dạy:
                            </span>
                            <strong className="text-lg text-green-600 dark:text-green-400">
                              {currentTermClasses.length}
                            </strong>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-muted-foreground">
                              Đã nhập điểm:
                            </span>
                            <strong className="text-blue-600 dark:text-blue-400">
                              {enteredGradesCount}
                            </strong>
                          </div>
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            <span className="text-muted-foreground">
                              Chưa nhập điểm:
                            </span>
                            <strong className="text-orange-600 dark:text-orange-400">
                              {notEnteredCount}
                            </strong>
                          </div>
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>

                {/* Cảnh báo khi xem kỳ đã kết thúc */}
                {selectedTermId !== "all" &&
                  !SCHOOL_TERMS.find((t) => t.id === selectedTermId)
                    ?.isCurrent && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-700 dark:text-amber-400">
                      <Lock className="h-5 w-5 shrink-0" />
                      <span className="font-medium text-sm">
                        Kỳ học đã kết thúc - Chỉ được xem thông tin, không thể
                        nhập điểm
                      </span>
                    </div>
                  )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
