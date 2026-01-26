"use client";

import * as React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  BookOpen,
  Plus,
  Trash2,
  Users,
  ChevronRight,
  Search,
  UserPlus,
  GraduationCap,
  Mail,
  Phone,
  ArrowLeft,
} from "lucide-react";

// Types
interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  grade: number;
  description: string;
  teachers: Teacher[];
}

// Hardcoded data - Danh sách giáo viên
const allTeachers: Teacher[] = [
  {
    id: "gv001",
    name: "Nguyễn Văn An",
    email: "nguyenvanan@school.edu.vn",
    phone: "0901234567",
  },
  {
    id: "gv002",
    name: "Trần Thị Bình",
    email: "tranthibinh@school.edu.vn",
    phone: "0902345678",
  },
  {
    id: "gv003",
    name: "Lê Hoàng Cường",
    email: "lehoangcuong@school.edu.vn",
    phone: "0903456789",
  },
  {
    id: "gv004",
    name: "Phạm Minh Dũng",
    email: "phamminhdung@school.edu.vn",
    phone: "0904567890",
  },
  {
    id: "gv005",
    name: "Hoàng Thị Lan",
    email: "hoangthilan@school.edu.vn",
    phone: "0905678901",
  },
  {
    id: "gv006",
    name: "Vũ Đức Hải",
    email: "vuduchau@school.edu.vn",
    phone: "0906789012",
  },
  {
    id: "gv007",
    name: "Đặng Thị Mai",
    email: "dangthimai@school.edu.vn",
    phone: "0907890123",
  },
  {
    id: "gv008",
    name: "Bùi Văn Nam",
    email: "buivannam@school.edu.vn",
    phone: "0908901234",
  },
  {
    id: "gv009",
    name: "Ngô Thị Oanh",
    email: "ngothioanh@school.edu.vn",
    phone: "0909012345",
  },
  {
    id: "gv010",
    name: "Trịnh Văn Phúc",
    email: "trinhvanphuc@school.edu.vn",
    phone: "0910123456",
  },
  {
    id: "gv011",
    name: "Lý Thị Quỳnh",
    email: "lythiquynh@school.edu.vn",
    phone: "0911234567",
  },
  {
    id: "gv012",
    name: "Đinh Văn Sơn",
    email: "dinhvanson@school.edu.vn",
    phone: "0912345678",
  },
  {
    id: "gv013",
    name: "Cao Thị Trang",
    email: "caothitrang@school.edu.vn",
    phone: "0913456789",
  },
  {
    id: "gv014",
    name: "Hồ Văn Uy",
    email: "hovanuy@school.edu.vn",
    phone: "0914567890",
  },
  {
    id: "gv015",
    name: "Đỗ Thị Vân",
    email: "dothivan@school.edu.vn",
    phone: "0915678901",
  },
];

// Hardcoded data - Danh sách môn học với giáo viên phụ trách
const initialSubjects: Subject[] = [
  {
    id: "mh001",
    name: "Toán 10",
    code: "TOAN10",
    grade: 10,
    description: "Môn Toán học lớp 10 - Chương trình cơ bản và nâng cao",
    teachers: [allTeachers[0], allTeachers[1], allTeachers[2]],
  },
  {
    id: "mh002",
    name: "Toán 11",
    code: "TOAN11",
    grade: 11,
    description: "Môn Toán học lớp 11 - Đại số và Hình học",
    teachers: [allTeachers[0], allTeachers[3]],
  },
  {
    id: "mh003",
    name: "Toán 12",
    code: "TOAN12",
    grade: 12,
    description: "Môn Toán học lớp 12 - Giải tích và Hình học không gian",
    teachers: [allTeachers[1], allTeachers[2], allTeachers[4], allTeachers[5]],
  },
  {
    id: "mh004",
    name: "Vật Lý 10",
    code: "VL10",
    grade: 10,
    description: "Môn Vật lý lớp 10 - Cơ học và Nhiệt học",
    teachers: [allTeachers[6], allTeachers[7]],
  },
  {
    id: "mh005",
    name: "Vật Lý 11",
    code: "VL11",
    grade: 11,
    description: "Môn Vật lý lớp 11 - Điện học và Quang học",
    teachers: [allTeachers[6]],
  },
  {
    id: "mh006",
    name: "Vật Lý 12",
    code: "VL12",
    grade: 12,
    description: "Môn Vật lý lớp 12 - Dao động và Sóng, Vật lý hạt nhân",
    teachers: [allTeachers[7], allTeachers[8], allTeachers[9]],
  },
  {
    id: "mh007",
    name: "Hóa Học 10",
    code: "HH10",
    grade: 10,
    description: "Môn Hóa học lớp 10 - Nguyên tử và Liên kết hóa học",
    teachers: [allTeachers[10], allTeachers[11]],
  },
  {
    id: "mh008",
    name: "Hóa Học 11",
    code: "HH11",
    grade: 11,
    description: "Môn Hóa học lớp 11 - Hóa hữu cơ cơ bản",
    teachers: [allTeachers[10], allTeachers[12]],
  },
  {
    id: "mh009",
    name: "Hóa Học 12",
    code: "HH12",
    grade: 12,
    description: "Môn Hóa học lớp 12 - Hóa hữu cơ nâng cao và Kim loại",
    teachers: [allTeachers[11], allTeachers[12], allTeachers[13]],
  },
  {
    id: "mh010",
    name: "Ngữ Văn 10",
    code: "NV10",
    grade: 10,
    description: "Môn Ngữ văn lớp 10 - Văn học dân gian và Văn học trung đại",
    teachers: [allTeachers[3], allTeachers[4]],
  },
  {
    id: "mh011",
    name: "Ngữ Văn 11",
    code: "NV11",
    grade: 11,
    description: "Môn Ngữ văn lớp 11 - Văn học hiện đại Việt Nam",
    teachers: [allTeachers[4], allTeachers[14]],
  },
  {
    id: "mh012",
    name: "Ngữ Văn 12",
    code: "NV12",
    grade: 12,
    description: "Môn Ngữ văn lớp 12 - Văn học hiện đại và đương đại",
    teachers: [allTeachers[3], allTeachers[14]],
  },
  {
    id: "mh013",
    name: "Tiếng Anh 10",
    code: "TA10",
    grade: 10,
    description: "Môn Tiếng Anh lớp 10 - Elementary to Pre-Intermediate",
    teachers: [allTeachers[5], allTeachers[8]],
  },
  {
    id: "mh014",
    name: "Tiếng Anh 11",
    code: "TA11",
    grade: 11,
    description: "Môn Tiếng Anh lớp 11 - Pre-Intermediate to Intermediate",
    teachers: [allTeachers[5], allTeachers[9], allTeachers[13]],
  },
  {
    id: "mh015",
    name: "Tiếng Anh 12",
    code: "TA12",
    grade: 12,
    description: "Môn Tiếng Anh lớp 12 - Intermediate to Upper-Intermediate",
    teachers: [allTeachers[8], allTeachers[9]],
  },
  {
    id: "mh016",
    name: "Sinh Học 10",
    code: "SH10",
    grade: 10,
    description: "Môn Sinh học lớp 10 - Tế bào học và Vi sinh vật",
    teachers: [allTeachers[12]],
  },
  {
    id: "mh017",
    name: "Sinh Học 11",
    code: "SH11",
    grade: 11,
    description: "Môn Sinh học lớp 11 - Sinh lý học động vật và thực vật",
    teachers: [allTeachers[12], allTeachers[13]],
  },
  {
    id: "mh018",
    name: "Sinh Học 12",
    code: "SH12",
    grade: 12,
    description: "Môn Sinh học lớp 12 - Di truyền học và Tiến hóa",
    teachers: [allTeachers[13], allTeachers[14]],
  },
  {
    id: "mh019",
    name: "Lịch Sử 10",
    code: "LS10",
    grade: 10,
    description: "Môn Lịch sử lớp 10 - Lịch sử thế giới cổ-trung đại",
    teachers: [allTeachers[2], allTeachers[7]],
  },
  {
    id: "mh020",
    name: "Địa Lý 10",
    code: "DL10",
    grade: 10,
    description: "Môn Địa lý lớp 10 - Địa lý tự nhiên và kinh tế-xã hội",
    teachers: [allTeachers[1], allTeachers[6], allTeachers[11]],
  },
  {
    id: "mh021",
    name: "GDCD 10",
    code: "GDCD10",
    grade: 10,
    description: "Môn Giáo dục công dân lớp 10 - Công dân với đời sống xã hội",
    teachers: [allTeachers[0], allTeachers[14]],
  },
  {
    id: "mh022",
    name: "Tin Học 10",
    code: "TH10",
    grade: 10,
    description: "Môn Tin học lớp 10 - Khoa học máy tính cơ bản",
    teachers: [allTeachers[5], allTeachers[10]],
  },
  {
    id: "mh023",
    name: "Tin Học 11",
    code: "TH11",
    grade: 11,
    description: "Môn Tin học lớp 11 - Lập trình cơ bản",
    teachers: [allTeachers[5], allTeachers[10], allTeachers[11]],
  },
  {
    id: "mh024",
    name: "Tin Học 12",
    code: "TH12",
    grade: 12,
    description: "Môn Tin học lớp 12 - Cơ sở dữ liệu và Mạng máy tính",
    teachers: [allTeachers[10]],
  },
];

export default function SubjectManagementPage() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [teacherSearchTerm, setTeacherSearchTerm] = useState("");

  // New subject form state
  const [newSubject, setNewSubject] = useState({
    name: "",
    code: "",
    grade: 10,
    description: "",
  });

  // Filter subjects based on search term
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Filter available teachers (not already assigned to selected subject)
  const availableTeachers = allTeachers.filter(
    (teacher) =>
      !selectedSubject?.teachers.some((t) => t.id === teacher.id) &&
      (teacher.name.toLowerCase().includes(teacherSearchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(teacherSearchTerm.toLowerCase())),
  );

  // Handle add new subject
  const handleAddSubject = () => {
    if (newSubject.name && newSubject.code) {
      const subject: Subject = {
        id: `mh${String(subjects.length + 1).padStart(3, "0")}`,
        name: newSubject.name,
        code: newSubject.code,
        grade: newSubject.grade,
        description: newSubject.description,
        teachers: [],
      };
      setSubjects([subject, ...subjects]);
      setNewSubject({ name: "", code: "", grade: 10, description: "" });
      setIsAddSubjectOpen(false);
    }
  };

  // Handle add teacher to subject
  const handleAddTeacher = (teacher: Teacher) => {
    if (selectedSubject) {
      const updatedSubjects = subjects.map((subject) =>
        subject.id === selectedSubject.id
          ? { ...subject, teachers: [...subject.teachers, teacher] }
          : subject,
      );
      setSubjects(updatedSubjects);
      setSelectedSubject({
        ...selectedSubject,
        teachers: [...selectedSubject.teachers, teacher],
      });
    }
    setIsAddTeacherOpen(false);
    setTeacherSearchTerm("");
  };

  // Handle remove teacher from subject
  const handleRemoveTeacher = (teacherId: string) => {
    if (selectedSubject) {
      const updatedTeachers = selectedSubject.teachers.filter(
        (t) => t.id !== teacherId,
      );
      const updatedSubjects = subjects.map((subject) =>
        subject.id === selectedSubject.id
          ? { ...subject, teachers: updatedTeachers }
          : subject,
      );
      setSubjects(updatedSubjects);
      setSelectedSubject({ ...selectedSubject, teachers: updatedTeachers });
    }
  };

  // Get grade badge color
  const getGradeBadgeVariant = (
    grade: number,
  ): "default" | "secondary" | "outline" => {
    switch (grade) {
      case 10:
        return "default";
      case 11:
        return "secondary";
      case 12:
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            Quản lý Môn học
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý danh sách môn học và giáo viên phụ trách
          </p>
        </div>

        {/* Add Subject Dialog */}
        <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Thêm môn học mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Thêm môn học mới
              </DialogTitle>
              <DialogDescription>
                Nhập thông tin môn học mới vào hệ thống
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Tên môn học <span className="text-destructive">*</span>
                </label>
                <Input
                  id="name"
                  placeholder="VD: Toán 10"
                  value={newSubject.name}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, name: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="code" className="text-sm font-medium">
                    Mã môn học <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="code"
                    placeholder="VD: TOAN10"
                    value={newSubject.code}
                    onChange={(e) =>
                      setNewSubject({ ...newSubject, code: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="grade" className="text-sm font-medium">
                    Khối lớp
                  </label>
                  <select
                    id="grade"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={newSubject.grade}
                    onChange={(e) =>
                      setNewSubject({
                        ...newSubject,
                        grade: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value={10}>Lớp 10</option>
                    <option value={11}>Lớp 11</option>
                    <option value={12}>Lớp 12</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Mô tả về môn học..."
                  value={newSubject.description}
                  onChange={(e) =>
                    setNewSubject({
                      ...newSubject,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddSubjectOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleAddSubject}>Thêm môn học</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subject List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Danh sách môn học</CardTitle>
              <CardDescription>
                Tổng cộng {subjects.length} môn học
              </CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm môn học..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto">
                {filteredSubjects.map((subject) => (
                  <div
                    key={subject.id}
                    className={`flex items-center justify-between p-4 border-b cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedSubject?.id === subject.id
                        ? "bg-primary/10 border-l-4 border-l-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedSubject(subject)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{subject.name}</h3>
                        <Badge
                          variant={getGradeBadgeVariant(subject.grade)}
                          className="text-xs"
                        >
                          Lớp {subject.grade}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                          {subject.code}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {subject.teachers.length} GV
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                ))}
                {filteredSubjects.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>Không tìm thấy môn học nào</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Detail */}
        <div className="lg:col-span-2">
          {selectedSubject ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="lg:hidden"
                        onClick={() => setSelectedSubject(null)}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <CardTitle className="text-xl">
                        {selectedSubject.name}
                      </CardTitle>
                      <Badge
                        variant={getGradeBadgeVariant(selectedSubject.grade)}
                      >
                        Lớp {selectedSubject.grade}
                      </Badge>
                    </div>
                    <CardDescription className="flex flex-col gap-1">
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded w-fit">
                        Mã môn: {selectedSubject.code}
                      </span>
                      <span className="mt-2">
                        {selectedSubject.description}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Teachers Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      Giáo viên phụ trách ({selectedSubject.teachers.length})
                    </h3>

                    {/* Add Teacher Dialog */}
                    <Dialog
                      open={isAddTeacherOpen}
                      onOpenChange={setIsAddTeacherOpen}
                    >
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-1">
                          <UserPlus className="h-4 w-4" />
                          Thêm giáo viên
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Thêm giáo viên phụ trách
                          </DialogTitle>
                          <DialogDescription>
                            Chọn giáo viên để thêm vào môn{" "}
                            <strong>{selectedSubject.name}</strong>
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Tìm kiếm giáo viên..."
                              value={teacherSearchTerm}
                              onChange={(e) =>
                                setTeacherSearchTerm(e.target.value)
                              }
                              className="pl-9"
                            />
                          </div>
                          <div className="max-h-[300px] overflow-y-auto space-y-2">
                            {availableTeachers.map((teacher) => (
                              <div
                                key={teacher.id}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                onClick={() => handleAddTeacher(teacher)}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-sm font-medium text-primary">
                                      {teacher.name.split(" ").pop()?.charAt(0)}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-medium">
                                      {teacher.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {teacher.email}
                                    </p>
                                  </div>
                                </div>
                                <Button size="sm" variant="ghost">
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            {availableTeachers.length === 0 && (
                              <div className="p-8 text-center text-muted-foreground">
                                <Users className="h-12 w-12 mx-auto mb-2 opacity-20" />
                                <p>Không còn giáo viên nào để thêm</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Teachers Table */}
                  {selectedSubject.teachers.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">#</TableHead>
                          <TableHead>Họ và tên</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Số điện thoại</TableHead>
                          <TableHead className="w-[100px] text-right">
                            Thao tác
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedSubject.teachers.map((teacher, index) => (
                          <TableRow key={teacher.id}>
                            <TableCell className="font-medium">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xs font-medium text-primary">
                                    {teacher.name.split(" ").pop()?.charAt(0)}
                                  </span>
                                </div>
                                <span className="font-medium">
                                  {teacher.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {teacher.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {teacher.phone}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleRemoveTeacher(teacher.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="border rounded-lg p-8 text-center">
                      <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                      <p className="text-muted-foreground mb-3">
                        Chưa có giáo viên nào phụ trách môn học này
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsAddTeacherOpen(true)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Thêm giáo viên đầu tiên
                      </Button>
                    </div>
                  )}
                </div>

                {/* Statistics */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedSubject.teachers.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Giáo viên</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {selectedSubject.grade}
                    </p>
                    <p className="text-sm text-muted-foreground">Khối lớp</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-950/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-orange-600">45</p>
                    <p className="text-sm text-muted-foreground">Tiết/tuần</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.floor(Math.random() * 10) + 5}
                    </p>
                    <p className="text-sm text-muted-foreground">Lớp học</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full min-h-[400px] flex items-center justify-center">
              <div className="text-center p-8">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-lg font-medium mb-2">
                  Chọn một môn học để xem chi tiết
                </h3>
                <p className="text-muted-foreground">
                  Nhấp vào môn học bên trái để xem danh sách giáo viên phụ trách
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
