"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Save,
  Upload,
  RotateCcw,
  FileSpreadsheet,
} from "lucide-react";
import Link from "next/link";
import {
  getStudentDetailsByClass,
  getGradesByClassAndSubject,
} from "@/mork-data";
import { cn } from "@/lib/utils";

export default function EnterGradesPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  // Luôn sử dụng lớp 10A1
  const className = "10A1";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const students = getStudentDetailsByClass(className);
  const subjectName = "Toán học";

  const [gradesData, setGradesData] = useState<
    {
      studentId: string;
      oral: (number | null)[];
      test15min: (number | null)[];
      test45min: (number | null)[];
      midterm: number | null;
      final: number | null;
    }[]
  >([]);
  const [isSaving, setIsSaving] = useState(false);

  // Track original grades to detect changes
  const [originalGrades, setOriginalGrades] = useState<
    {
      studentId: string;
      oral: (number | null)[];
      test15min: (number | null)[];
      test45min: (number | null)[];
      midterm: number | null;
      final: number | null;
    }[]
  >([]);

  // Track modified cells
  const [modifiedCells, setModifiedCells] = useState<Set<string>>(new Set());

  // Edit request dialog
  const [showEditRequestDialog, setShowEditRequestDialog] = useState(false);
  const [editReason, setEditReason] = useState("");

  useEffect(() => {
    if (user && isTeacher(user)) {
      const initialGrades = getGradesByClassAndSubject(className, subjectName);
      const gradesCopy = JSON.parse(JSON.stringify(initialGrades));
      setGradesData(gradesCopy);
      setOriginalGrades(JSON.parse(JSON.stringify(initialGrades)));
    }
  }, [user, className]);

  useEffect(() => {
    if (!isLoading && (!user || !isTeacher(user))) router.push("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user || !isTeacher(user)) return null;

  const headerUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role as "teacher" | "academic-officer" | "principal",
  };

  // --- LOGIC TÍNH TOÁN ---
  const calculateTempAverage = (grade: {
    oral: (number | null)[];
    test15min: (number | null)[];
    test45min: (number | null)[];
    midterm: number | null;
    final: number | null;
  }) => {
    let total = 0;
    let weight = 0;

    const sumArray = (arr: (number | null)[], coeff: number) => {
      arr.forEach((s) => {
        if (s !== null && s !== undefined) {
          total += s * coeff;
          weight += coeff;
        }
      });
    };

    if (grade.oral) sumArray(grade.oral, 1);
    if (grade.test15min) sumArray(grade.test15min, 1);
    if (grade.test45min) sumArray(grade.test45min, 2);

    if (grade.midterm !== null) {
      total += grade.midterm * 2;
      weight += 2;
    }
    if (grade.final !== null) {
      total += grade.final * 3;
      weight += 3;
    }
    return weight > 0 ? (total / weight).toFixed(1) : "-";
  };

  const getCellKey = (
    studentId: string,
    field: string,
    index: number | null
  ) => {
    return `${studentId}-${field}-${index}`;
  };

  const handleGradeChange = (
    studentId: string,
    field: string,
    index: number | null,
    value: string
  ) => {
    // Cho phép nhập các ký tự số và dấu chấm
    if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;

    const numVal = parseFloat(value);
    // Chỉ validate khi người dùng đã nhập xong (có giá trị hoàn chỉnh)
    if (
      value !== "" &&
      value !== "." &&
      !isNaN(numVal) &&
      (numVal < 0 || numVal > 10)
    )
      return;

    // Check if this is modifying an existing grade
    const originalGrade = originalGrades.find((g) => g.studentId === studentId);
    if (originalGrade) {
      let originalValue: number | null = null;

      if (index !== null) {
        if (field === "oral") originalValue = originalGrade.oral[index] ?? null;
        else if (field === "test15min")
          originalValue = originalGrade.test15min[index] ?? null;
        else if (field === "test45min")
          originalValue = originalGrade.test45min[index] ?? null;
      } else {
        if (field === "midterm") originalValue = originalGrade.midterm;
        else if (field === "final") originalValue = originalGrade.final;
      }

      const newValue = value === "" ? null : numVal;
      const cellKey = getCellKey(studentId, field, index);

      // If original had a value and we're changing it, mark as modified
      if (originalValue !== null && originalValue !== newValue) {
        setModifiedCells((prev) => new Set(prev).add(cellKey));
      } else if (originalValue === newValue) {
        setModifiedCells((prev) => {
          const newSet = new Set(prev);
          newSet.delete(cellKey);
          return newSet;
        });
      }
    }

    setGradesData((prev) =>
      prev.map((g) => {
        if (g.studentId !== studentId) return g;
        const newGrade = { ...g };
        if (index !== null) {
          // Xử lý cho các trường array (oral, test15min, test45min)
          if (field === "oral") {
            const newArr = [...newGrade.oral];
            newArr[index] = value === "" ? null : numVal;
            newGrade.oral = newArr;
          } else if (field === "test15min") {
            const newArr = [...newGrade.test15min];
            newArr[index] = value === "" ? null : numVal;
            newGrade.test15min = newArr;
          } else if (field === "test45min") {
            const newArr = [...newGrade.test45min];
            newArr[index] = value === "" ? null : numVal;
            newGrade.test45min = newArr;
          }
        } else {
          // Xử lý cho midterm và final
          if (field === "midterm") {
            newGrade.midterm = value === "" ? null : numVal;
          } else if (field === "final") {
            newGrade.final = value === "" ? null : numVal;
          }
        }
        return newGrade;
      })
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert(`Đã lưu bảng điểm thành công!`);
    }, 1000);
  };

  const handleSubmitEditRequest = () => {
    if (!editReason.trim()) {
      alert("Vui lòng nhập lý do sửa điểm!");
      return;
    }

    console.log("Gửi yêu cầu sửa điểm:", {
      modifiedCells: Array.from(modifiedCells),
      reason: editReason,
      changes: gradesData,
    });

    alert(`Đã gửi yêu cầu sửa điểm thành công!\nLý do: ${editReason}`);
    setShowEditRequestDialog(false);
    setEditReason("");
    setModifiedCells(new Set());
  };

  // --- COMPONENTS ---
  const GradeCell = ({
    studentId,
    field,
    index,
    value,
    classNameInput,
  }: {
    studentId: string;
    field: string;
    index: number | null;
    value: number | null;
    classNameInput?: string;
  }) => {
    const cellKey = getCellKey(studentId, field, index);
    const isModified = modifiedCells.has(cellKey);

    return (
      <Input
        type="text"
        inputMode="decimal"
        className={cn(
          "p-0 text-center text-sm transition-all duration-150",
          classNameInput,
          isModified && "bg-yellow-100 border-yellow-400 ring-2 ring-yellow-300"
        )}
        value={value ?? ""}
        onChange={(e) =>
          handleGradeChange(studentId, field, index, e.target.value)
        }
        placeholder="-"
      />
    );
  };

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-28">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Link href={`/teacher/class/${className}`}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-black/5"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  Nhập điểm: Lớp {className}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant="outline"
                    className="bg-white gap-1 font-normal"
                  >
                    <FileSpreadsheet className="h-3 w-3" /> {subjectName}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    console.log("File selected:", e.target.files[0].name);
                    // Xử lý file Excel ở đây
                  }
                }}
              />
              <Button
                variant="outline"
                className="gap-2 bg-white"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" /> Import Excel
              </Button>

              {modifiedCells.size > 0 && (
                <Button
                  variant="outline"
                  className="gap-2 bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  onClick={() => setShowEditRequestDialog(true)}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  Gửi yêu cầu sửa điểm ({modifiedCells.size})
                </Button>
              )}

              <Button
                className="gap-2 min-w-[120px] bg-primary hover:bg-primary/90 text-white"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <RotateCcw className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}{" "}
                Lưu điểm
              </Button>
            </div>
          </div>

          <GlassCard className="overflow-hidden min-h-[500px] mb-10 shadow-xl border-t border-white/50">
            <div className="overflow-x-auto pb-4">
              <Table>
                <TableHeader className="bg-muted/30 sticky top-0 z-20 shadow-sm backdrop-blur-xl">
                  <TableRow>
                    <TableHead className="w-[50px] text-center bg-gray-50/90 backdrop-blur">
                      STT
                    </TableHead>
                    <TableHead className="w-[200px] min-w-[180px] bg-gray-50/90 backdrop-blur">
                      Họ và tên
                    </TableHead>

                    <TableHead className="text-center min-w-[140px] bg-gray-50/90 backdrop-blur p-2">
                      <span className="font-semibold text-gray-700">
                        Miệng (HS1)
                      </span>
                    </TableHead>

                    <TableHead className="text-center min-w-[140px] bg-gray-50/90 backdrop-blur p-2">
                      <span className="font-semibold text-gray-700">
                        15 Phút (HS1)
                      </span>
                    </TableHead>

                    <TableHead className="text-center min-w-[140px] bg-gray-50/90 backdrop-blur p-2">
                      <span className="font-semibold text-gray-700">
                        1 Tiết (HS2)
                      </span>
                    </TableHead>

                    <TableHead className="text-center w-[100px] bg-gray-50/90 backdrop-blur text-orange-700 font-semibold p-2">
                      <span>Giữa kỳ</span>
                    </TableHead>

                    <TableHead className="text-center w-[100px] bg-gray-50/90 backdrop-blur text-red-700 font-semibold p-2">
                      <span>Cuối kỳ</span>
                    </TableHead>

                    <TableHead className="text-center w-20 bg-gray-50/90 backdrop-blur text-primary font-bold">
                      TBM
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => {
                    const grade = gradesData.find(
                      (g) => g.studentId === student.studentId
                    ) || {
                      oral: [],
                      test15min: [],
                      test45min: [],
                      midterm: null,
                      final: null,
                    };
                    const avg = calculateTempAverage(grade);

                    return (
                      <TableRow
                        key={student.studentId}
                        className="hover:bg-muted/10 group"
                      >
                        <TableCell className="text-center text-muted-foreground font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {student.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {student.studentId}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-1 justify-center">
                            {[0, 1, 2].map((i) => (
                              <div key={i} className="w-10">
                                <GradeCell
                                  studentId={student.studentId}
                                  field="oral"
                                  index={i}
                                  value={grade.oral[i]}
                                  classNameInput="h-9 focus-visible:ring-1 focus-visible:border-primary"
                                />
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-center">
                            {[0, 1, 2].map((i) => (
                              <div key={i} className="w-10">
                                <GradeCell
                                  studentId={student.studentId}
                                  field="test15min"
                                  index={i}
                                  value={grade.test15min[i]}
                                  classNameInput="h-9 border-blue-200 focus-visible:ring-blue-500 bg-blue-50/30 focus:bg-white"
                                />
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-center">
                            {[0, 1].map((i) => (
                              <div key={i} className="w-10">
                                <GradeCell
                                  studentId={student.studentId}
                                  field="test45min"
                                  index={i}
                                  value={grade.test45min[i]}
                                  classNameInput="h-9 border-purple-200 focus-visible:ring-purple-500 bg-purple-50/30 focus:bg-white"
                                />
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center w-14 mx-auto">
                            <GradeCell
                              studentId={student.studentId}
                              field="midterm"
                              index={null}
                              value={grade.midterm}
                              classNameInput="h-10 font-bold text-orange-600 border-orange-200 focus-visible:ring-orange-500 bg-orange-50/30 focus:bg-white"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center w-14 mx-auto">
                            <GradeCell
                              studentId={student.studentId}
                              field="final"
                              index={null}
                              value={grade.final}
                              classNameInput="h-10 font-bold text-red-600 border-red-200 focus-visible:ring-red-500 bg-red-50/30 focus:bg-white"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-bold text-primary text-base">
                          {avg}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </GlassCard>
        </div>
      </main>

      {/* Dialog yêu cầu sửa điểm */}
      <Dialog
        open={showEditRequestDialog}
        onOpenChange={setShowEditRequestDialog}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Gửi yêu cầu sửa điểm</DialogTitle>
            <DialogDescription>
              Bạn đã chỉnh sửa {modifiedCells.size} ô điểm. Vui lòng nhập lý do
              để gửi yêu cầu sửa điểm.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Lý do sửa điểm <span className="text-red-500">*</span>
              </label>
              <Textarea
                placeholder="Ví dụ: Nhập nhầm điểm, cần cập nhật điểm sau khi chấm lại bài kiểm tra..."
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="text-sm text-muted-foreground bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="font-medium text-yellow-800 mb-1">Lưu ý:</p>
              <ul className="list-disc list-inside space-y-1 text-yellow-700">
                <li>Yêu cầu sẽ được gửi đến cán bộ giáo vụ để phê duyệt</li>
                <li>Các ô điểm đã sửa sẽ được đánh dấu màu vàng</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEditRequestDialog(false);
                setEditReason("");
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmitEditRequest}
              disabled={!editReason.trim()}
            >
              Gửi yêu cầu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
