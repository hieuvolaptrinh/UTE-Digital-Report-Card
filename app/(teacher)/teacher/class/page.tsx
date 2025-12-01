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
import { BookOpen, Users, List, Edit, ArrowRight, Calendar, Lock } from "lucide-react";
import Link from "next/link";

// Mock Data: Danh sách các kỳ học
const SCHOOL_TERMS = [
  { id: "HK1_2024-2025", label: "Học kỳ 1 - Năm học 2024-2025", isCurrent: true, year: "2024-2025", term: "Học kỳ 1" },
  { id: "HK2_2023-2024", label: "Học kỳ 2 - Năm học 2023-2024", isCurrent: false, year: "2023-2024", term: "Học kỳ 2" },
  { id: "HK1_2023-2024", label: "Học kỳ 1 - Năm học 2023-2024", isCurrent: false, year: "2023-2024", term: "Học kỳ 1" },
];

// Mock Data: Danh sách lớp giảng dạy (Giả lập dữ liệu trả về theo kỳ)
const MOCK_CLASSES = [
  { id: "10A1", name: "10A1", studentCount: 45, subject: "Toán học" },
  { id: "10A2", name: "10A2", studentCount: 42, subject: "Toán học" },
  { id: "11A1", name: "11A1", studentCount: 40, subject: "Vật lý" },
  { id: "11A2", name: "11A2", studentCount: 38, subject: "Vật lý" },
  { id: "12A1", name: "12A1", studentCount: 41, subject: "Hóa học" },
  { id: "12A2", name: "12A2", studentCount: 39, subject: "Hóa học" },
];

export default function TeachingClassesPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // 1. State cho bộ lọc (Mặc định chọn kỳ hiện tại)
  const currentTerm = SCHOOL_TERMS.find(t => t.isCurrent) || SCHOOL_TERMS[0];
  const [selectedTermId, setSelectedTermId] = useState<string>(currentTerm.id);

  // Lấy thông tin chi tiết của kỳ đang chọn
  const selectedTermInfo = SCHOOL_TERMS.find(t => t.id === selectedTermId) || currentTerm;
  
  // Logic kiểm tra: Chỉ cho phép nhập điểm nếu là kỳ hiện tại
  const canEnterGrades = selectedTermInfo.isCurrent;

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
                  Các lớp giảng dạy tại {selectedTermInfo.term} năm {selectedTermInfo.year}
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

          {/* Class Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_CLASSES.map((classroom, index) => (
              <motion.div
                key={classroom.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <GlassCard hover className="h-full flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">
                          {classroom.name}
                        </h3>
                        <Badge variant="secondary" className="mt-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-normal">
                          {classroom.subject}
                        </Badge>
                      </div>
                      <div className="p-2 bg-primary/5 rounded-full text-primary">
                        <Users className="h-5 w-5" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                      <Users className="h-4 w-4" />
                      <span>{classroom.studentCount} học sinh</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                    {/* Nút 1: Xem danh sách (Luôn mở) */}
                    <Link href={`/teacher/class/${classroom.id}`} className="w-full">
                      <Button variant="outline" className="w-full justify-between group/btn hover:border-primary hover:text-primary">
                        <span className="flex items-center gap-2">
                          <List className="h-4 w-4" /> Xem danh sách
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover/btn:text-primary transition-colors" />
                      </Button>
                    </Link>

                    {/* Nút 2: Nhập điểm (Khóa nếu không phải kỳ hiện tại) */}
                    {canEnterGrades ? (
                       // Trạng thái Mở: Cho phép click vào
                      <Link href={`/teacher/grades/${classroom.id}`} className="w-full">
                        <Button className="w-full justify-between bg-primary/10 text-primary hover:bg-primary hover:text-white border-0">
                          <span className="flex items-center gap-2">
                            <Edit className="h-4 w-4" /> Nhập điểm
                          </span>
                          <ArrowRight className="h-4 w-4 opacity-50" />
                        </Button>
                      </Link>
                    ) : (
                      // Trạng thái Khóa: Làm mờ và không click được
                      <Button disabled className="w-full justify-between opacity-60 cursor-not-allowed bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border-0">
                        <span className="flex items-center gap-2">
                          <Lock className="h-4 w-4" /> Nhập điểm
                        </span>
                        <span className="text-xs font-normal">(Đã khóa)</span>
                      </Button>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}