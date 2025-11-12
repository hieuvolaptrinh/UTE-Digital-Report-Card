"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FolderOpen, Search, Download, Eye, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  mockStudents10A1,
  mockStudents10A2,
  mockStudents11A2,
  getGradesByClassAndSubject,
} from "@/mork-data/students";

interface Student {
  id: string;
  name: string;
  class: string;
  gender: "male" | "female";
  birthDate: string;
  email: string;
  phone: string;
}

const allStudents: Student[] = [
  ...mockStudents10A1.map((s) => ({
    id: s.studentId,
    name: s.name,
    class: "10A1",
    gender: s.gender,
    birthDate: s.dateOfBirth,
    email: s.email,
    phone: s.phone || "N/A",
  })),
  ...mockStudents10A2.map((s) => ({
    id: s.studentId,
    name: s.name,
    class: "10A2",
    gender: s.gender,
    birthDate: s.dateOfBirth,
    email: s.email,
    phone: s.phone || "N/A",
  })),
  ...mockStudents11A2.map((s) => ({
    id: s.studentId,
    name: s.name,
    class: "11A2",
    gender: s.gender,
    birthDate: s.dateOfBirth,
    email: s.email,
    phone: s.phone || "N/A",
  })),
];

export default function TranscriptsPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    if (
      !isLoading &&
      (!user || !isTeacher(user) || user.role !== "principal")
    ) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !isTeacher(user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user.role !== "principal") {
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
            <GlassCard padding="lg">
              <p className="text-center text-muted-foreground">
                Bạn không có quyền truy cập trang này
              </p>
            </GlassCard>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const filteredStudents = allStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === "all" || student.class === classFilter;
    return matchesSearch && matchesClass;
  });

  const handleViewTranscript = (student: Student) => {
    setSelectedStudent(student);
    setShowTranscript(true);
  };

  const handleExportTranscript = (student: Student) => {
    // Get grades for this student
    const mathGrades = getGradesByClassAndSubject(student.class, "Toán");
    const literatureGrades = getGradesByClassAndSubject(student.class, "Văn");
    const physicsGrades = getGradesByClassAndSubject(student.class, "Vật lý");

    const studentMath = mathGrades.find((g) => g.studentId === student.id);
    const studentLit = literatureGrades.find((g) => g.studentId === student.id);
    const studentPhys = physicsGrades.find((g) => g.studentId === student.id);

    const csvContent = [
      ["HỌC BẠ HỌC SINH"],
      [""],
      ["Thông tin học sinh"],
      ["Họ và tên", student.name],
      ["Mã số", student.id],
      ["Lớp", student.class],
      ["Ngày sinh", student.birthDate],
      [""],
      ["Bảng điểm"],
      ["Môn học", "Điểm 15 phút", "Điểm 1 tiết", "Điểm thi", "Điểm TB"],
      [
        "Toán",
        studentMath?.test15min?.join(", ") || "N/A",
        studentMath?.test45min?.join(", ") || "N/A",
        String(studentMath?.midterm ?? "N/A"),
        studentMath?.average?.toFixed(1) || "N/A",
      ],
      [
        "Văn",
        studentLit?.test15min?.join(", ") || "N/A",
        studentLit?.test45min?.join(", ") || "N/A",
        String(studentLit?.midterm ?? "N/A"),
        studentLit?.average?.toFixed(1) || "N/A",
      ],
      [
        "Vật lý",
        studentPhys?.test15min?.join(", ") || "N/A",
        studentPhys?.test45min?.join(", ") || "N/A",
        String(studentPhys?.midterm ?? "N/A"),
        studentPhys?.average?.toFixed(1) || "N/A",
      ],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `hoc-ba-${student.id}-${student.name}.csv`;
    link.click();
  };

  const classOptions = ["all", "10A1", "10A2", "11A2", "12A1", "12A2"];

  const getStudentGrades = (student: Student) => {
    const mathGrades = getGradesByClassAndSubject(student.class, "Toán");
    const literatureGrades = getGradesByClassAndSubject(student.class, "Văn");
    const physicsGrades = getGradesByClassAndSubject(student.class, "Vật lý");

    return {
      math: mathGrades.find((g) => g.studentId === student.id),
      literature: literatureGrades.find((g) => g.studentId === student.id),
      physics: physicsGrades.find((g) => g.studentId === student.id),
    };
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-lg bg-primary/10">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Quản lý học bạ</h1>
                <p className="text-muted-foreground">
                  Xem và xuất học bạ học sinh toàn trường
                </p>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <GlassCard padding="lg" className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm tên hoặc mã số..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Lọc theo lớp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả lớp</SelectItem>
                    {classOptions.slice(1).map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        Lớp {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </GlassCard>
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <GlassCard padding="none" className="overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">STT</TableHead>
                      <TableHead>Học sinh</TableHead>
                      <TableHead>Mã số</TableHead>
                      <TableHead>Lớp</TableHead>
                      <TableHead>Điểm TB Toán</TableHead>
                      <TableHead>Điểm TB Văn</TableHead>
                      <TableHead>Điểm TB Lý</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student, index) => {
                      const grades = getStudentGrades(student);
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                                />
                                <AvatarFallback>
                                  {student.name
                                    .split(" ")
                                    .slice(-1)[0]
                                    .charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">
                                {student.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {student.id}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{student.class}</Badge>
                          </TableCell>
                          <TableCell>
                            {grades.math?.average ? (
                              <Badge
                                className={cn(
                                  grades.math.average >= 8
                                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                                    : grades.math.average >= 6.5
                                    ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                    : grades.math.average >= 5
                                    ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                                    : "bg-red-500/10 text-red-600 border-red-500/20"
                                )}
                              >
                                {grades.math.average.toFixed(1)}
                              </Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                N/A
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {grades.literature?.average ? (
                              <Badge
                                className={cn(
                                  grades.literature.average >= 8
                                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                                    : grades.literature.average >= 6.5
                                    ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                    : grades.literature.average >= 5
                                    ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                                    : "bg-red-500/10 text-red-600 border-red-500/20"
                                )}
                              >
                                {grades.literature.average.toFixed(1)}
                              </Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                N/A
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {grades.physics?.average ? (
                              <Badge
                                className={cn(
                                  grades.physics.average >= 8
                                    ? "bg-green-500/10 text-green-600 border-green-500/20"
                                    : grades.physics.average >= 6.5
                                    ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                    : grades.physics.average >= 5
                                    ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                                    : "bg-red-500/10 text-red-600 border-red-500/20"
                                )}
                              >
                                {grades.physics.average.toFixed(1)}
                              </Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                N/A
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleViewTranscript(student)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleExportTranscript(student)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {filteredStudents.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  Không tìm thấy học sinh nào phù hợp
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </main>
      <Footer />

      {/* Transcript Dialog */}
      <Dialog open={showTranscript} onOpenChange={setShowTranscript}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Học bạ học sinh
            </DialogTitle>
            <DialogDescription>
              Xem chi tiết học bạ và kết quả học tập
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6">
              {/* Student Info */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.name}`}
                  />
                  <AvatarFallback>
                    {selectedStudent.name.split(" ").slice(-1)[0].charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedStudent.name}</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                    <div>Mã số: {selectedStudent.id}</div>
                    <div>Lớp: {selectedStudent.class}</div>
                    <div>Ngày sinh: {selectedStudent.birthDate}</div>
                    <div>Email: {selectedStudent.email}</div>
                  </div>
                </div>
              </div>

              {/* Grades Table */}
              <div>
                <h4 className="font-semibold mb-3">Bảng điểm</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Môn học</TableHead>
                      <TableHead>Điểm 15 phút</TableHead>
                      <TableHead>Điểm 1 tiết</TableHead>
                      <TableHead>Điểm thi</TableHead>
                      <TableHead>Điểm TB</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const grades = getStudentGrades(selectedStudent);
                      return (
                        <>
                          <TableRow>
                            <TableCell className="font-medium">Toán</TableCell>
                            <TableCell>
                              {grades.math?.test15min?.join(", ") || "N/A"}
                            </TableCell>
                            <TableCell>
                              {grades.math?.test45min?.join(", ") || "N/A"}
                            </TableCell>
                            <TableCell>
                              {grades.math?.midterm ?? "N/A"}
                            </TableCell>
                            <TableCell>
                              {grades.math?.average ? (
                                <Badge
                                  className={cn(
                                    grades.math.average >= 8
                                      ? "bg-green-500/10 text-green-600"
                                      : grades.math.average >= 6.5
                                      ? "bg-blue-500/10 text-blue-600"
                                      : "bg-orange-500/10 text-orange-600"
                                  )}
                                >
                                  {grades.math.average.toFixed(1)}
                                </Badge>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Văn</TableCell>
                            <TableCell>
                              {grades.literature?.test15min?.join(", ") ||
                                "N/A"}
                            </TableCell>
                            <TableCell>
                              {grades.literature?.test45min?.join(", ") ||
                                "N/A"}
                            </TableCell>
                            <TableCell>
                              {grades.literature?.midterm ?? "N/A"}
                            </TableCell>
                            <TableCell>
                              {grades.literature?.average ? (
                                <Badge
                                  className={cn(
                                    grades.literature.average >= 8
                                      ? "bg-green-500/10 text-green-600"
                                      : grades.literature.average >= 6.5
                                      ? "bg-blue-500/10 text-blue-600"
                                      : "bg-orange-500/10 text-orange-600"
                                  )}
                                >
                                  {grades.literature.average.toFixed(1)}
                                </Badge>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              Vật lý
                            </TableCell>
                            <TableCell>
                              {grades.physics?.test15min?.join(", ") || "N/A"}
                            </TableCell>
                            <TableCell>
                              {grades.physics?.test45min?.join(", ") || "N/A"}
                            </TableCell>
                            <TableCell>
                              {grades.physics?.midterm ?? "N/A"}
                            </TableCell>
                            <TableCell>
                              {grades.physics?.average ? (
                                <Badge
                                  className={cn(
                                    grades.physics.average >= 8
                                      ? "bg-green-500/10 text-green-600"
                                      : grades.physics.average >= 6.5
                                      ? "bg-blue-500/10 text-blue-600"
                                      : "bg-orange-500/10 text-orange-600"
                                  )}
                                >
                                  {grades.physics.average.toFixed(1)}
                                </Badge>
                              ) : (
                                "N/A"
                              )}
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })()}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleExportTranscript(selectedStudent)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Xuất học bạ
                </Button>
                <Button onClick={() => setShowTranscript(false)}>Đóng</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
