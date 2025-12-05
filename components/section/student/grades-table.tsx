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
import { Check, Info } from "lucide-react";

// --- CẤU HÌNH GIAI ĐOẠN ---
const MOCK_CONFIG = {
  isCurrentSemester: true,
  // 'midterm': Đang giữa kỳ (Ẩn điểm CK, TB, Xếp loại)
  // 'final': Đã có điểm CK (Hiện tất cả)
  phase: "midterm" as "midterm" | "final" | "closed",
};

// --- ĐIỂM ĐÃ GỬI YÊU CẦU SỬA (HARD CODE) ---
// Format: "subjectId-type-index"
const SUBMITTED_REQUESTS = new Set([
  "TOAN-Miệng-0", // Toán: Điểm miệng đầu tiên (8 điểm) - Đã duyệt
  "TOAN-15 phút-1", // Toán: Điểm 15 phút thứ 2 (9 điểm) - Đã duyệt
  "LY-Giữa kỳ-0", // Vật lý: Điểm giữa kỳ (8.5 điểm) - Đã duyệt
]);

// --- ĐIỂM BỊ TỪ CHỐI YÊU CẦU SỬA (HARD CODE) ---
const REJECTED_REQUESTS = new Set([
  "HOA-1 tiết-0", // Hóa học: Điểm 1 tiết đầu tiên (7 điểm) - Bị từ chối
  "VAN-Miệng-2", // Văn: Điểm miệng thứ 3 (7.5 điểm) - Bị từ chối
]);

import { ScoreItem } from "./grade-edit-request-popup";

interface GradesTableProps {
  grades: Grade[];
  selectedScores?: ScoreItem[];
  onScoreSelect?: (scores: ScoreItem[]) => void;
}

// Logic kiểm tra cột được phép sửa
const isColumnEditable = (colType: "sub" | "mid" | "final") => {
  if (!MOCK_CONFIG.isCurrentSemester) return false;
  switch (MOCK_CONFIG.phase) {
    case "midterm":
      return colType === "sub" || colType === "mid";
    case "final":
      return colType === "final";
    default:
      return false;
  }
};

const getPhaseMessage = () => {
  if (!MOCK_CONFIG.isCurrentSemester) return "Học kỳ đã kết thúc.";
  switch (MOCK_CONFIG.phase) {
    case "midterm":
      return "Đang trong giao đoạn phúc khảo giữa kì";
    case "final":
      return "Giai đoạn Cuối kỳ: Đang mở cổng phúc khảo điểm Cuối kỳ.";
    default:
      return "Hệ thống chưa mở đợt phúc khảo.";
  }
};

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

export function GradesTable({
  grades,
  selectedScores = [],
  onScoreSelect,
}: GradesTableProps) {
  const toggleScore = (
    subjectId: string,
    subjectName: string,
    teacherName: string,
    type: string,
    value: string,
    index: number
  ) => {
    if (!onScoreSelect) return;

    const uniqueId = `${subjectId}-${type}-${index}`;

    // Kiểm tra xem điểm này đã gửi yêu cầu chưa hoặc bị từ chối
    if (SUBMITTED_REQUESTS.has(uniqueId) || REJECTED_REQUESTS.has(uniqueId)) {
      return; // Không cho phép chọn nếu đã gửi yêu cầu hoặc bị từ chối
    }

    const isSelected = selectedScores.some((s) => s.id === uniqueId);
    if (isSelected) {
      onScoreSelect(selectedScores.filter((s) => s.id !== uniqueId));
    } else {
      const scoreItem: ScoreItem = {
        id: uniqueId,
        type: type.includes("Miệng")
          ? "oral"
          : type.includes("15")
          ? "test15min"
          : type.includes("1 tiết")
          ? "test45min"
          : type.includes("Giữa kỳ")
          ? "midterm"
          : "final",
        label: `${subjectName} - ${type}`,
        value: parseFloat(value),
        subjectId,
        subjectName,
      };
      onScoreSelect([...selectedScores, scoreItem]);
    }
  };
  const ScoreCell = ({
    grade,
    type,
    rawScores,
    editable,
    isFinalExamColumn = false,
  }: {
    grade: Grade;
    type: string;
    rawScores: string | number | (string | number)[];
    editable: boolean;
    isFinalExamColumn?: boolean;
  }) => {
    if (MOCK_CONFIG.phase === "midterm" && isFinalExamColumn) {
      return (
        <div className="flex justify-center items-center h-full">
          <span className="text-gray-300 dark:text-gray-700 font-medium select-none text-lg">
            --
          </span>
        </div>
      );
    }

    let scoresArray: string[] = [];
    if (Array.isArray(rawScores)) {
      scoresArray = rawScores.map((s) => String(s));
    } else {
      const stringVal = String(rawScores);
      scoresArray = stringVal.includes(",")
        ? stringVal.split(",").map((s) => s.trim())
        : [stringVal];
    }

    if (!editable) {
      return (
        <div className="flex justify-center items-center h-full">
          <span className="text-gray-400 dark:text-gray-600 cursor-default text-sm">
            {scoresArray.join(", ")}
          </span>
        </div>
      );
    }

    return (
      <div className="flex flex-wrap justify-center gap-1.5 min-w-20">
        {scoresArray.map((score, idx) => {
          const uniqueId = `${grade.subjectId}-${type}-${idx}`;
          const isSelected = selectedScores.some((s) => s.id === uniqueId);
          const isSubmitted = SUBMITTED_REQUESTS.has(uniqueId);
          const isRejected = REJECTED_REQUESTS.has(uniqueId);

          return (
            <button
              key={uniqueId}
              onClick={() =>
                toggleScore(
                  grade.subjectId,
                  grade.subjectName,
                  grade.teacherName,
                  type,
                  score,
                  idx
                )
              }
              disabled={isSubmitted || isRejected}
              className={`
                relative px-2.5 py-1 min-w-9 rounded-md text-sm font-bold transition-all duration-200 border
                ${
                  isSubmitted
                    ? "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 border-green-300 dark:border-green-700 cursor-not-allowed opacity-70"
                    : isRejected
                    ? "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 cursor-not-allowed opacity-70"
                    : isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-md scale-110 z-10"
                    : "bg-white dark:bg-zinc-800 text-blue-600 border-blue-200 dark:border-blue-900 hover:border-blue-500 hover:shadow-sm"
                }
              `}
            >
              {score}
              {isSelected && !isSubmitted && !isRejected && (
                <div className="absolute -top-1.5 -right-1.5 bg-white text-blue-600 rounded-full p-0.5 shadow-sm border border-gray-100">
                  <Check className="w-2.5 h-2.5 stroke-3" />
                </div>
              )}
              {isSubmitted && (
                <div className="absolute -top-1.5 -right-1.5 bg-green-600 text-white rounded-full p-0.5 shadow-sm">
                  <Check className="w-2.5 h-2.5 stroke-3" />
                </div>
              )}
              {isRejected && (
                <div className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 shadow-sm">
                  <svg
                    className="w-2.5 h-2.5 stroke-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex justify-center w-full px-4 sm:px-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl"
      >
        <GlassCard padding="none">
          <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-blue-50/50 dark:bg-blue-900/10">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Bảng điểm chi tiết
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                <Info className="w-4 h-4" />
                {getPhaseMessage()}
              </div>
            </div>
          </div>

          {/* TABLE CONTENT */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="font-semibold min-w-[180px]">
                    Môn học
                  </TableHead>
                  <TableHead
                    className={`text-center font-semibold ${
                      isColumnEditable("sub")
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    Miệng
                  </TableHead>
                  <TableHead
                    className={`text-center font-semibold ${
                      isColumnEditable("sub")
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    15 phút
                  </TableHead>
                  <TableHead
                    className={`text-center font-semibold ${
                      isColumnEditable("sub")
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    1 tiết
                  </TableHead>
                  <TableHead
                    className={`text-center font-semibold ${
                      isColumnEditable("mid")
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    Giữa kỳ
                  </TableHead>
                  <TableHead
                    className={`text-center font-semibold ${
                      isColumnEditable("final")
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    Cuối kỳ
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-800 dark:text-gray-200">
                    Trung bình
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Xếp loại
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((grade, index) => (
                  <motion.tr
                    key={`${grade.studentId}-${grade.subjectId}-${grade.semester}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-white/10 hover:bg-white/5 dark:hover:bg-black/5"
                  >
                    <TableCell className="font-medium py-4">
                      <Link
                        href="/student/subject-detail"
                        className="flex items-center justify-between group"
                      >
                        <div>
                          <div className="group-hover:text-primary transition-colors font-semibold">
                            {grade.subjectName}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            GV: {grade.teacherName}
                          </div>
                        </div>
                      </Link>
                    </TableCell>

                    <TableCell className="text-center">
                      <ScoreCell
                        grade={grade}
                        type="Miệng"
                        rawScores={grade.scores.oral}
                        editable={isColumnEditable("sub")}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <ScoreCell
                        grade={grade}
                        type="15 phút"
                        rawScores={grade.scores.test15min}
                        editable={isColumnEditable("sub")}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <ScoreCell
                        grade={grade}
                        type="1 tiết"
                        rawScores={grade.scores.test45min}
                        editable={isColumnEditable("sub")}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <ScoreCell
                        grade={grade}
                        type="Giữa kỳ"
                        rawScores={grade.scores.midterm}
                        editable={isColumnEditable("mid")}
                      />
                    </TableCell>

                    <TableCell className="text-center">
                      <ScoreCell
                        grade={grade}
                        type="Cuối kỳ"
                        rawScores={grade.scores.final}
                        editable={isColumnEditable("final")}
                        isFinalExamColumn={true}
                      />
                    </TableCell>

                    <TableCell className="text-center">
                      {MOCK_CONFIG.phase === "midterm" ? (
                        <span className="text-gray-300 dark:text-gray-700 text-lg font-medium">
                          --
                        </span>
                      ) : (
                        <span
                          className={`text-lg font-bold ${getGradeColor(
                            grade.average
                          )}`}
                        >
                          {grade.average.toFixed(1)}
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {MOCK_CONFIG.phase === "midterm" ? (
                        <span className="text-gray-300 dark:text-gray-700 text-sm">
                          --
                        </span>
                      ) : (
                        <Badge
                          variant={
                            grade.average >= 8.0 ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {getGradeLabel(grade.average)}
                        </Badge>
                      )}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
