// components/section/teacher/grade-entry.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Save, Plus, X } from "lucide-react";
import { TeacherUser, mockClasses } from "@/mork-data";

interface GradeEntryProps {
  teacher: TeacherUser;
}

interface StudentGrade {
  studentId: string;
  studentName: string;
  oral: string[];
  test15min: string[];
  test45min: string[];
  midterm: string;
  final: string;
}

export function GradeEntry({ teacher }: GradeEntryProps) {
  const [selectedClass, setSelectedClass] = useState("");
  const [scoreType, setScoreType] = useState<
    "oral" | "test15min" | "test45min" | "midterm" | "final"
  >("oral");
  const [students, setStudents] = useState<StudentGrade[]>([
    {
      studentId: "2024001",
      studentName: "Nguyễn Văn A",
      oral: [],
      test15min: [],
      test45min: [],
      midterm: "",
      final: "",
    },
    {
      studentId: "2024002",
      studentName: "Trần Thị B",
      oral: [],
      test15min: [],
      test45min: [],
      midterm: "",
      final: "",
    },
    {
      studentId: "2024003",
      studentName: "Lê Văn C",
      oral: [],
      test15min: [],
      test45min: [],
      midterm: "",
      final: "",
    },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const teacherClasses = mockClasses.filter((c) =>
    teacher.classes.includes(c.id)
  );

  const handleScoreChange = (studentId: string, value: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentId === studentId) {
          if (
            scoreType === "oral" ||
            scoreType === "test15min" ||
            scoreType === "test45min"
          ) {
            return { ...s, [scoreType]: [...s[scoreType], value] };
          } else {
            return { ...s, [scoreType]: value };
          }
        }
        return s;
      })
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert("Đã lưu điểm thành công!");
    setIsSaving(false);
  };

  const scoreTypeLabels = {
    oral: "Điểm miệng",
    test15min: "Kiểm tra 15 phút",
    test45min: "Kiểm tra 1 tiết",
    midterm: "Giữa kỳ",
    final: "Cuối kỳ",
  };

  return (
    <GlassCard padding="md">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Nhập điểm</h3>
          <Badge variant="secondary">Môn: {teacher.subject}</Badge>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Chọn lớp</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn lớp học" />
              </SelectTrigger>
              <SelectContent>
                {teacherClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} ({cls.studentCount} học sinh)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Loại điểm</Label>
            <Select
              value={scoreType}
              onValueChange={(val: any) => setScoreType(val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(scoreTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selectedClass && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="border border-white/10 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="font-semibold">STT</TableHead>
                    <TableHead className="font-semibold">MSSV</TableHead>
                    <TableHead className="font-semibold">Họ và tên</TableHead>
                    <TableHead className="font-semibold text-center">
                      {scoreTypeLabels[scoreType]}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => (
                    <TableRow
                      key={student.studentId}
                      className="border-white/10"
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {student.studentId}
                      </TableCell>
                      <TableCell className="font-medium">
                        {student.studentName}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          {scoreType === "oral" ||
                          scoreType === "test15min" ||
                          scoreType === "test45min" ? (
                            <>
                              <div className="flex flex-wrap gap-1">
                                {student[scoreType].map((score, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {score}
                                    <button
                                      type="button"
                                      className="ml-1 hover:text-destructive"
                                      onClick={() => {
                                        setStudents((prev) =>
                                          prev.map((s) =>
                                            s.studentId === student.studentId
                                              ? {
                                                  ...s,
                                                  [scoreType]: s[
                                                    scoreType
                                                  ].filter((_, i) => i !== idx),
                                                }
                                              : s
                                          )
                                        );
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                              <Input
                                type="number"
                                min="0"
                                max="10"
                                step="0.5"
                                placeholder="0-10"
                                className="w-20 h-8 text-center"
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    const value = (e.target as HTMLInputElement)
                                      .value;
                                    if (value) {
                                      handleScoreChange(
                                        student.studentId,
                                        value
                                      );
                                      (e.target as HTMLInputElement).value = "";
                                    }
                                  }
                                }}
                              />
                            </>
                          ) : (
                            <Input
                              type="number"
                              min="0"
                              max="10"
                              step="0.5"
                              placeholder="0-10"
                              value={student[scoreType]}
                              onChange={(e) =>
                                handleScoreChange(
                                  student.studentId,
                                  e.target.value
                                )
                              }
                              className="w-24 h-8 text-center"
                            />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full"
                    />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Lưu điểm
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </GlassCard>
  );
}
