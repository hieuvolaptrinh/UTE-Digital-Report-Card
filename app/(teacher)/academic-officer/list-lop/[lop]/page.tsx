"use client";

import { useAuth } from "@/lib/auth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  ArrowLeft,
  Search,
  Edit,
  Calendar,
  Clock,
  Save,
  User,
} from "lucide-react";
import Link from "next/link";
import {
  mockStudents10A1,
  mockStudents10A2,
  mockStudents11A2,
} from "@/mork-data/students";

interface StudentDetail {
  studentId: string;
  name: string;
  class: string;
  dateOfBirth: string;
  gender: "male" | "female";
  phone?: string;
  email: string;
  address?: string;
  parentName?: string;
  parentPhone?: string;
}

export default function ClassStudentsPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const className = params?.lop as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(
    null
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  // Form state
  const [editedName, setEditedName] = useState("");
  const [editedDOB, setEditedDOB] = useState("");
  const [editedClass, setEditedClass] = useState("");

  // Grade entry deadline settings
  const [gradeEntryDeadline, setGradeEntryDeadline] = useState("2025-12-15");

  // Calculate edit request deadline (30 days after grade entry) - using useMemo to avoid cascading renders
  const editRequestDeadline = useMemo(() => {
    if (gradeEntryDeadline) {
      const deadline = new Date(gradeEntryDeadline);
      deadline.setDate(deadline.getDate() + 30);
      return deadline.toISOString().split("T")[0];
    }
    return "";
  }, [gradeEntryDeadline]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get students based on class
  let students: StudentDetail[] = [];
  if (className === "10A1") {
    students = mockStudents10A1;
  } else if (className === "10A2") {
    students = mockStudents10A2;
  } else if (className === "11A2") {
    students = mockStudents11A2;
  } else {
    // Use default list for other classes
    students = mockStudents10A1;
  }

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenEditDialog = (student: StudentDetail) => {
    setSelectedStudent(student);
    setEditedName(student.name);
    setEditedDOB(student.dateOfBirth);
    setEditedClass(student.class);
    setEditDialogOpen(true);
  };

  const handleSaveStudent = () => {
    if (!selectedStudent) return;

    // In a real app, this would update the backend
    console.log("Updating student:", {
      id: selectedStudent.studentId,
      name: editedName,
      dateOfBirth: editedDOB,
      class: editedClass,
    });

    alert("Đã cập nhật thông tin học sinh thành công!");
    setEditDialogOpen(false);
  };

  const handleSaveSettings = () => {
    if (!gradeEntryDeadline) {
      alert("Vui lòng chọn hạn nhập điểm!");
      return;
    }
    console.log("Saving settings:", {
      gradeEntryDeadline,
      editRequestDeadline,
    });
    alert("Đã cập nhật cài đặt thời gian thành công!");
    setSettingsDialogOpen(false);
  };

  return (
    <>
      <Header
        user={{
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role as "teacher" | "academic-officer" | "principal",
        }}
        onLogout={logout}
      />
      <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link href="/academic-officer/list-lop">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-linear-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Danh sách học sinh - Lớp {className}
            </h1>
            <p className="text-muted-foreground mt-2">
              Tổng số: {students.length} học sinh
            </p>
          </motion.div>

          {/* Grade Entry Settings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <GlassCard padding="lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Thời gian nhập điểm
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Hạn nhập điểm
                      </p>
                      <Badge variant="outline" className="text-base">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(gradeEntryDeadline).toLocaleDateString(
                          "vi-VN"
                        )}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Hạn yêu cầu sửa điểm (sau 30 ngày)
                      </p>
                      <Badge variant="secondary" className="text-base">
                        <Clock className="h-4 w-4 mr-2" />
                        {new Date(editRequestDeadline).toLocaleDateString(
                          "vi-VN"
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setSettingsDialogOpen(true)}
                  variant="outline"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Cập nhật thời gian
                </Button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Students Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard padding="lg">
              <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm học sinh..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>STT</TableHead>
                      <TableHead>Mã SV</TableHead>
                      <TableHead>Họ và tên</TableHead>
                      <TableHead>Ngày sinh</TableHead>
                      <TableHead>Giới tính</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student, index) => (
                      <TableRow
                        key={student.studentId}
                        className="group hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handleOpenEditDialog(student)}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-mono">
                          {student.studentId}
                        </TableCell>
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell>{student.dateOfBirth}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {student.gender === "male" ? "Nam" : "Nữ"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {student.email}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditDialog(student);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Sửa
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
      <Footer />

      {/* Edit Student Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin học sinh</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cơ bản của học sinh
            </DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="studentId">Mã học sinh</Label>
                  <Input
                    id="studentId"
                    value={selectedStudent.studentId}
                    disabled
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Lớp</Label>
                  <Select value={editedClass} onValueChange={setEditedClass}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10A1">10A1</SelectItem>
                      <SelectItem value="10A2">10A2</SelectItem>
                      <SelectItem value="11A1">11A1</SelectItem>
                      <SelectItem value="11A2">11A2</SelectItem>
                      <SelectItem value="12A1">12A1</SelectItem>
                      <SelectItem value="12A2">12A2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Ngày sinh</Label>
                <Input
                  id="dob"
                  type="date"
                  value={editedDOB}
                  onChange={(e) => setEditedDOB(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={selectedStudent.email}
                    disabled
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={selectedStudent.phone || "N/A"}
                    disabled
                  />
                </div>
              </div>
              {selectedStudent.parentName && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Thông tin phụ huynh
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Họ tên
                      </p>
                      <p className="font-medium">
                        {selectedStudent.parentName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Số điện thoại
                      </p>
                      <p className="font-medium">
                        {selectedStudent.parentPhone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveStudent}>
              <Save className="h-4 w-4 mr-2" />
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Grade Entry Settings Dialog */}
      <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật thời gian nhập điểm</DialogTitle>
            <DialogDescription>
              Thời gian yêu cầu sửa điểm sẽ tự động được tính sau 30 ngày
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="gradeDeadline">Hạn nhập điểm</Label>
              <Input
                id="gradeDeadline"
                type="date"
                value={gradeEntryDeadline}
                onChange={(e) => setGradeEntryDeadline(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Hạn yêu cầu sửa điểm (tự động)</Label>
              <Input
                type="date"
                value={editRequestDeadline}
                readOnly
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Tự động tính sau 30 ngày kể từ hạn nhập điểm
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSettingsDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Lưu cài đặt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
