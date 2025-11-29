"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Users, Search, ChevronRight, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface ClassInfo {
  id: string;
  name: string;
  grade: number;
  studentCount: number;
  homeroomTeacher: string;

  schoolYear: string;
}

const mockClasses: ClassInfo[] = [
  {
    id: "10A1",
    name: "10A1",
    grade: 10,
    studentCount: 35,
    homeroomTeacher: "Phạm Văn D",
    schoolYear: "2024-2025",
  },
  {
    id: "10A2",
    name: "10A2",
    grade: 10,
    studentCount: 33,
    homeroomTeacher: "Lê Văn K",
    schoolYear: "2024-2025",
  },
  {
    id: "10A3",
    name: "10A3",
    grade: 10,
    studentCount: 34,
    homeroomTeacher: "Nguyễn Thị L",
    schoolYear: "2024-2025",
  },
  {
    id: "11A1",
    name: "11A1",
    grade: 11,
    studentCount: 32,
    homeroomTeacher: "Nguyễn Thị M",
    schoolYear: "2024-2025",
  },
  {
    id: "11A2",
    name: "11A2",
    grade: 11,
    studentCount: 34,
    homeroomTeacher: "Trần Văn F",
    schoolYear: "2024-2025",
  },
  {
    id: "11A3",
    name: "11A3",
    grade: 11,
    studentCount: 31,
    homeroomTeacher: "Võ Thị N",
    schoolYear: "2023-2024",
  },
  {
    id: "12A1",
    name: "12A1",
    grade: 12,
    studentCount: 30,
    homeroomTeacher: "Nguyễn Văn H",
    schoolYear: "2023-2024",
  },
  {
    id: "12A2",
    name: "12A2",
    grade: 12,
    studentCount: 31,
    homeroomTeacher: "Võ Thị N",
    schoolYear: "2023-2024",
  },
  {
    id: "12A3",
    name: "12A3",
    grade: 12,
    studentCount: 29,
    homeroomTeacher: "Đặng Văn P",
    schoolYear: "2023-2024",
  },
];

export default function ClassListPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [schoolYearFilter, setSchoolYearFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const filteredClasses = mockClasses.filter((classItem) => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === "all" || classItem.grade === parseInt(gradeFilter);
    const matchesSchoolYear = schoolYearFilter === "all" || classItem.schoolYear === schoolYearFilter;
    return matchesSearch && matchesGrade && matchesSchoolYear;
  });

  const paginatedClasses = filteredClasses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleImportExcel = () => {
    // Trigger file input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls,.csv";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        // Handle file upload
        console.log("Importing file:", file.name);
        alert(`Đang import file: ${file.name}`);
      }
    };
    input.click();
  };

  const stats = [
    {
      label: "Tổng số lớp",
      value: mockClasses.length,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Khối 10",
      value: mockClasses.filter((c) => c.grade === 10).length,
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: "Khối 11",
      value: mockClasses.filter((c) => c.grade === 11).length,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Khối 12",
      value: mockClasses.filter((c) => c.grade === 12).length,
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  // Calculate total pages based on itemsPerPage
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

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
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold bg-linear-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Danh sách lớp học
            </h1>
            <p className="text-muted-foreground mt-2">Quản lý và xem chi tiết các lớp học trong trường</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard padding="md">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className={cn("text-3xl font-bold", stat.color)}>{stat.value}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Filters and Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard padding="lg">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm lớp..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={gradeFilter} onValueChange={setGradeFilter} className="w-full md:w-[180px]">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khối" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả khối</SelectItem>
                    <SelectItem value="10">Khối 10</SelectItem>
                    <SelectItem value="11">Khối 11</SelectItem>
                    <SelectItem value="12">Khối 12</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={schoolYearFilter} onValueChange={setSchoolYearFilter} className="w-full md:w-[180px]">
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn năm học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả năm học</SelectItem>
                    <SelectItem value="2023-2024">2023-2024</SelectItem>
                    <SelectItem value="2024-2025">2024-2025</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleImportExcel}
                  className="w-full md:w-auto bg-linear-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import từ Excel
                </Button>
              </div>

              {/* Classes Table */}
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Lớp</TableHead>
                      <TableHead>Khối</TableHead>
                      <TableHead>Sĩ số</TableHead>
                      <TableHead>GVCN</TableHead>
                      <TableHead>Năm học</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedClasses.map((classItem, index) => (
                      <motion.tr
                        key={classItem.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group hover:bg-muted/50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <GraduationCap className="h-4 w-4 text-primary" />
                            </div>
                            {classItem.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">Khối {classItem.grade}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            {classItem.studentCount}
                          </div>
                        </TableCell>
                        <TableCell>{classItem.homeroomTeacher}</TableCell>
                        <TableCell>{classItem.schoolYear}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/academic-officer/list-lop/${classItem.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                            >
                              Xem chi tiết
                              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredClasses.length === 0 && (
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Không tìm thấy lớp học nào</p>
                </div>
              )}

              {/* Pagination */}
              {filteredClasses.length > 0 && (
                <div className="mt-4">
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      />
                      {Array.from({ length: totalPages }, (_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            isActive={currentPage === index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      />
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
