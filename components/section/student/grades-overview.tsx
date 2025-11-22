// components/section/student/grades-overview.tsx
"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, TrendingUp, Award } from "lucide-react";
import { Grade } from "@/mork-data";

interface GradesOverviewProps {
  grades: Grade[];
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

  // Get subject with highest grade
  const topSubject = grades.reduce((prev, current) =>
    prev.average > current.average ? prev : current
  );

  // Count excellent grades (>= 8.0)
  const excellentCount = grades.filter((g) => g.average >= 8.0).length;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <span className="text-sm text-muted-foreground mb-1">/10</span>
              </div>
              <Progress value={overallAverage * 10} className="h-2" />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <GlassCard hover padding="md" className="h-full">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-lg bg-green-500/10">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">
                Môn học tốt nhất
              </p>
              <h3 className="text-xl font-bold mb-1">
                {topSubject.subjectName}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {topSubject.average.toFixed(1)} điểm
              </Badge>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <GlassCard hover padding="md" className="h-full">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <Award className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Môn giỏi</p>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold">{excellentCount}</h3>
                <span className="text-sm text-muted-foreground mb-1">
                  / {grades.length} môn
                </span>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
