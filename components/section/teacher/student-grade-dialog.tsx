// components/section/teacher/student-grade-dialog.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BookOpen, Plus, X, TrendingUp } from "lucide-react";
import type { StudentSubjectGrade } from "@/mork-data/students";

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
  const [oral, setOral] = useState<number[]>([]);
  const [test15min, setTest15min] = useState<number[]>([]);
  const [test45min, setTest45min] = useState<number[]>([]);
  const [midterm, setMidterm] = useState<string>("");
  const [final, setFinal] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [editReason, setEditReason] = useState("");
  const [showEditRequest, setShowEditRequest] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  // Initialize from initialGrades when dialog opens
  useEffect(() => {
    if (!open) return;

    const resetGrades = () => {
      if (initialGrades) {
        setOral(initialGrades.oral || []);
        setTest15min(initialGrades.test15min || []);
        setTest45min(initialGrades.test45min || []);
        setMidterm(initialGrades.midterm?.toString() || "");
        setFinal(initialGrades.final?.toString() || "");
      } else {
        setOral([]);
        setTest15min([]);
        setTest45min([]);
        setMidterm("");
        setFinal("");
      }
    };

    resetGrades();
  }, [open, initialGrades]);

  const calculateAverage = (): number => {
    const oralAvg =
      oral.length > 0 ? oral.reduce((a, b) => a + b, 0) / oral.length : 0;
    const test15Avg =
      test15min.length > 0
        ? test15min.reduce((a, b) => a + b, 0) / test15min.length
        : 0;
    const test45Avg =
      test45min.length > 0
        ? test45min.reduce((a, b) => a + b, 0) / test45min.length
        : 0;
    const midtermScore = midterm ? parseFloat(midterm) : 0;
    const finalScore = final ? parseFloat(final) : 0;

    let sum = 0;
    let weight = 0;

    if (oral.length > 0) {
      sum += oralAvg * 1;
      weight += 1;
    }
    if (test15min.length > 0) {
      sum += test15Avg * 1;
      weight += 1;
    }
    if (test45min.length > 0) {
      sum += test45Avg * 2;
      weight += 2;
    }
    if (midterm) {
      sum += midtermScore * 2;
      weight += 2;
    }
    if (final) {
      sum += finalScore * 3;
      weight += 3;
    }

    return weight > 0 ? parseFloat((sum / weight).toFixed(2)) : 0;
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const gradeData: StudentSubjectGrade = {
      studentId: initialGrades?.studentId || "",
      subjectId: initialGrades?.subjectId || "",
      subjectName: subject,
      oral,
      test15min,
      test45min,
      midterm: midterm ? parseFloat(midterm) : null,
      final: final ? parseFloat(final) : null,
      average: calculateAverage(),
    };

    onSave(gradeData);
    setSaving(false);
  };

  const addScore = (type: "oral" | "test15min" | "test45min") => {
    if (type === "oral") setOral([...oral, 0]);
    else if (type === "test15min") setTest15min([...test15min, 0]);
    else setTest45min([...test45min, 0]);
  };

  const removeScore = (
    type: "oral" | "test15min" | "test45min",
    index: number
  ) => {
    if (type === "oral") setOral(oral.filter((_, i) => i !== index));
    else if (type === "test15min")
      setTest15min(test15min.filter((_, i) => i !== index));
    else setTest45min(test45min.filter((_, i) => i !== index));
  };

  const updateScore = (
    type: "oral" | "test15min" | "test45min",
    index: number,
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    if (numValue < 0 || numValue > 10) return;

    if (type === "oral") {
      const newOral = [...oral];
      newOral[index] = numValue;
      setOral(newOral);
    } else if (type === "test15min") {
      const newTest15 = [...test15min];
      newTest15[index] = numValue;
      setTest15min(newTest15);
    } else {
      const newTest45 = [...test45min];
      newTest45[index] = numValue;
      setTest45min(newTest45);
    }
  };

  const avg = calculateAverage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-md bg-background/95 border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Nhập điểm
          </DialogTitle>
          <DialogDescription>
            <span className="font-semibold">{studentName}</span> - {subject}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Average Display */}
          <GlassCard padding="md" className="bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-semibold">Điểm trung bình:</span>
              </div>
              <Badge className="text-lg px-4 py-1 bg-primary text-primary-foreground">
                {avg > 0 ? avg.toFixed(1) : "—"}
              </Badge>
            </div>
          </GlassCard>

          {/* Oral Scores */}
          <GlassCard padding="md">
            <div className="flex items-center justify-between mb-3">
              <Label className="font-semibold">Điểm miệng (Hệ số 1)</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addScore("oral")}
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm
              </Button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {oral.map((score, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={score}
                    onChange={(e) => updateScore("oral", idx, e.target.value)}
                    className="pr-8"
                  />
                  <button
                    onClick={() => removeScore("oral", idx)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-destructive hover:text-destructive/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
              {oral.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-full text-center py-2">
                  Chưa có điểm
                </p>
              )}
            </div>
          </GlassCard>

          {/* 15min Test Scores */}
          <GlassCard padding="md">
            <div className="flex items-center justify-between mb-3">
              <Label className="font-semibold">
                Kiểm tra 15 phút (Hệ số 1)
              </Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addScore("test15min")}
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm
              </Button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {test15min.map((score, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={score}
                    onChange={(e) =>
                      updateScore("test15min", idx, e.target.value)
                    }
                    className="pr-8"
                  />
                  <button
                    onClick={() => removeScore("test15min", idx)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-destructive hover:text-destructive/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
              {test15min.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-full text-center py-2">
                  Chưa có điểm
                </p>
              )}
            </div>
          </GlassCard>

          {/* 45min Test Scores */}
          <GlassCard padding="md">
            <div className="flex items-center justify-between mb-3">
              <Label className="font-semibold">
                Kiểm tra 45 phút (Hệ số 2)
              </Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addScore("test45min")}
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm
              </Button>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {test45min.map((score, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative"
                >
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={score}
                    onChange={(e) =>
                      updateScore("test45min", idx, e.target.value)
                    }
                    className="pr-8"
                  />
                  <button
                    onClick={() => removeScore("test45min", idx)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-destructive hover:text-destructive/80"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
              {test45min.length === 0 && (
                <p className="text-sm text-muted-foreground col-span-full text-center py-2">
                  Chưa có điểm
                </p>
              )}
            </div>
          </GlassCard>

          {/* Midterm & Final */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassCard padding="md">
              <Label htmlFor="midterm" className="font-semibold mb-2 block">
                Giữa kỳ (Hệ số 2)
              </Label>
              <Input
                id="midterm"
                type="number"
                min="0"
                max="10"
                step="0.5"
                placeholder="0.0 - 10.0"
                value={midterm}
                onChange={(e) => setMidterm(e.target.value)}
              />
            </GlassCard>

            <GlassCard padding="md">
              <Label htmlFor="final" className="font-semibold mb-2 block">
                Cuối kỳ (Hệ số 3)
              </Label>
              <Input
                id="final"
                type="number"
                min="0"
                max="10"
                step="0.5"
                placeholder="0.0 - 10.0"
                value={final}
                onChange={(e) => setFinal(e.target.value)}
              />
            </GlassCard>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          {!showEditRequest && !requestSent && (
            <>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu điểm"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowEditRequest(true)}
              >
                Yêu cầu sửa điểm
              </Button>
            </>
          )}
          {showEditRequest && !requestSent && (
            <div className="w-full space-y-3">
              <div className="space-y-2">
                <Label htmlFor="editReason">Lý do yêu cầu sửa điểm</Label>
                <textarea
                  id="editReason"
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Nhập lý do yêu cầu sửa điểm..."
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditRequest(false);
                    setEditReason("");
                  }}
                >
                  Hủy
                </Button>
                <Button
                  onClick={() => {
                    if (editReason.trim()) {
                      setRequestSent(true);
                      setTimeout(() => {
                        setRequestSent(false);
                        setShowEditRequest(false);
                        setEditReason("");
                        onOpenChange(false);
                      }, 2000);
                    }
                  }}
                  disabled={!editReason.trim()}
                >
                  Gửi yêu cầu
                </Button>
              </div>
            </div>
          )}
          {requestSent && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full text-center py-4 text-green-600 dark:text-green-400 font-medium"
            >
              ✓ Yêu cầu sửa điểm đã được gửi!
            </motion.div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
