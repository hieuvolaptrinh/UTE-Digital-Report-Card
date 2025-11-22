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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GraduationCap, Search, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  mockStudents10A1,
  mockStudents10A2,
  mockStudents11A2,
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

export default function AllStudentsPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");

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

  const filteredStudents = allStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === "all" || student.class === classFilter;
    const matchesGender =
      genderFilter === "all" || student.gender === genderFilter;
    return matchesSearch && matchesClass && matchesGender;
  });

  const handleExport = () => {
    const csvContent = [
      ["Mã số", "Họ và tên", "Lớp", "Giới tính", "Ngày sinh", "Email", "SĐT"],
      ...filteredStudents.map((s) => [
        s.id,
        s.name,
        s.class,
        s.gender === "male" ? "Nam" : "Nữ",
        s.birthDate,
        s.email,
        s.phone,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `danh-sach-hoc-sinh-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  const classOptions = ["all", "10A1", "10A2", "11A2", "12A1", "12A2"];

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
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    Danh sách học sinh toàn trường
                  </h1>
                  <p className="text-muted-foreground">
                    Tổng số: {filteredStudents.length} học sinh
                  </p>
                </div>
              </div>
              <Button onClick={handleExport} className="gap-2">
                <Download className="h-4 w-4" />
                Xuất Excel
              </Button>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <GlassCard padding="lg" className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm tên, mã số, email..."
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

                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Lọc theo giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
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
                      <TableHead>Giới tính</TableHead>
                      <TableHead>Ngày sinh</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Số điện thoại</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student, index) => (
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
                                {student.name.split(" ").slice(-1)[0].charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {student.id}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{student.class}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={cn(
                              student.gender === "male"
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                : "bg-pink-500/10 text-pink-600 border-pink-500/20"
                            )}
                          >
                            {student.gender === "male" ? "Nam" : "Nữ"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {student.birthDate}
                        </TableCell>
                        <TableCell className="text-sm">
                          {student.email}
                        </TableCell>
                        <TableCell className="text-sm">
                          {student.phone}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredStudents.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  Không tìm thấy học sinh nào phù hợp với tiêu chí tìm kiếm
                </div>
              )}
            </GlassCard>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassCard padding="md">
                <p className="text-sm text-muted-foreground">Nam</p>
                <p className="text-2xl font-bold">
                  {filteredStudents.filter((s) => s.gender === "male").length}
                </p>
              </GlassCard>
              <GlassCard padding="md">
                <p className="text-sm text-muted-foreground">Nữ</p>
                <p className="text-2xl font-bold">
                  {filteredStudents.filter((s) => s.gender === "female").length}
                </p>
              </GlassCard>
              <GlassCard padding="md">
                <p className="text-sm text-muted-foreground">Tổng số</p>
                <p className="text-2xl font-bold">{filteredStudents.length}</p>
              </GlassCard>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
