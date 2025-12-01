"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StudentSubjectGrade } from "@/mork-data";
import { Save, Plus, X, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StudentGradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  subject: string;
  initialGrades: StudentSubjectGrade | null;
  onSave: (grades: StudentSubjectGrade) => void;
}

export function StudentGradeDialog({
  open,
  onOpenChange,
  studentName,
  subject,
  initialGrades,
  onSave,
}: StudentGradeDialogProps) {
  const [grades, setGrades] = useState<StudentSubjectGrade | null>(null);

  // Reset data khi mở dialog
  useEffect(() => {
    if (open && initialGrades) {
      setGrades(JSON.parse(JSON.stringify(initialGrades)));
    }
  }, [open, initialGrades]);

  if (!grades) return null;

  const handleArrayScoreChange = (
    field: "oral" | "test15min" | "test45min",
    index: number,
    value: string
  ) => {
    const numVal = parseFloat(value);
    if (isNaN(numVal) && value !== "") return;
    if (numVal < 0 || numVal > 10) return;

    const newScores = [...grades[field]];
    if (value === "") {
    } else {
        newScores[index] = numVal;
    }
    setGrades({ ...grades, [field]: newScores });
  };

  const addScore = (field: "oral" | "test15min" | "test45min") => {
    setGrades({ ...grades, [field]: [...grades[field], 0] });
  };

  const removeScore = (field: "oral" | "test15min" | "test45min", index: number) => {
    const newScores = grades[field].filter((_, i) => i !== index);
    setGrades({ ...grades, [field]: newScores });
  };

  const handleSingleScoreChange = (field: "midterm" | "final", value: string) => {
    const numVal = parseFloat(value);
    if (value === "") {
        setGrades({ ...grades, [field]: null });
        return;
    }
    if (isNaN(numVal) || numVal < 0 || numVal > 10) return;
    setGrades({ ...grades, [field]: numVal });
  };

  const handleSave = () => {
    if (grades) {
      onSave(grades);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Nhập điểm: <span className="text-primary">{studentName}</span>
          </DialogTitle>
          <div className="text-sm text-muted-foreground">
            Môn học: <Badge variant="outline">{subject}</Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="grid gap-6 py-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Điểm Miệng (HS 1)</Label>
                <Button size="sm" variant="outline" onClick={() => addScore("oral")} className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Thêm cột
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                {grades.oral.map((score, index) => (
                  <div key={index} className="relative group">
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      className="w-16 h-10 text-center font-medium"
                      value={score}
                      onChange={(e) => handleArrayScoreChange("oral", index, e.target.value)}
                    />
                    <button 
                        onClick={() => removeScore("oral", index)}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                    >
                        <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {grades.oral.length === 0 && <span className="text-sm text-muted-foreground italic">Chưa có điểm</span>}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Kiểm tra 15 phút (HS 1)</Label>
                <Button size="sm" variant="outline" onClick={() => addScore("test15min")} className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Thêm cột
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                {grades.test15min.map((score, index) => (
                  <div key={index} className="relative group">
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      className="w-16 h-10 text-center font-medium border-blue-200 focus-visible:ring-blue-500"
                      value={score}
                      onChange={(e) => handleArrayScoreChange("test15min", index, e.target.value)}
                    />
                    <button 
                        onClick={() => removeScore("test15min", index)}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                    >
                        <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {grades.test15min.length === 0 && <span className="text-sm text-muted-foreground italic">Chưa có điểm</span>}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Kiểm tra 45 phút (HS 2)</Label>
                <Button size="sm" variant="outline" onClick={() => addScore("test45min")} className="h-7 text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Thêm cột
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                {grades.test45min.map((score, index) => (
                  <div key={index} className="relative group">
                    <Input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      className="w-16 h-10 text-center font-medium border-purple-200 focus-visible:ring-purple-500"
                      value={score}
                      onChange={(e) => handleArrayScoreChange("test45min", index, e.target.value)}
                    />
                    <button 
                        onClick={() => removeScore("test45min", index)}
                        className="absolute -top-2 -right-2 bg-red-100 text-red-600 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                    >
                        <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {grades.test45min.length === 0 && <span className="text-sm text-muted-foreground italic">Chưa có điểm</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t">
              <div className="space-y-3">
                <Label className="text-base font-semibold text-orange-600">Giữa kỳ (HS 2)</Label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  className="h-12 text-lg font-bold text-center border-orange-200 focus-visible:ring-orange-500"
                  value={grades.midterm ?? ""}
                  placeholder="--"
                  onChange={(e) => handleSingleScoreChange("midterm", e.target.value)}
                />
              </div>

              {/* Cuối kỳ */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-red-600">Cuối kỳ (HS 3)</Label>
                <Input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  className="h-12 text-lg font-bold text-center border-red-200 focus-visible:ring-red-500"
                  value={grades.final ?? ""}
                  placeholder="--"
                  onChange={(e) => handleSingleScoreChange("final", e.target.value)}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy bỏ
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            <Save className="h-4 w-4 mr-2" /> Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}