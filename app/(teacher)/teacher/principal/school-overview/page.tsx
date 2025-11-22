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
import { School, Search, Users, BookOpen, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassInfo {
  name: string;
  grade: number;
  studentCount: number;
  homeroomTeacher: string;
  averageGrade: number;
}

const mockClasses: ClassInfo[] = [
  {
    name: "10A1",
    grade: 10,
    studentCount: 35,
    homeroomTeacher: "Phạm Văn D",
    averageGrade: 8.2,
  },
  {
    name: "10A2",
    grade: 10,
    studentCount: 33,
    homeroomTeacher: "Lê Văn K",
    averageGrade: 7.8,
  },
  {
    name: "11A1",
    grade: 11,
    studentCount: 32,
    homeroomTeacher: "Nguyễn Thị M",
    averageGrade: 8.0,
  },
  {
    name: "11A2",
    grade: 11,
    studentCount: 34,
    homeroomTeacher: "Trần Văn F",
    averageGrade: 8.5,
  },
  {
    name: "12A1",
    grade: 12,
    studentCount: 30,
    homeroomTeacher: "Nguyễn Văn H",
    averageGrade: 8.3,
  },
  {
    name: "12A2",
    grade: 12,
    studentCount: 31,
    homeroomTeacher: "Võ Thị N",
    averageGrade: 7.9,
  },
  {
    name: "12A3",
    grade: 12,
    studentCount: 29,
    homeroomTeacher: "Đặng Văn P",
    averageGrade: 8.1,
  },
];

export default function SchoolOverviewPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

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
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.homeroomTeacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm lớp học hoặc GVCN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Classes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((classInfo, index) => (
              <motion.div
                key={classInfo.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <GlassCard hover padding="lg" className="cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold">{classInfo.name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        Khối {classInfo.grade}
                      </Badge>
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${classInfo.homeroomTeacher}`}
                      />
                      <AvatarFallback>
                        {classInfo.homeroomTeacher
                          .split(" ")
                          .slice(-1)[0]
                          .charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="space-y-2 text-sm mb-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{classInfo.studentCount} học sinh</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>GVCN: {classInfo.homeroomTeacher}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Điểm TB
                      </span>
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
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

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
