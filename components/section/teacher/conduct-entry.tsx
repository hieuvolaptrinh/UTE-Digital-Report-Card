"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockConduct, Conduct, TeacherUser } from "@/mork-data";
import { CheckCircle2, Save, AlertCircle } from "lucide-react";

interface ConductEntryProps {
  teacher: TeacherUser;
}

const conductRatings = [
  { value: "Tốt", label: "Tốt", color: "bg-green-500/10 text-green-600" },
  { value: "Khá", label: "Khá", color: "bg-blue-500/10 text-blue-600" },
  {
    value: "Trung bình",
    label: "Trung bình",
    color: "bg-orange-500/10 text-orange-600",
  },
  { value: "Yếu", label: "Yếu", color: "bg-red-500/10 text-red-600" },
];

export function ConductEntry({ teacher }: ConductEntryProps) {
  const [selectedClass, setSelectedClass] = useState(teacher.classes[0] || "");
  const [conducts, setConducts] = useState<Conduct[]>(
    mockConduct.filter((c) => c.class === selectedClass)
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ rating: string; notes: string }>({
    rating: "",
    notes: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    const classConduct = mockConduct.filter((c) => c.class === classId);
    setConducts(classConduct);
    setEditingId(null);
  };

  const handleEdit = (conduct: Conduct) => {
    setEditingId(conduct.id);
    setEditData({ rating: conduct.rating, notes: conduct.notes || "" });
  };

  const handleSave = async (conductId: string) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setConducts(
      conducts.map((c) =>
        c.id === conductId
          ? {
              ...c,
              rating: editData.rating as any,
              notes: editData.notes,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : c
      )
    );

    setEditingId(null);
    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({ rating: "", notes: "" });
  };

  const getRatingColor = (rating: string) => {
    return conductRatings.find((r) => r.value === rating)?.color || "";
  };

  return (
    <div className="space-y-6">
      <GlassCard padding="md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Nhập hạnh kiểm</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Đánh giá hạnh kiểm cho học sinh lớp chủ nhiệm
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Label>Chọn lớp:</Label>
            <Select value={selectedClass} onValueChange={handleClassChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {teacher.classes.map((classId) => (
                  <SelectItem key={classId} value={classId}>
                    {classId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      <GlassCard padding="none">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            <p className="text-sm text-muted-foreground">
              Hạnh kiểm được đánh giá theo 4 mức: Tốt, Khá, Trung bình, Yếu
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="w-[80px]">STT</TableHead>
                <TableHead>Họ và tên</TableHead>
                <TableHead>MSSV</TableHead>
                <TableHead>Hạnh kiểm</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead>Cập nhật</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conducts.map((conduct, index) => (
                <motion.tr
                  key={conduct.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-white/10"
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    {conduct.studentName}
                  </TableCell>
                  <TableCell>{conduct.studentId}</TableCell>
                  <TableCell>
                    {editingId === conduct.id ? (
                      <Select
                        value={editData.rating}
                        onValueChange={(value) =>
                          setEditData({ ...editData, rating: value })
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {conductRatings.map((rating) => (
                            <SelectItem key={rating.value} value={rating.value}>
                              {rating.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge className={getRatingColor(conduct.rating)}>
                        {conduct.rating}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === conduct.id ? (
                      <Textarea
                        value={editData.notes}
                        onChange={(e) =>
                          setEditData({ ...editData, notes: e.target.value })
                        }
                        placeholder="Nhập ghi chú..."
                        className="min-h-[60px]"
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {conduct.notes || "Chưa có ghi chú"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {conduct.lastUpdated}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {editingId === conduct.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSave(conduct.id)}
                          disabled={isSaving}
                          className="gap-1"
                        >
                          {isSaving ? (
                            <span className="animate-spin">⏳</span>
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          Lưu
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isSaving}
                        >
                          Hủy
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(conduct)}
                      >
                        Chỉnh sửa
                      </Button>
                    )}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </GlassCard>

      <GlassCard padding="md" className="bg-blue-500/5 border-blue-500/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Lưu ý khi đánh giá hạnh kiểm:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Hạnh kiểm "Tốt": Học sinh chăm chỉ, có ý thức tự giác cao</li>
              <li>
                Hạnh kiểm "Khá": Học sinh có ý thức nhưng còn một số hạn chế
              </li>
              <li>
                Hạnh kiểm "Trung bình": Học sinh cần cải thiện thái độ học tập
              </li>
              <li>Hạnh kiểm "Yếu": Học sinh thường xuyên vi phạm nội quy</li>
            </ul>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
