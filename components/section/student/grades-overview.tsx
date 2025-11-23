// components/section/student/grades-overview.tsx
"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  TrendingUp,
  Award,
  Star,
  Trophy,
  MessageSquare,
} from "lucide-react";
import { Grade } from "@/mork-data";

interface GradesOverviewProps {
  grades: Grade[];
}

// Helper function to determine academic performance level
function getAcademicPerformance(average: number): {
  label: string;
  color: string;
} {
  if (average >= 9.0) return { label: "Xuất sắc", color: "text-purple-600" };
  if (average >= 8.0) return { label: "Giỏi", color: "text-blue-600" };
  if (average >= 6.5) return { label: "Khá", color: "text-green-600" };
  if (average >= 5.0) return { label: "Trung bình", color: "text-yellow-600" };
  return { label: "Yếu", color: "text-red-600" };
}

export function GradesOverview({ grades }: GradesOverviewProps) {
  // 🛡️ FIX — Không có điểm → show UI thay vì crash
  if (!grades || grades.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Chưa có dữ liệu điểm để hiển thị.
      </div>
    );
  }

  // Calculate overall average
  const overallAverage =
    grades.reduce((sum, grade) => sum + grade.average, 0) / grades.length;

  // Get academic performance
  const academicPerformance = getAcademicPerformance(overallAverage);

  // Hard-coded data as requested
  const conduct = "Tốt"; // Hạnh kiểm
  const classRank = 2; // Xếp hạng trong lớp
  const totalStudents = 35; // Tổng số học sinh
  const teacherComment =
    "Em là học sinh chăm chỉ, có ý thức học tập cao. Cần duy trì tinh thần học tập và phát huy thêm khả năng làm việc nhóm."; // Nhận xét GVCN

  // Get subject with highest grade
  const topSubject = grades.reduce((prev, current) =>
    prev.average > current.average ? prev : current
  );

  // Count excellent grades (>= 8.0)
  const excellentCount = grades.filter((g) => g.average >= 8.0).length;

  return (
    <div className="space-y-4 mb-6">
      {/* Main Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Điểm trung bình */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <GlassCard hover padding="md" className="h-full">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">
                  Điểm trung bình
                </p>
                <div className="flex items-end gap-2 mb-2">
                  <h3 className="text-3xl font-bold">
                    {overallAverage.toFixed(2)}
                  </h3>
                  <span className="text-sm text-muted-foreground mb-1">
                    /10
                  </span>
                </div>
                <Progress value={overallAverage * 10} className="h-2" />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Học lực */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <GlassCard hover padding="md" className="h-full">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Học lực</p>
                <h3
                  className={`text-2xl font-bold ${academicPerformance.color}`}
                >
                  {academicPerformance.label}
                </h3>
                <Badge variant="secondary" className="text-xs mt-2">
                  {overallAverage.toFixed(1)} điểm
                </Badge>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Hạnh kiểm */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <GlassCard hover padding="md" className="h-full">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Star className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Hạnh kiểm</p>
                <h3 className="text-2xl font-bold text-green-600">{conduct}</h3>
                <p className="text-xs text-muted-foreground mt-2">
                  Đánh giá chung
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Xếp hạng */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <GlassCard hover padding="md" className="h-full">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <Trophy className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">
                  Xếp hạng lớp
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-orange-600">
                    #{classRank}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    / {totalStudents}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs mt-2">
                  Top {Math.round((classRank / totalStudents) * 100)}%
                </Badge>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Môn học tốt nhất */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <GlassCard hover padding="md" className="h-full">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Award className="h-5 w-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">
                  Môn học tốt nhất
                </p>
                <h3 className="text-xl font-bold mb-1">
                  {topSubject.subjectName}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {topSubject.average.toFixed(1)} điểm
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {excellentCount} / {grades.length} môn giỏi
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Nhận xét giáo viên chủ nhiệm */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <GlassCard hover padding="md" className="h-full">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-indigo-500/10">
                <MessageSquare className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">
                  Nhận xét GVCN
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {teacherComment}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
