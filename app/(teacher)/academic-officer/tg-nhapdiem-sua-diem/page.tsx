"use client";

import * as React from "react";
import { motion } from "motion/react";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  mockGradeDeadlines,
  mockAcademicYears,
  mockGrades,
  mockSemesters,
  calculateEditDeadline,
  type GradeDeadline,
} from "@/mork-data/grade-deadlines";

export default function GradeDeadlineManagementPage() {
  const [deadlines, setDeadlines] =
    React.useState<GradeDeadline[]>(mockGradeDeadlines);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterGrade, setFilterGrade] = React.useState<string>("all");
  const [filterSemester, setFilterSemester] = React.useState<string>("all");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [filterAcademicYear, setFilterAcademicYear] = React.useState<string>("all");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editingDeadline, setEditingDeadline] =
    React.useState<GradeDeadline | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  // Form state
  const [formData, setFormData] = React.useState({
    academicYear: "2024-2025",
    grade: "",
    semester: 1,
    entryStartDate: new Date(),
    entryEndDate: new Date(),
    editEndDate: new Date(),
  });

  // Filter deadlines
  const filteredDeadlines = React.useMemo(() => {
    return deadlines.filter((deadline) => {
      const matchSearch =
        deadline.academicYear.includes(searchTerm) ||
        deadline.grade.includes(searchTerm);
      const matchGrade =
        filterGrade === "all" || deadline.grade === filterGrade;
      const matchSemester =
        filterSemester === "all" ||
        deadline.semester.toString() === filterSemester;
      const matchStatus =
        filterStatus === "all" || deadline.status === filterStatus;
      const matchAcademicYear =
        filterAcademicYear === "all" || deadline.academicYear === filterAcademicYear;

      return matchSearch && matchGrade && matchSemester && matchStatus && matchAcademicYear;
    });
  }, [deadlines, searchTerm, filterGrade, filterSemester, filterStatus, filterAcademicYear]);

  // Handle save deadline
  const handleSaveDeadline = () => {
    if (editingDeadline) {
      // Update existing deadline
      setDeadlines((prev) =>
        prev.map((d) =>
          d.id === editingDeadline.id
            ? {
                ...d,
                ...formData,
                updatedAt: new Date(),
                status:
                  new Date() < formData.entryStartDate
                    ? "upcoming"
                    : new Date() > formData.editEndDate
                    ? "expired"
                    : "active",
              }
            : d
        )
      );
    } else {
      // Add new deadline
      const newDeadline: GradeDeadline = {
        id: `gd-${Date.now()}`,
        ...formData,
        createdBy: "Nguyễn Văn A",
        createdAt: new Date(),
        updatedAt: new Date(),
        status:
          new Date() < formData.entryStartDate
            ? "upcoming"
            : new Date() > formData.editEndDate
            ? "expired"
            : "active",
      };
      setDeadlines((prev) => [...prev, newDeadline]);
    }
    setDialogOpen(false);
  };

  // Handle delete deadline
  const handleDeleteDeadline = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setDeadlines((prev) => prev.filter((d) => d.id !== deleteId));
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  // Auto-calculate edit deadline when entry end date changes
  React.useEffect(() => {
    if (formData.entryEndDate) {
      setFormData((prev) => ({
        ...prev,
        editEndDate: calculateEditDeadline(prev.entryEndDate),
      }));
    }
  }, [formData.entryEndDate]);

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="default"
            className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Đang diễn ra
          </Badge>
        );
      case "expired":
        return (
          <Badge
            variant="default"
            className="bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20"
          >
            <AlertCircle className="h-3 w-3 mr-1" />
            Đã hết hạn
          </Badge>
        );
      case "upcoming":
        return (
          <Badge
            variant="default"
            className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
          >
            <Clock className="h-3 w-3 mr-1" />
            Sắp diễn ra
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              Quản lý thời gian nhập & sửa điểm
            </h1>
            <p className="text-muted-foreground mt-1">
              Thiết lập thời gian nhập điểm và sửa điểm theo năm học, khối
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingDeadline(null);
              setFormData({
                academicYear: "2024-2025",
                grade: "",
                semester: 1,
                entryStartDate: new Date(),
                entryEndDate: new Date(),
                editEndDate: calculateEditDeadline(new Date()),
              });
              setDialogOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Thêm thời gian nhập & sửa điểm
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="p-4 border-primary/20 bg-gradient-to-br from-background to-primary/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Tổng cài đặt thời gian
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {deadlines.length}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-primary/60" />
            </div>
          </Card>
          <Card className="p-4 border-green-500/20 bg-gradient-to-br from-background to-green-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đang diễn ra</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {deadlines.filter((d) => d.status === "active").length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500/60" />
            </div>
          </Card>
          <Card className="p-4 border-blue-500/20 bg-gradient-to-br from-background to-blue-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sắp diễn ra</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {deadlines.filter((d) => d.status === "upcoming").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500/60" />
            </div>
          </Card>
          <Card className="p-4 border-red-500/20 bg-gradient-to-br from-background to-red-500/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đã hết hạn</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {deadlines.filter((d) => d.status === "expired").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500/60" />
            </div>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm năm học, khối..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterAcademicYear} onValueChange={setFilterAcademicYear}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Năm học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {mockAcademicYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterGrade} onValueChange={setFilterGrade}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Khối" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả khối</SelectItem>
                  {mockGrades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      Khối {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterSemester} onValueChange={setFilterSemester}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Học kỳ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {mockSemesters.map((sem) => (
                    <SelectItem key={sem.value} value={sem.value.toString()}>
                      {sem.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Đang diễn ra</SelectItem>
                  <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                  <SelectItem value="expired">Đã hết hạn</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Năm học</TableHead>
                    <TableHead>Khối</TableHead>
                    <TableHead>Học kỳ</TableHead>
                    <TableHead>Bắt đầu nhập</TableHead>
                    <TableHead>Hết hạn nhập</TableHead>
                    <TableHead>Hết hạn sửa</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeadlines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <AlertCircle className="h-8 w-8" />
                          <p>Không tìm thấy cấu hình nào</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDeadlines.map((deadline) => (
                      <TableRow key={deadline.id}>
                        <TableCell className="font-medium">
                          {deadline.academicYear}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Khối {deadline.grade}</Badge>
                        </TableCell>
                        <TableCell>Học kỳ {deadline.semester}</TableCell>
                        <TableCell>
                          {format(deadline.entryStartDate, "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </TableCell>
                        <TableCell>
                          {format(deadline.entryEndDate, "dd/MM/yyyy", {
                            locale: vi,
                          })}
                        </TableCell>
                        <TableCell>
                          <span className="text-orange-600 dark:text-orange-400 font-medium">
                            {format(deadline.editEndDate, "dd/MM/yyyy", {
                              locale: vi,
                            })}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(deadline.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteDeadline(deadline.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingDeadline ? "Chỉnh sửa" : "Thêm"} cấu hình thời gian
            </DialogTitle>
            <DialogDescription>
              Thiết lập thời gian nhập điểm và sửa điểm. Thời gian sửa điểm mặc
              định là 7 ngày sau khi hết hạn nhập điểm.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Năm học *</Label>
                <Select
                  value={formData.academicYear}
                  onValueChange={(value) =>
                    setFormData({ ...formData, academicYear: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn năm học" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAcademicYears.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Khối *</Label>
                <Select
                  value={formData.grade}
                  onValueChange={(value) =>
                    setFormData({ ...formData, grade: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khối" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGrades.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        Khối {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Học kỳ *</Label>
              <Select
                value={formData.semester.toString()}
                onValueChange={(value) =>
                  setFormData({ ...formData, semester: parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn học kỳ" />
                </SelectTrigger>
                <SelectContent>
                  {mockSemesters.map((sem) => (
                    <SelectItem key={sem.value} value={sem.value.toString()}>
                      {sem.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bắt đầu nhập điểm *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.entryStartDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.entryStartDate ? (
                        format(formData.entryStartDate, "dd/MM/yyyy", {
                          locale: vi,
                        })
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.entryStartDate}
                      onSelect={(date) =>
                        date &&
                        setFormData({ ...formData, entryStartDate: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Hết hạn nhập điểm *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.entryEndDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {formData.entryEndDate ? (
                        format(formData.entryEndDate, "dd/MM/yyyy", {
                          locale: vi,
                        })
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={formData.entryEndDate}
                      onSelect={(date) =>
                        date && setFormData({ ...formData, entryEndDate: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Hết hạn sửa điểm (tự động +7 ngày) *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.editEndDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.editEndDate ? (
                      format(formData.editEndDate, "dd/MM/yyyy", {
                        locale: vi,
                      })
                    ) : (
                      <span>Chọn ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.editEndDate}
                    onSelect={(date) =>
                      date && setFormData({ ...formData, editEndDate: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                Mặc định: 7 ngày sau ngày hết hạn nhập điểm
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSaveDeadline}
              disabled={
                !formData.academicYear ||
                !formData.grade ||
                !formData.entryStartDate ||
                !formData.entryEndDate ||
                !formData.editEndDate
              }
            >
              {editingDeadline ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa cấu hình này? Hành động này không thể
              hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
