// components/section/teacher/student-conduct-dialog.tsx
"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  BookOpen,
  Award,
  CheckCircle2,
} from "lucide-react";
import type { StudentDetail } from "@/mork-data/students";

interface StudentConductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: StudentDetail | null;
  onSave: (conduct: string, note: string) => void;
}

export function StudentConductDialog({
  open,
  onOpenChange,
  student,
  onSave,
}: StudentConductDialogProps) {
  const [conduct, setConduct] = useState<string>(
    student?.conduct || "Trung bình"
  );
  const [teacherNote, setTeacherNote] = useState(student?.teacherNote || "");
  const [saving, setSaving] = useState(false);

  if (!student) return null;

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onSave(conduct, teacherNote);
    setSaving(false);
  };

  const conductColors = {
    Tốt: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    Khá: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    "Trung bình":
      "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    Yếu: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  const attendanceRate = student.attendance
    ? ((student.attendance.present / student.attendance.total) * 100).toFixed(1)
    : "N/A";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-md bg-background/95 border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            Hạnh Kiểm và Nhận Xét Học Sinh
          </DialogTitle>
          <DialogDescription>
            Xem chi tiết và cập nhật hạnh kiểm, nhận xét cho học sinh
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Student Info */}
          <GlassCard padding="md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Họ và tên:
                  </span>
                  <span className="font-semibold">{student.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Lớp:</span>
                  <Badge variant="outline">{student.class}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Ngày sinh:
                  </span>
                  <span className="text-sm">{student.dateOfBirth}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm">{student.email}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Điện thoại:
                  </span>
                  <span className="text-sm">{student.phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Phụ huynh:
                  </span>
                  <span className="text-sm">{student.parentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">SĐT PH:</span>
                  <span className="text-sm">{student.parentPhone}</span>
                </div>
                {student.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-sm text-muted-foreground">
                        Địa chỉ:
                      </span>
                      <p className="text-sm">{student.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Academic Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <GlassCard padding="sm" className="text-center">
              <Award className="h-6 w-6 text-primary mx-auto mb-1" />
              <div className="text-2xl font-bold">
                {student.averageGrade?.toFixed(1) || "N/A"}
              </div>
              <div className="text-xs text-muted-foreground">ĐTB</div>
            </GlassCard>

            <GlassCard padding="sm" className="text-center">
              <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-1" />
              <div className="text-2xl font-bold">{attendanceRate}%</div>
              <div className="text-xs text-muted-foreground">Điểm danh</div>
            </GlassCard>

            <GlassCard
              padding="sm"
              className="text-center col-span-2 md:col-span-1"
            >
              <div className="text-xs text-muted-foreground mb-1">
                Hạnh kiểm
              </div>
              <Badge
                className={`${
                  conductColors[student.conduct || "Trung bình"]
                } text-sm font-semibold`}
              >
                {student.conduct || "Chưa đánh giá"}
              </Badge>
            </GlassCard>
          </div>

          {/* Conduct Assessment */}
          <GlassCard padding="md">
            <Label className="text-base font-semibold mb-3 block">
              Đánh giá hạnh kiểm
            </Label>
            <RadioGroup value={conduct} onValueChange={setConduct}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(["Tốt", "Khá", "Trung bình", "Yếu"] as const).map((level) => (
                  <motion.div
                    key={level}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <label
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        conduct === level
                          ? "border-primary bg-primary/5"
                          : "border-border/50 hover:border-primary/50"
                      }`}
                    >
                      <RadioGroupItem value={level} id={level} />
                      <span className="font-medium">{level}</span>
                    </label>
                  </motion.div>
                ))}
              </div>
            </RadioGroup>
          </GlassCard>

          {/* Teacher Notes */}
          <GlassCard padding="md">
            <Label htmlFor="teacherNote" className="text-base font-semibold">
              Nhận xét của giáo viên
            </Label>
            <Textarea
              id="teacherNote"
              placeholder="Nhập nhận xét về học sinh (học tập, thái độ, hoạt động...)"
              value={teacherNote}
              onChange={(e) => setTeacherNote(e.target.value)}
              rows={5}
              className="mt-2 resize-none bg-background/50 backdrop-blur-sm"
            />
          </GlassCard>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Đang lưu..." : "Lưu đánh giá"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
