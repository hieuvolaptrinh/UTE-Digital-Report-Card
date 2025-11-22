// components/section/student/grades-table.tsx
"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Grade } from "@/mork-data";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface GradesTableProps {
  grades: Grade[];
}

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

export function GradesTable({ grades }: GradesTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard padding="none">
        <div className="p-4 sm:p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold">Bảng điểm chi tiết</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Học kỳ {grades[0]?.semester} - Năm học {grades[0]?.academicYear}
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="font-semibold">Môn học</TableHead>
                <TableHead className="text-center font-semibold">
                  Miệng
                </TableHead>
                <TableHead className="text-center font-semibold">
                  15 phút
                </TableHead>
                <TableHead className="text-center font-semibold">
                  1 tiết
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Giữa kỳ
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Cuối kỳ
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Trung bình
                </TableHead>
                <TableHead className="font-semibold">Xếp loại</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade, index) => (
                <motion.tr
                  key={grade.subjectId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-white/10 hover:bg-white/5 dark:hover:bg-black/5"
                >
                  <TableCell className="font-medium">
                    <Link
                      href="/student/subject-detail"
                      className="flex items-center justify-between group"
                    >
                      <div>
                        <div className="group-hover:text-primary transition-colors">
                          {grade.subjectName}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          GV: {grade.teacherName}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {grade.scores.oral.join(", ")}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {grade.scores.test15min.join(", ")}
                  </TableCell>
                  <TableCell className="text-center text-sm">
                    {grade.scores.test45min.join(", ")}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {grade.scores.midterm}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {grade.scores.final}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`text-lg font-bold ${getGradeColor(
                        grade.average
                      )}`}
                    >
                      {grade.average.toFixed(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={grade.average >= 8.0 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {getGradeLabel(grade.average)}
                    </Badge>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </GlassCard>
    </motion.div>
  );
}
