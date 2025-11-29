"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { School, Search, Users, BookOpen, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassInfo {
  name: string;
  grade: number;
  studentCount: number;
  homeroomTeacher: string;
  averageGrade: number;
  academicYear: string;
  promotionRate: number;
}

const mockClasses: ClassInfo[] = [
  {
    name: "12A1",
    grade: 12,
    studentCount: 30,
    homeroomTeacher: "Nguyễn Văn H",
    averageGrade: 8.3,
    academicYear: "2024-2025",
    promotionRate: 0,
  },
  {
    name: "12A2",
    grade: 12,
    studentCount: 31,
    homeroomTeacher: "Võ Thị N",
    averageGrade: 7.9,
    academicYear: "2024-2025",
    promotionRate: 0,
  },
  {
    name: "12A3",
    grade: 12,
    studentCount: 29,
    homeroomTeacher: "Đặng Văn P",
    averageGrade: 8.1,
    academicYear: "2024-2025",
    promotionRate: 0,
  },
  {
    name: "10A1",
    grade: 10,
    studentCount: 35,
    homeroomTeacher: "Phạm Văn D",
    averageGrade: 8.2,
    academicYear: "2023-2024",
    promotionRate: 94.29,
  },
  {
    name: "10A2",
    grade: 10,
    studentCount: 33,
    homeroomTeacher: "Lê Văn K",
    averageGrade: 7.8,
    academicYear: "2023-2024",
    promotionRate: 90.91,
  },
  {
    name: "11A1",
    grade: 11,
    studentCount: 32,
    homeroomTeacher: "Nguyễn Thị M",
    averageGrade: 8.0,
    academicYear: "2023-2024",
    promotionRate: 93.75,
  },
  {
    name: "11A2",
    grade: 11,
    studentCount: 34,
    homeroomTeacher: "Trần Văn F",
    averageGrade: 8.5,
    academicYear: "2023-2024",
    promotionRate: 97.06,
  },
];

export default function SchoolOverviewPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredClasses = mockClasses.filter(
    (cls) =>
      (cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.homeroomTeacher.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (yearFilter === "all" || cls.academicYear === yearFilter) &&
      (gradeFilter === "all" || cls.grade.toString() === gradeFilter)
  );

  const yearOptions = Array.from(new Set(mockClasses.map((c) => c.academicYear))).sort().reverse();
  const gradeOptions = Array.from(new Set(mockClasses.map((c) => c.grade))).sort((a, b) => a - b);

  const totalStudents = mockClasses.reduce(
    (sum, cls) => sum + cls.studentCount,
    0
  );
  const averageGrade = (
    mockClasses.reduce((sum, cls) => sum + cls.averageGrade, 0) /
    mockClasses.length
  ).toFixed(1);

  const gradeStats = [
    {
      grade: 10,
      classes: mockClasses.filter((c) => c.grade === 10).length,
      students: mockClasses
        .filter((c) => c.grade === 10)
        .reduce((s, c) => s + c.studentCount, 0),
    },
    {
      grade: 11,
      classes: mockClasses.filter((c) => c.grade === 11).length,
      students: mockClasses
        .filter((c) => c.grade === 11)
        .reduce((s, c) => s + c.studentCount, 0),
    },
    {
      grade: 12,
      classes: mockClasses.filter((c) => c.grade === 12).length,
      students: mockClasses
        .filter((c) => c.grade === 12)
        .reduce((s, c) => s + c.studentCount, 0),
    },
  ];

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
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-lg bg-primary/10">
                <School className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Tổng quan trường</h1>
                <p className="text-muted-foreground">
                  Thông tin toàn bộ lớp học và học sinh
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <GlassCard hover padding="lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng số lớp</p>
                    <h3 className="text-3xl font-bold mt-1">
                      {mockClasses.length}
                    </h3>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <BookOpen className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <GlassCard hover padding="lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tổng học sinh
                    </p>
                    <h3 className="text-3xl font-bold mt-1">{totalStudents}</h3>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <Users className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <GlassCard hover padding="lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Điểm TB trường
                    </p>
                    <h3 className="text-3xl font-bold mt-1">{averageGrade}</h3>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <TrendingUp className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <GlassCard hover padding="lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tỷ lệ đạt</p>
                    <h3 className="text-3xl font-bold mt-1">95.2%</h3>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-500/10">
                    <School className="h-6 w-6 text-orange-500" />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>

          {/* Grade Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4">Thống kê theo khối</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {gradeStats.map((stat) => (
                <GlassCard key={stat.grade} padding="lg">
                  <h3 className="text-2xl font-bold mb-3">Khối {stat.grade}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Số lớp:</span>
                      <span className="font-semibold">{stat.classes} lớp</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Số học sinh:
                      </span>
                      <span className="font-semibold">{stat.students} HS</span>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mb-6"
          >
            <h2 className="text-xl font-semibold mb-4">Danh sách lớp học</h2>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="mb-6"
          >
            <GlassCard padding="lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm lớp học hoặc GVCN..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Lọc theo năm học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả năm học</SelectItem>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={gradeFilter} onValueChange={setGradeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Lọc theo khối" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả khối</SelectItem>
                    {gradeOptions.map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        Khối {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </GlassCard>
          </motion.div>

          {/* Classes List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <GlassCard padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/50">
                      <th className="px-6 py-3 text-left text-sm font-semibold">Lớp</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Khối</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">GVCN</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Số HS</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Năm học</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Điểm TB</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">% Lên lớp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClasses.map((classInfo) => (
                      <tr key={classInfo.name} className="border-b border-border/20 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-semibold">{classInfo.name}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline">Khối {classInfo.grade}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm">{classInfo.homeroomTeacher}</td>
                        <td className="px-6 py-4 text-sm">{classInfo.studentCount}</td>
                        <td className="px-6 py-4 text-sm">{classInfo.academicYear}</td>
                        <td className="px-6 py-4">
                          <Badge
                            className={cn(
                              classInfo.averageGrade >= 8
                                ? "bg-green-500/10 text-green-600 border-green-500/20"
                                : classInfo.averageGrade >= 6.5
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                            )}
                          >
                            {classInfo.averageGrade}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {classInfo.academicYear !== "2024-2025" && classInfo.promotionRate > 0 ? (
                            <Badge
                              className={cn(
                                classInfo.promotionRate >= 95
                                  ? "bg-green-500/10 text-green-600 border-green-500/20"
                                  : classInfo.promotionRate >= 90
                                  ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                  : "bg-orange-500/10 text-orange-600 border-orange-500/20"
                              )}
                            >
                              {classInfo.promotionRate.toFixed(2)}%
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredClasses.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  Không tìm thấy lớp học nào phù hợp
                </div>
              )}
            </GlassCard>
          </motion.div>

          {filteredClasses.length === 0 && (
            <GlassCard padding="lg">
              <p className="text-center text-muted-foreground">
                Không tìm thấy lớp học nào phù hợp
              </p>
            </GlassCard>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
