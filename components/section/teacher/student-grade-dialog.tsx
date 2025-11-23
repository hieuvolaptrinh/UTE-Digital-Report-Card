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
import { motion } from "framer-motion";
import type { StudentSubjectGrade } from "@/mork-data/students";

interface StudentGradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
  subject: string;
  initialGrades: StudentSubjectGrade | null;
}

export function StudentGradeDialog({
  open,
  onOpenChange,
  studentName,
  subject,
  initialGrades,
}: StudentGradeDialogProps) {
  const [editReason, setEditReason] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [selectedScoreType, setSelectedScoreType] = useState("");
  const [newScore, setNewScore] = useState("");

  const handleSendEditRequest = () => {
    if (editReason.trim() && selectedScoreType && newScore) {
      console.log("Edit request:", {
        scoreType: selectedScoreType,
        newScore: parseFloat(newScore),
        reason: editReason,
      });
      setRequestSent(true);
      setTimeout(() => {
        setRequestSent(false);
        setEditReason("");
        setSelectedScoreType("");
        setNewScore("");
        onOpenChange(false);
      }, 2000);
    }
  };

  const getScoreOptions = () => {
    const options: {
      label: string;
      value: string;
      score: number;
    }[] = [];

    if (initialGrades) {
      initialGrades.oral?.forEach((score, idx) => {
        options.push({
          label: `Điểm miệng #${idx + 1}: ${score.toFixed(1)}`,
          value: `oral-${idx}`,
          score,
        });
      });

      initialGrades.test15min?.forEach((score, idx) => {
        options.push({
          label: `Kiểm tra 15 phút #${idx + 1}: ${score.toFixed(1)}`,
          value: `test15min-${idx}`,
          score,
        });
      });

      initialGrades.test45min?.forEach((score, idx) => {
        options.push({
          label: `Kiểm tra 45 phút #${idx + 1}: ${score.toFixed(1)}`,
          value: `test45min-${idx}`,
          score,
        });
      });

      if (initialGrades.midterm) {
        options.push({
          label: `Giữa kỳ: ${initialGrades.midterm.toFixed(1)}`,
          value: "midterm",
          score: initialGrades.midterm,
        });
      }

      if (initialGrades.final) {
        options.push({
          label: `Cuối kỳ: ${initialGrades.final.toFixed(1)}`,
          value: "final",
          score: initialGrades.final,
        });
      }
    }

    return options;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg backdrop-blur-md bg-background/95 border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Yêu cầu sửa điểm
          </DialogTitle>
          <DialogDescription>
            <span className="font-semibold">{studentName}</span> - {subject}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Chọn điểm cần sửa</Label>
            <select
              value={selectedScoreType}
              onChange={(e) => setSelectedScoreType(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">-- Chọn điểm --</option>
              {getScoreOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newScore">Điểm mới đề xuất</Label>
            <Input
              id="newScore"
              type="number"
              min="0"
              max="10"
              step="0.5"
              placeholder="0.0 - 10.0"
              value={newScore}
              onChange={(e) => setNewScore(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="editReasonNew">Lý do yêu cầu sửa điểm</Label>
            <textarea
              id="editReasonNew"
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Nhập lý do yêu cầu sửa điểm..."
            />
          </div>

          {requestSent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 text-green-600 dark:text-green-400 font-medium"
            >
              ✓ Yêu cầu sửa điểm đã được gửi!
            </motion.div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setEditReason("");
              setSelectedScoreType("");
              setNewScore("");
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSendEditRequest}
            disabled={
              !selectedScoreType ||
              !newScore ||
              !editReason.trim() ||
              requestSent
            }
          >
            Gửi yêu cầu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
