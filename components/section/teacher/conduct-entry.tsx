"use client";

import { useState, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStudentDetailsByClass } from "@/mork-data";
import { submitConductAssessment, ConductLevel } from "@/mork-data/conduct";
import { CheckCircle2, Save, AlertCircle, PenLine, X, RotateCcw, CalendarClock, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConductEntryProps {
  teacher: any;
}

const conductRatings = [
  { value: "Tốt", label: "Tốt", color: "bg-green-500/10 text-green-600 border-green-200" },
  { value: "Khá", label: "Khá", color: "bg-blue-500/10 text-blue-600 border-blue-200" },
  { value: "Trung bình", label: "Trung bình", color: "bg-orange-500/10 text-orange-600 border-orange-200" },
  { value: "Yếu", label: "Yếu", color: "bg-red-500/10 text-red-600 border-red-200" },
];

export function ConductEntry({ teacher }: ConductEntryProps) {
  // 1. Lấy danh sách học sinh
  const students = teacher.homeRoomClass
    ? getStudentDetailsByClass(teacher.homeRoomClass)
    : [];

  // 2. State quản lý dữ liệu
  const [conductData, setConductData] = useState<Record<string, { level: ConductLevel; comment: string; lastUpdated?: string }>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ level: string; comment: string }>({ level: "", comment: "" });
  const [isSaving, setIsSaving] = useState(false);

  // State cho chọn nhiều (Bulk Action)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [bulkForm, setBulkForm] = useState<{ level: string; comment: string }>({ level: "Tốt", comment: "" });

  // State kiểm tra thời gian
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

  // Khởi tạo dữ liệu và kiểm tra thời gian
  useEffect(() => {
    // 1. Mock Data Init
    const initialData: Record<string, any> = {};
    students.forEach(s => {
      initialData[s.studentId] = {
        level: (s.conduct as ConductLevel) || "Tốt",
        comment: "",
        lastUpdated: new Date().toISOString().split("T")[0]
      };
    });
    setConductData(initialData);

    // 2. Kiểm tra thời gian đánh giá (Logic giả lập)
    const checkAssessmentPeriod = () => {
      const now = new Date();
      const month = now.getMonth() + 1; // 1-12
      
      // Giả sử kỳ đánh giá là tháng 12, 1 (HK1) và tháng 5, 6 (HK2)
      // Để test, bạn có thể thêm tháng hiện tại vào mảng này
      const allowedMonths = [5, 6, 12, 1, 11, 2]; // Ví dụ mở rộng thêm tháng 2, 11 để test
      
      const isOpen = allowedMonths.includes(month);
      setIsAssessmentOpen(isOpen);
    };
    checkAssessmentPeriod();

  }, [teacher.homeRoomClass]);

  // --- Logic Xử lý Checkbox ---
  const toggleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map(s => s.studentId));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // --- Các hàm xử lý chỉnh sửa đơn ---
  const handleEdit = (studentId: string) => {
    if (!isAssessmentOpen) return;
    const current = conductData[studentId];
    setEditingId(studentId);
    setEditForm({ 
      level: current?.level || "Tốt", 
      comment: current?.comment || "" 
    });
  };

  const handleSave = async (studentId: string) => {
    setIsSaving(true);
    await submitConductAssessment([studentId], editForm.level, editForm.comment);

    setConductData(prev => ({
      ...prev,
      [studentId]: {
        level: editForm.level as ConductLevel,
        comment: editForm.comment,
        lastUpdated: new Date().toISOString().split("T")[0]
      }
    }));

    setEditingId(null);
    setIsSaving(false);
  };

  // --- Các hàm xử lý chỉnh sửa hàng loạt (Bulk) ---
  const handleBulkSave = async () => {
    setIsSaving(true);
    await submitConductAssessment(selectedIds, bulkForm.level, bulkForm.comment);

    setConductData(prev => {
      const next = { ...prev };
      selectedIds.forEach(id => {
        next[id] = {
          level: bulkForm.level as ConductLevel,
          // Nếu comment trống thì giữ nguyên cũ, ngược lại thì cập nhật mới
          comment: bulkForm.comment ? bulkForm.comment : next[id].comment, 
          lastUpdated: new Date().toISOString().split("T")[0]
        };
      });
      return next;
    });

    setIsBulkEditing(false);
    setSelectedIds([]);
    setBulkForm({ level: "Tốt", comment: "" }); // Reset form
    setIsSaving(false);
  };

  const handleCancel = () => setEditingId(null);
  const getRatingColor = (rating: string) => conductRatings.find((r) => r.value === rating)?.color || "";

  if (!teacher.homeRoomClass) {
    return (
      <GlassCard className="p-8 text-center flex flex-col items-center justify-center space-y-3">
        <div className="bg-orange-100 p-3 rounded-full">
            <AlertCircle className="h-6 w-6 text-orange-600" />
        </div>
        <h3 className="text-lg font-semibold">Chưa có lớp chủ nhiệm</h3>
        <p className="text-muted-foreground">Bạn chưa được phân công lớp chủ nhiệm để thực hiện chức năng này.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Header Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="col-span-2 p-4 flex items-center justify-between">
           <div>
              <h2 className="text-lg font-semibold">Lớp {teacher.homeRoomClass}</h2>
              <p className="text-sm text-muted-foreground">Sĩ số: {students.length} học sinh</p>
           </div>
           <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
             <RotateCcw className="mr-2 h-3.5 w-3.5" /> Làm mới
           </Button>
        </GlassCard>

        <GlassCard className={`p-4 border ${!isAssessmentOpen ? 'bg-red-50 dark:bg-red-900/10 border-red-200' : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100'}`}>
           <div className="flex items-start gap-3">
              {isAssessmentOpen ? (
                <div className="bg-blue-100 p-2 rounded-full"><CalendarClock className="h-4 w-4 text-blue-600" /></div>
              ) : (
                <div className="bg-red-100 p-2 rounded-full"><CalendarClock className="h-4 w-4 text-red-600" /></div>
              )}
              
              <div>
                <p className={`text-sm font-semibold ${!isAssessmentOpen ? 'text-red-700' : 'text-blue-700'}`}>
                  {isAssessmentOpen ? "Đang trong kỳ đánh giá" : "Chưa đến thời gian đánh giá"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Chỉ được phép nhập hạnh kiểm vào cuối mỗi học kỳ.
                </p>
              </div>
           </div>
        </GlassCard>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && isAssessmentOpen && (
        <div className="sticky top-4 z-10 mx-auto w-full">
           <GlassCard className="p-4 shadow-xl border-primary/20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md animate-in slide-in-from-top-2">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-sm">Đã chọn {selectedIds.length} học sinh</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                   {isBulkEditing ? (
                      <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                        <Select 
                          value={bulkForm.level} 
                          onValueChange={(val) => setBulkForm({...bulkForm, level: val})}
                        >
                          <SelectTrigger className="w-full sm:w-[140px] h-9">
                            <SelectValue placeholder="Chọn mức" />
                          </SelectTrigger>
                          <SelectContent>
                             {conductRatings.map((r) => (
                               <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                             ))}
                          </SelectContent>
                        </Select>

                        {/* Ô nhập nhận xét chung */}
                        <input
                            className="flex h-9 w-full sm:w-[300px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Nhập nhận xét chung (tùy chọn)..."
                            value={bulkForm.comment}
                            onChange={(e) => setBulkForm({...bulkForm, comment: e.target.value})}
                        />

                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={handleBulkSave} disabled={isSaving}>
                            {isSaving ? "Đang lưu..." : "Lưu tất cả"}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setIsBulkEditing(false)}>Hủy</Button>
                        </div>
                      </div>
                   ) : (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button size="sm" onClick={() => setIsBulkEditing(true)} className="w-full sm:w-auto">
                          <PenLine className="w-4 h-4 mr-2" /> Đánh giá học sinh
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setSelectedIds([])} className="w-full sm:w-auto">
                           Bỏ chọn
                        </Button>
                      </div>
                   )}
                </div>
              </div>
           </GlassCard>
        </div>
      )}

      {/* Table Form */}
      <GlassCard padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-border hover:bg-transparent">
                {/* Checkbox Header */}
                <TableHead className="w-[40px] text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
                    onChange={toggleSelectAll}
                    checked={students.length > 0 && selectedIds.length === students.length}
                    disabled={!isAssessmentOpen || students.length === 0}
                  />
                </TableHead>
                <TableHead className="w-[50px] text-center">STT</TableHead>
                <TableHead className="w-[250px]">Học sinh</TableHead>
                <TableHead className="w-[150px]">Hạnh kiểm</TableHead>
                <TableHead>Nhận xét</TableHead>
                <TableHead className="w-[120px] text-center">Ngày sửa</TableHead>
                <TableHead className="text-right w-[100px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => {
                const data = conductData[student.studentId] || { level: "Tốt", comment: "", lastUpdated: "-" };
                const isEditing = editingId === student.studentId;
                const isSelected = selectedIds.includes(student.studentId);

                return (
                  <TableRow 
                    key={student.studentId} 
                    className={`border-border transition-colors ${isEditing || isSelected ? "bg-primary/5" : "hover:bg-muted/20"}`}
                  >
                    {/* Checkbox Row */}
                    <TableCell className="text-center">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        onChange={() => toggleSelectOne(student.studentId)}
                        checked={isSelected}
                        disabled={!isAssessmentOpen}
                      />
                    </TableCell>
                    
                    <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                    
                    {/* Thông tin học sinh */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-border">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.studentId}`} />
                          <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.studentId}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Chọn Hạnh kiểm */}
                    <TableCell>
                      {isEditing ? (
                        <Select
                          value={editForm.level}
                          onValueChange={(value) => setEditForm({ ...editForm, level: value })}
                        >
                          <SelectTrigger className="w-full h-9 bg-white dark:bg-gray-950">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {conductRatings.map((rating) => (
                              <SelectItem key={rating.value} value={rating.value}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${rating.color.split(' ')[0].replace('/10', '')}`} />
                                  {rating.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="outline" className={`${getRatingColor(data.level)} font-normal px-2.5 py-0.5`}>
                          {data.level}
                        </Badge>
                      )}
                    </TableCell>

                    {/* Nhập Nhận xét */}
                    <TableCell>
                      {isEditing ? (
                        <Textarea
                          value={editForm.comment}
                          onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                          placeholder="Nhập nhận xét..."
                          className="min-h-[60px] resize-none text-sm bg-white dark:bg-gray-950 focus-visible:ring-1"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground line-clamp-2">
                          {data.comment || "Chưa có nhận xét"}
                        </span>
                      )}
                    </TableCell>

                    {/* Ngày cập nhật */}
                    <TableCell className="text-center">
                      <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                        {data.lastUpdated}
                      </span>
                    </TableCell>

                    {/* Nút thao tác */}
                    <TableCell className="text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="default" className="h-8 w-8 bg-green-600 hover:bg-green-700 shadow-sm" onClick={() => handleSave(student.studentId)} disabled={isSaving}>
                            {isSaving ? <span className="animate-spin text-xs">⏳</span> : <Save className="h-4 w-4" />}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50" onClick={handleCancel} disabled={isSaving}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 px-2 text-primary hover:bg-primary/10 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed" 
                          onClick={() => handleEdit(student.studentId)}
                          disabled={!isAssessmentOpen}
                          title={!isAssessmentOpen ? "Chưa đến thời gian đánh giá" : "Sửa"}
                        >
                          <PenLine className="h-4 w-4 mr-1.5" /> Sửa
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </GlassCard>
    </div>
  );
}