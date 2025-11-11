"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStudentDetailsByClass, mockGrades } from "@/mork-data";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle2 } from "lucide-react";

interface StudentGrade {
  studentId: string;
  studentName: string;
  oral: number | "";
  test15min: number | "";
  test45min: number | "";
  midterm: number | "";
  final: number | "";
}

export default function ClassDetailPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const className = decodeURIComponent(params.className as string);

  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isTeacher(user))) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const classStudents = getStudentDetailsByClass(className);
    const gradesData: StudentGrade[] = classStudents.map((student) => {
      const studentGrades = mockGrades.find(
        (g) => g.studentId === student.studentId
      );

      return {
        studentId: student.studentId,
        studentName: student.name,
        oral: (studentGrades?.scores.oral[0] ?? "") as number | "",
        test15min: (studentGrades?.scores.test15min[0] ?? "") as number | "",
        test45min: (studentGrades?.scores.test45min[0] ?? "") as number | "",
        midterm: (studentGrades?.scores.midterm ?? "") as number | "",
        final: (studentGrades?.scores.final ?? "") as number | "",
      };
    });

    setStudents(gradesData);
  }, [className]);

  const handleGradeChange = (
    studentId: string,
    type: keyof Omit<StudentGrade, "studentId" | "studentName">,
    value: string
  ) => {
    const numValue = value === "" ? "" : parseFloat(value);
    if (
      value !== "" &&
      typeof numValue === "number" &&
      (isNaN(numValue) || numValue < 0 || numValue > 10)
    ) {
      return;
    }

    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === studentId ? { ...s, [type]: numValue } : s
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const calculateAverage = (student: StudentGrade): string => {
    const grades = [
      student.oral,
      student.test15min,
      student.test45min,
      student.midterm,
      student.final,
    ].filter((g) => g !== "") as number[];

    if (grades.length === 0) return "-";

    // Weighted average: oral x1, test15 x1, test45 x2, midterm x2, final x3
    let sum = 0;
    let weight = 0;

    if (student.oral !== "") {
      sum += (student.oral as number) * 1;
      weight += 1;
    }
    if (student.test15min !== "") {
      sum += (student.test15min as number) * 1;
      weight += 1;
    }
    if (student.test45min !== "") {
      sum += (student.test45min as number) * 2;
      weight += 2;
    }
    if (student.midterm !== "") {
      sum += (student.midterm as number) * 2;
      weight += 2;
    }
    if (student.final !== "") {
      sum += (student.final as number) * 3;
      weight += 3;
    }

    return weight > 0 ? (sum / weight).toFixed(1) : "-";
  };

  if (isLoading || !user || !isTeacher(user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Header
        user={{
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role as any,
        }}
        onLogout={logout}
      />
      <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/teacher/class">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách lớp
              </Button>
            </Link>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Lớp {className}</h1>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{user.subject}</Badge>
                  <span className="text-muted-foreground">
                    {students.length} học sinh
                  </span>
                </div>
              </div>
              <Button onClick={handleSave} disabled={saving || saved} size="lg">
                {saving ? (
                  "Đang lưu..."
                ) : saved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Đã lưu
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu điểm
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-semibold w-12">STT</TableHead>
                      <TableHead className="font-semibold min-w-[200px]">
                        Họ và tên
                      </TableHead>
                      <TableHead className="font-semibold text-center w-24">
                        Miệng
                      </TableHead>
                      <TableHead className="font-semibold text-center w-24">
                        15 phút
                      </TableHead>
                      <TableHead className="font-semibold text-center w-24">
                        1 tiết
                      </TableHead>
                      <TableHead className="font-semibold text-center w-24">
                        Giữa kỳ
                      </TableHead>
                      <TableHead className="font-semibold text-center w-24">
                        Cuối kỳ
                      </TableHead>
                      <TableHead className="font-semibold text-center w-24">
                        TB
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => (
                      <TableRow key={student.studentId}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {student.studentName}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={student.oral}
                            onChange={(e) =>
                              handleGradeChange(
                                student.studentId,
                                "oral",
                                e.target.value
                              )
                            }
                            className="text-center"
                            placeholder="-"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={student.test15min}
                            onChange={(e) =>
                              handleGradeChange(
                                student.studentId,
                                "test15min",
                                e.target.value
                              )
                            }
                            className="text-center"
                            placeholder="-"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={student.test45min}
                            onChange={(e) =>
                              handleGradeChange(
                                student.studentId,
                                "test45min",
                                e.target.value
                              )
                            }
                            className="text-center"
                            placeholder="-"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={student.midterm}
                            onChange={(e) =>
                              handleGradeChange(
                                student.studentId,
                                "midterm",
                                e.target.value
                              )
                            }
                            className="text-center"
                            placeholder="-"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="10"
                            step="0.1"
                            value={student.final}
                            onChange={(e) =>
                              handleGradeChange(
                                student.studentId,
                                "final",
                                e.target.value
                              )
                            }
                            className="text-center"
                            placeholder="-"
                          />
                        </TableCell>
                        <TableCell className="text-center font-semibold text-primary">
                          {calculateAverage(student)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {students.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                  Chưa có học sinh trong lớp này
                </div>
              )}
            </GlassCard>

            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-2">Hướng dẫn nhập điểm:</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Nhập điểm từ 0 đến 10, có thể nhập số thập phân</li>
                <li>
                  Điểm trung bình được tính theo hệ số: Miệng (x1), 15 phút
                  (x1), 1 tiết (x2), Giữa kỳ (x2), Cuối kỳ (x3)
                </li>
                <li>Bỏ trống nếu chưa có điểm</li>
                <li>Nhấn &ldquo;Lưu điểm&rdquo; để lưu thay đổi</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
