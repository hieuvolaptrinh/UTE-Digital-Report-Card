// components/section/parent/child-detail-view.tsx
"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Grade } from "@/mork-data";
import { BookOpen, TrendingUp, Award, Calendar } from "lucide-react";

interface ChildDetailViewProps {
  childName: string;
  childClass: string;
  studentId: string;
  grades: Grade[];
}

export function ChildDetailView({
  childName,
  childClass,
  studentId,
  grades,
}: ChildDetailViewProps) {
  const overallAverage =
    grades.reduce((sum, grade) => sum + grade.average, 0) / grades.length;
  const topSubject = grades.reduce((prev, current) =>
    prev.average > current.average ? prev : current
  );
  const excellentCount = grades.filter((g) => g.average >= 8.0).length;

  return (
    <div className="space-y-6">
      {/* Student Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <GlassCard padding="md">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                {childName.split(" ").pop()?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{childName}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Lớp {childClass}
                </Badge>
                <Badge variant="outline">MSSV: {studentId}</Badge>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
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
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <GlassCard hover padding="md" className="h-full">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-orange-500/10">
                <Award className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">
                  Số môn giỏi
                </p>
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

      {/* Grades Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <GlassCard padding="md">
          <h3 className="text-lg font-semibold mb-4">Bảng điểm chi tiết</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-3 text-left font-semibold">Môn học</th>
                  <th className="p-3 text-center font-semibold">Miệng</th>
                  <th className="p-3 text-center font-semibold">15 phút</th>
                  <th className="p-3 text-center font-semibold">1 tiết</th>
                  <th className="p-3 text-center font-semibold">Giữa kỳ</th>
                  <th className="p-3 text-center font-semibold">Cuối kỳ</th>
                  <th className="p-3 text-center font-semibold">TB</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((grade, index) => (
                  <motion.tr
                    key={grade.subjectId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-white/10 hover:bg-white/5 dark:hover:bg-black/5"
                  >
                    <td className="p-3 font-medium">{grade.subjectName}</td>
                    <td className="p-3 text-center text-sm">
                      {grade.scores.oral.join(", ")}
                    </td>
                    <td className="p-3 text-center text-sm">
                      {grade.scores.test15min.join(", ")}
                    </td>
                    <td className="p-3 text-center text-sm">
                      {grade.scores.test45min.join(", ")}
                    </td>
                    <td className="p-3 text-center font-medium">
                      {grade.scores.midterm}
                    </td>
                    <td className="p-3 text-center font-medium">
                      {grade.scores.final}
                    </td>
                    <td className="p-3 text-center">
                      <Badge
                        variant={
                          grade.average >= 8
                            ? "default"
                            : grade.average >= 6.5
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {grade.average.toFixed(1)}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
