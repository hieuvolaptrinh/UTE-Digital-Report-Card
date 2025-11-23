"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TeacherSidebar } from "@/components/layout/teacher/sidebar";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, FileText, Eye } from "lucide-react";

interface LeaveRequest {
  id: string;
  parentName: string;
  studentName: string;
  studentId: string;
  class: string;
  reason: string;
  fromDate: string;
  toDate: string;
  submittedDate: string;
  isNew: boolean;
}

// Hard-coded leave requests
const HARDCODED_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: "LR001",
    parentName: "Nguyễn Văn A",
    studentName: "Nguyễn Văn B",
    studentId: "SV001",
    class: "10A1",
    reason: "Em bị ốm, cần nghỉ học để điều trị",
    fromDate: "2024-12-18",
    toDate: "2024-12-18",
    submittedDate: "2024-12-17",
    isNew: true,
  },
  {
    id: "LR002",
    parentName: "Trần Thị C",
    studentName: "Trần Minh D",
    studentId: "SV002",
    class: "10A2",
    reason: "Gia đình có việc đột xuất, không thể đi học",
    fromDate: "2024-12-20",
    toDate: "2024-12-21",
    submittedDate: "2024-12-19",
    isNew: true,
  },
  {
    id: "LR003",
    parentName: "Lê Văn E",
    studentName: "Lê Hữu F",
    studentId: "SV003",
    class: "10A1",
    reason: "Đi chơi công viên với gia đình",
    fromDate: "2024-12-22",
    toDate: "2024-12-22",
    submittedDate: "2024-12-22",
    isNew: false,
  },
  {
    id: "LR004",
    parentName: "Phạm Thị G",
    studentName: "Phạm Anh H",
    studentId: "SV004",
    class: "10A3",
    reason: "Tham gia sự kiện đoàn trường",
    fromDate: "2024-12-23",
    toDate: "2024-12-23",
    submittedDate: "2024-12-21",
    isNew: true,
  },
  {
    id: "LR005",
    parentName: "Hoàng Văn I",
    studentName: "Hoàng Minh J",
    studentId: "SV005",
    class: "10A2",
    reason: "Em bị ốm nhẹ, xin phép 1 buổi",
    fromDate: "2024-12-24",
    toDate: "2024-12-24",
    submittedDate: "2024-12-23",
    isNew: false,
  },
];

export default function TeacherLeaveRequestsPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [sortBy, setSortBy] = useState<"date-asc" | "date-desc">("date-desc");
  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "new" | "viewed">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isTeacher(user))) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Get unique classes for filter
  const uniqueClasses = useMemo(() => {
    return Array.from(
      new Set(HARDCODED_LEAVE_REQUESTS.map((r) => r.class))
    ).sort();
  }, []);

  // Filter and sort requests
  const filteredRequests = useMemo(() => {
    let filtered = HARDCODED_LEAVE_REQUESTS;

    // Filter by class
    if (filterClass !== "all") {
      filtered = filtered.filter((r) => r.class === filterClass);
    }

    // Filter by status
    if (filterStatus === "new") {
      filtered = filtered.filter((r) => r.isNew);
    } else if (filterStatus === "viewed") {
      filtered = filtered.filter((r) => !r.isNew);
    }

    // Search by student name, parent name, or student ID
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.studentName.toLowerCase().includes(query) ||
          r.parentName.toLowerCase().includes(query) ||
          r.studentId.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.submittedDate).getTime();
      const dateB = new Date(b.submittedDate).getTime();
      return sortBy === "date-asc" ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [filterClass, filterStatus, searchQuery, sortBy]);

  // Count new requests
  const newRequestsCount = useMemo(() => {
    return HARDCODED_LEAVE_REQUESTS.filter((r) => r.isNew).length;
  }, []);

  // Format date to Vietnamese format
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // Calculate days count
  const getDaysCount = (fromDate: string, toDate: string) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  if (isLoading || !user || !isTeacher(user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const headerUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role as "teacher" | "principal",
  };

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <div className="flex">
        <TeacherSidebar user={headerUser} onLogout={logout} />
        <main className="flex-1 lg:ml-80 min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <div className="container mx-auto px-4 py-6 mt-16 lg:mt-0">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">Đơn xin vắng học</h1>
                  <p className="text-muted-foreground mt-1">
                    Quản lý đơn xin nghỉ phép từ phụ huynh
                  </p>
                </div>
                {newRequestsCount > 0 && (
                  <Badge variant="destructive" className="h-fit">
                    {newRequestsCount} mới
                  </Badge>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6"
            >
              <GlassCard padding="md">
                <div className="text-sm text-muted-foreground">Tổng đơn</div>
                <div className="text-2xl font-bold mt-2">
                  {HARDCODED_LEAVE_REQUESTS.length}
                </div>
              </GlassCard>
              <GlassCard padding="md">
                <div className="text-sm text-muted-foreground">Đơn mới</div>
                <div className="text-2xl font-bold mt-2 text-destructive">
                  {newRequestsCount}
                </div>
              </GlassCard>
              <GlassCard padding="md">
                <div className="text-sm text-muted-foreground">Đã xem xét</div>
                <div className="text-2xl font-bold mt-2">
                  {HARDCODED_LEAVE_REQUESTS.filter((r) => !r.isNew).length}
                </div>
              </GlassCard>
              <GlassCard padding="md">
                <div className="text-sm text-muted-foreground">Học sinh</div>
                <div className="text-2xl font-bold mt-2">
                  {
                    new Set(HARDCODED_LEAVE_REQUESTS.map((r) => r.studentId))
                      .size
                  }
                </div>
              </GlassCard>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-6"
            >
              <GlassCard padding="md">
                <div className="flex items-center gap-3 mb-4">
                  <Filter className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Tìm kiếm & Lọc</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Tìm kiếm</Label>
                    <Input
                      id="search"
                      placeholder="Tên học sinh, phụ huynh, MSSV..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class-filter">Lớp</Label>
                    <Select value={filterClass} onValueChange={setFilterClass}>
                      <SelectTrigger id="class-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả lớp</SelectItem>
                        {uniqueClasses.map((className) => (
                          <SelectItem key={className} value={className}>
                            {className}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status-filter">Trạng thái</Label>
                    <Select
                      value={filterStatus}
                      onValueChange={(value) =>
                        setFilterStatus(value as "all" | "new" | "viewed")
                      }
                    >
                      <SelectTrigger id="status-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="new">Mới</SelectItem>
                        <SelectItem value="viewed">Đã xem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sort">Sắp xếp</Label>
                    <Select
                      value={sortBy}
                      onValueChange={(value) =>
                        setSortBy(value as "date-asc" | "date-desc")
                      }
                    >
                      <SelectTrigger id="sort">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date-desc">
                          Mới nhất trước
                        </SelectItem>
                        <SelectItem value="date-asc">Cũ nhất trước</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard padding="md">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Học sinh</TableHead>
                        <TableHead>Phụ huynh</TableHead>
                        <TableHead>Lớp</TableHead>
                        <TableHead className="text-right">Ngày xin</TableHead>
                        <TableHead>Lý do</TableHead>
                        <TableHead className="text-center">Thời gian</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRequests.length > 0 ? (
                        filteredRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              {request.isNew && (
                                <Badge
                                  variant="destructive"
                                  className="h-6 w-6 rounded-full flex items-center justify-center p-0 text-xs"
                                >
                                  {newRequestsCount}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              {request.studentName}
                              <div className="text-xs text-muted-foreground mt-1">
                                {request.studentId}
                              </div>
                            </TableCell>
                            <TableCell>{request.parentName}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{request.class}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {formatDate(request.submittedDate)}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {request.reason}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="text-sm">
                                {getDaysCount(request.fromDate, request.toDate)}{" "}
                                ngày
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(request.fromDate)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                                Chi tiết
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <div className="text-muted-foreground">
                              Không có đơn xin vắng học
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Chi tiết đơn xin vắng học
            </DialogTitle>
            {selectedRequest?.isNew && (
              <Badge variant="destructive" className="w-fit">
                Mới
              </Badge>
            )}
          </DialogHeader>
          <DialogDescription className="space-y-4">
            {selectedRequest && (
              <>
                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Mã đơn
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedRequest.id}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Học sinh
                    </label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRequest.studentName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedRequest.studentId}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Lớp
                    </label>
                    <p className="text-sm font-medium mt-1">
                      {selectedRequest.class}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Phụ huynh
                  </label>
                  <p className="text-sm font-medium mt-1">
                    {selectedRequest.parentName}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Lý do xin vắng
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedRequest.reason}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Từ ngày
                    </label>
                    <p className="text-sm font-medium mt-1">
                      {formatDate(selectedRequest.fromDate)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground">
                      Đến ngày
                    </label>
                    <p className="text-sm font-medium mt-1">
                      {formatDate(selectedRequest.toDate)}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Tổng thời gian
                  </label>
                  <p className="text-sm font-medium mt-1">
                    {getDaysCount(
                      selectedRequest.fromDate,
                      selectedRequest.toDate
                    )}{" "}
                    ngày
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground">
                    Ngày gửi
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(selectedRequest.submittedDate)}
                  </p>
                </div>

                <div className="pt-4 flex gap-2">
                  <Button variant="outline" className="flex-1">
                    Từ chối
                  </Button>
                  <Button className="flex-1">Chấp nhận</Button>
                </div>
              </>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
