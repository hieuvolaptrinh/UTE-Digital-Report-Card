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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Clock, Check, X, Eye, Calendar, User, BookOpen, Filter, Image as ImageIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface GradeEditRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  class: string;
  subject: string;
  scoreType: string;
  oldScore: number;
  newScore: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
  imageUrl?: string;
  semester: string;
  schoolYear: string;
}

const mockRequests: GradeEditRequest[] = [
  {
    id: "REQ001",
    teacherId: "GV001",
    teacherName: "Phạm Văn D",
    studentId: "2024001",
    studentName: "Nguyễn Văn A",
    class: "10A1",
    subject: "Toán học",
    scoreType: "Kiểm tra 15 phút",
    oldScore: 7.5,
    newScore: 8.5,
    reason: "Nhầm lẫn khi nhập điểm, đã kiểm tra lại bài làm của học sinh",
    status: "pending",
    submittedAt: "2024-11-10T10:30:00Z",
    imageUrl: "/baiktr.jpg",
    semester: "Học kỳ 1",
    schoolYear: "2024-2025",
  },
  {
    id: "REQ002",
    teacherId: "GV002",
    teacherName: "Nguyễn Thị E",
    studentId: "2024002",
    studentName: "Trần Thị B",
    class: "10A1",
    subject: "Văn học",
    scoreType: "Điểm miệng",
    oldScore: 8.0,
    newScore: 9.0,
    reason: "Học sinh có phần trả lời rất tốt nhưng chưa được ghi nhận đầy đủ",
    status: "pending",
    submittedAt: "2024-11-09T14:20:00Z",
    imageUrl: "/baiktr.jpg",
    semester: "Học kỳ 1",
    schoolYear: "2024-2025",
  },
  {
    id: "REQ003",
    teacherId: "GV003",
    teacherName: "Trần Văn F",
    studentId: "2024019",
    studentName: "Quách Văn T",
    class: "11A2",
    subject: "Vật lý",
    scoreType: "Kiểm tra 45 phút",
    oldScore: 6.5,
    newScore: 7.5,
    reason: "Sai sót trong quá trình chấm điểm, cần điều chỉnh",
    status: "approved",
    submittedAt: "2024-11-08T09:15:00Z",
    reviewedAt: "2024-11-08T16:30:00Z",
    reviewNote: "Đã xem xét và đồng ý chỉnh sửa điểm",
    imageUrl: "/baiktr.jpg",
    semester: "Học kỳ 1",
    schoolYear: "2024-2025",
  },
  {
    id: "REQ004",
    teacherId: "GV004",
    teacherName: "Lê Thị G",
    studentId: "2024011",
    studentName: "Trịnh Văn L",
    class: "10A2",
    subject: "Tiếng Anh",
    scoreType: "Giữa kỳ",
    oldScore: 7.0,
    newScore: 8.0,
    reason: "Học sinh có bài làm tốt nhưng điểm chưa phản ánh đúng",
    status: "rejected",
    submittedAt: "2024-11-07T11:00:00Z",
    reviewedAt: "2024-11-07T17:45:00Z",
    reviewNote: "Điểm đã chấm chính xác, không chấp nhận thay đổi",
    semester: "Học kỳ 1",
    schoolYear: "2024-2025",
  },
  {
    id: "REQ005",
    teacherId: "GV001",
    teacherName: "Phạm Văn D",
    studentId: "2024003",
    studentName: "Lê Văn C",
    class: "10A1",
    subject: "Toán học",
    scoreType: "Cuối kỳ",
    oldScore: 6.0,
    newScore: 7.0,
    reason: "Phát hiện sai sót trong bài chấm, cần điều chỉnh lại điểm",
    status: "pending",
    submittedAt: "2024-11-10T08:45:00Z",
    semester: "Học kỳ 1",
    schoolYear: "2024-2025",
  },
  {
    id: "REQ006",
    teacherId: "GV005",
    teacherName: "Nguyễn Văn H",
    studentId: "2024004",
    studentName: "Phạm Thị D",
    class: "11A3",
    subject: "Hóa học",
    scoreType: "Kiểm tra 15 phút",
    oldScore: 5.5,
    newScore: 6.5,
    reason: "Điểm nhập sai do lỗi hệ thống",
    status: "pending",
    submittedAt: "2024-11-11T09:00:00Z",
    semester: "Học kỳ 1",
    schoolYear: "2024-2025",
  },
  {
    id: "REQ007",
    teacherId: "GV006",
    teacherName: "Lê Thị I",
    studentId: "2024005",
    studentName: "Nguyễn Văn E",
    class: "12A1",
    subject: "Sinh học",
    scoreType: "Điểm miệng",
    oldScore: 7.0,
    newScore: 8.0,
    reason: "Học sinh trả lời tốt hơn dự kiến",
    status: "approved",
    submittedAt: "2024-11-12T10:15:00Z",
    reviewedAt: "2024-11-12T15:30:00Z",
    reviewNote: "Đã kiểm tra và đồng ý",
    semester: "Học kỳ 1",
    schoolYear: "2024-2025",
  },
  {
    id: "REQ008",
    teacherId: "GV007",
    teacherName: "Trần Văn J",
    studentId: "2024006",
    studentName: "Lê Thị F",
    class: "10A4",
    subject: "Lịch sử",
    scoreType: "Giữa kỳ",
    oldScore: 6.0,
    newScore: 7.0,
    reason: "Sai sót trong quá trình nhập điểm",
    status: "rejected",
    submittedAt: "2024-11-13T08:45:00Z",
    reviewedAt: "2024-11-13T14:00:00Z",
    reviewNote: "Điểm đã chính xác, không cần chỉnh sửa",
    semester: "Học kỳ 1",
    schoolYear: "2024-2025",
  },
  {
    id: "REQ009",
    teacherId: "GV008",
    teacherName: "Phạm Văn K",
    studentId: "2024007",
    studentName: "Trần Văn G",
    class: "11A2",
    subject: "Địa lý",
    scoreType: "Cuối kỳ",
    oldScore: 8.5,
    newScore: 9.0,
    reason: "Học sinh có phần trình bày xuất sắc",
    status: "pending",
    submittedAt: "2024-11-14T11:30:00Z",
    semester: "Học kỳ 1",
    schoolYear: "2024-2025",
  },
  {
    id: "REQ010",
    teacherId: "GV009",
    teacherName: "Nguyễn Thị L",
    studentId: "2024008",
    studentName: "Phạm Văn H",
    class: "12A3",
    subject: "Vật lý",
    scoreType: "Kiểm tra 45 phút",
    oldScore: 7.5,
    newScore: 8.5,
    reason: "Điểm nhập sai do lỗi kỹ thuật",
    status: "approved",
    submittedAt: "2024-11-15T13:00:00Z",
    reviewedAt: "2024-11-15T17:00:00Z",
    reviewNote: "Đã kiểm tra và đồng ý chỉnh sửa",
    semester: "Học kỳ 1",
    schoolYear: "2024-2025",
  },
  {
    id: "REQ011",
    teacherId: "GV010",
    teacherName: "Lê Văn M",
    studentId: "2024009",
    studentName: "Nguyễn Thị I",
    class: "10A5",
    subject: "Tiếng Anh",
    scoreType: "Điểm miệng",
    oldScore: 6.5,
    newScore: 7.5,
    reason: "Học sinh có phần trả lời tốt hơn dự kiến",
    status: "rejected",
    submittedAt: "2024-11-16T14:30:00Z",
    reviewedAt: "2024-11-16T18:45:00Z",
    reviewNote: "Không cần chỉnh sửa, điểm đã chính xác",
    semester: "Học kỳ 1",
    schoolYear: "2024-2025",
  },
  {
    id: "REQ012",
    teacherId: "GV011",
    teacherName: "Nguyễn Văn N",
    studentId: "2023001",
    studentName: "Trần Thị O",
    class: "12A1",
    subject: "Toán học",
    scoreType: "Cuối kỳ",
    oldScore: 8.0,
    newScore: 9.0,
    reason: "Học sinh có bài làm xuất sắc",
    status: "approved",
    submittedAt: "2023-11-10T10:30:00Z",
    reviewedAt: "2023-11-15T14:00:00Z",
    reviewNote: "Đã kiểm tra và đồng ý chỉnh sửa",
    semester: "Học kỳ 1",
    schoolYear: "2023-2024",
  },
  {
    id: "REQ013",
    teacherId: "GV012",
    teacherName: "Lê Thị P",
    studentId: "2023002",
    studentName: "Nguyễn Văn Q",
    class: "11A2",
    subject: "Vật lý",
    scoreType: "Giữa kỳ",
    oldScore: 6.5,
    newScore: 7.0,
    reason: "Sai sót trong quá trình nhập điểm",
    status: "rejected",
    submittedAt: "2023-10-20T09:00:00Z",
    reviewedAt: "2023-10-25T16:30:00Z",
    reviewNote: "Điểm đã chính xác, không cần chỉnh sửa",
    semester: "Học kỳ 1",
    schoolYear: "2023-2024",
  },
  {
    id: "REQ014",
    teacherId: "GV013",
    teacherName: "Phạm Văn R",
    studentId: "2022003",
    studentName: "Lê Thị S",
    class: "10A3",
    subject: "Hóa học",
    scoreType: "Kiểm tra 15 phút",
    oldScore: 5.0,
    newScore: 6.0,
    reason: "Điểm nhập sai do lỗi hệ thống",
    status: "approved",
    submittedAt: "2022-09-15T08:30:00Z",
    reviewedAt: "2022-09-20T13:45:00Z",
    reviewNote: "Đã kiểm tra và đồng ý chỉnh sửa",
    semester: "Học kỳ 1",
    schoolYear: "2022-2023",
  },
  {
    id: "REQ015",
    teacherId: "GV014",
    teacherName: "Nguyễn Thị T",
    studentId: "2022004",
    studentName: "Trần Văn U",
    class: "11A4",
    subject: "Sinh học",
    scoreType: "Điểm miệng",
    oldScore: 7.0,
    newScore: 7.5,
    reason: "Học sinh trả lời tốt hơn dự kiến",
    status: "rejected",
    submittedAt: "2022-10-10T11:00:00Z",
    reviewedAt: "2022-10-15T15:30:00Z",
    reviewNote: "Không cần chỉnh sửa, điểm đã chính xác",
    semester: "Học kỳ 1",
    schoolYear: "2022-2023",
  },
  {
    id: "REQ016",
    teacherId: "GV015",
    teacherName: "Lê Văn V",
    studentId: "2021005",
    studentName: "Nguyễn Thị W",
    class: "12A5",
    subject: "Lịch sử",
    scoreType: "Cuối kỳ",
    oldScore: 8.5,
    newScore: 9.0,
    reason: "Học sinh có phần trình bày xuất sắc",
    status: "approved",
    submittedAt: "2021-11-05T14:30:00Z",
    reviewedAt: "2021-11-10T17:00:00Z",
    reviewNote: "Đã kiểm tra và đồng ý chỉnh sửa",
    semester: "Học kỳ 1",
    schoolYear: "2021-2022",
  },
  {
    id: "REQ017",
    teacherId: "GV016",
    teacherName: "Phạm Văn X",
    studentId: "2021006",
    studentName: "Lê Văn Y",
    class: "10A6",
    subject: "Địa lý",
    scoreType: "Giữa kỳ",
    oldScore: 6.0,
    newScore: 6.5,
    reason: "Sai sót trong quá trình nhập điểm",
    status: "rejected",
    submittedAt: "2021-10-01T09:15:00Z",
    reviewedAt: "2021-10-06T14:45:00Z",
    reviewNote: "Điểm đã chính xác, không cần chỉnh sửa",
    semester: "Học kỳ 1",
    schoolYear: "2021-2022",
  },
];

export default function GradeEditApprovalPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<GradeEditRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<GradeEditRequest | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | "view">("view");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterTeacher, setFilterTeacher] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  const handleOpenDialog = (request: GradeEditRequest, action: "approve" | "reject" | "view") => {
    setSelectedRequest(request);
    setActionType(action);
    setReviewNote(request.reviewNote || "");
    setDialogOpen(true);
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    setRequests(
      requests.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: "approved",
              reviewedAt: new Date().toISOString(),
              reviewNote: reviewNote,
            }
          : req
      )
    );
    setDialogOpen(false);
    setReviewNote("");
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    if (!reviewNote.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    setRequests(
      requests.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: "rejected",
              reviewedAt: new Date().toISOString(),
              reviewNote: reviewNote,
            }
          : req
      )
    );
    setDialogOpen(false);
    setReviewNote("");
  };

  // Apply filters
  const filteredRequests = requests.filter((r) => {
    if (filterClass !== "all" && r.class !== filterClass) return false;
    if (filterTeacher !== "all" && r.teacherName !== filterTeacher) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    return true;
  });

  // Combine pending and processed requests into a single table
  const combinedRequests = filteredRequests;

  // Get unique classes and teachers for filter
  const uniqueClasses = Array.from(new Set(requests.map((r) => r.class))).sort();
  const uniqueTeachers = Array.from(new Set(requests.map((r) => r.teacherName))).sort();

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    rejected: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  const statusLabels = {
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    rejected: "Từ chối",
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === combinedRequests.filter((r) => r.status === "pending").length) {
      setSelectedIds([]);
    } else {
      const allPendingIds = combinedRequests.filter((r) => r.status === "pending").map((r) => r.id);
      setSelectedIds(allPendingIds);
    }
  };

  // Toggle select individual request
  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Add bulk approval functionality
  const bulkApproveSelected = () => {
    if (selectedIds.length === 0) return;
    setRequests((prev) =>
      prev.map((req) =>
        selectedIds.includes(req.id) && req.status === "pending"
          ? {
              ...req,
              status: "approved",
              reviewedAt: new Date().toISOString(),
              reviewNote: "Đã duyệt hàng loạt",
            }
          : req
      )
    );
    setSelectedIds([]);
  };

  // Pagination logic
  const paginatedRequests = combinedRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(combinedRequests.length / itemsPerPage);

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
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Duyệt yêu cầu sửa điểm</h1>
                <p className="text-muted-foreground">{combinedRequests.length} yêu cầu</p>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6"
          >
            <GlassCard padding="lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Bộ lọc:</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Label className="whitespace-nowrap">Lớp:</Label>
                    <Select value={filterClass} onValueChange={setFilterClass}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {uniqueClasses.map((cls) => (
                          <SelectItem key={cls} value={cls}>
                            {cls}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="whitespace-nowrap">Giáo viên:</Label>
                    <Select value={filterTeacher} onValueChange={setFilterTeacher}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {uniqueTeachers.map((teacher) => (
                          <SelectItem key={teacher} value={teacher}>
                            {teacher}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="whitespace-nowrap">Trạng thái:</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="pending">Chờ duyệt</SelectItem>
                        <SelectItem value="approved">Đã duyệt</SelectItem>
                        <SelectItem value="rejected">Từ chối</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(filterClass !== "all" || filterTeacher !== "all" || filterStatus !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFilterClass("all");
                        setFilterTeacher("all");
                        setFilterStatus("all");
                      }}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      Xóa bộ lọc
                    </Button>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <div className="mb-4 flex items-center justify-end">
            <Button
              size="sm"
              variant="default"
              onClick={bulkApproveSelected}
              disabled={selectedIds.length === 0}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Duyệt đã chọn ({selectedIds.length})
            </Button>
          </div>

          {/* Combined Requests Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8"
          >
            <GlassCard padding="lg">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="pr-4 w-10">
                        <input
                          type="checkbox"
                          checked={
                            selectedIds.length > 0 &&
                            selectedIds.length === combinedRequests.filter((r) => r.status === "pending").length
                          }
                          onChange={toggleSelectAll}
                          aria-label="Select all"
                          className="h-4 w-4 text-red-500"
                        />
                      </th>
                      <th className="w-56 px-2">Học sinh</th>
                      <th className="w-24 px-2">Lớp</th>
                      <th className="w-32 px-2">Môn học</th>
                      <th className="w-40 px-2">Loại điểm</th>
                      <th className="w-24 px-2">Điểm cũ</th>
                      <th className="w-24 px-2">Điểm mới</th>
                      <th className="w-80 px-2">Lý do</th>
                      <th className="w-36 px-2">Học kỳ</th>
                      <th className="w-36 px-2">Năm học</th>
                      <th className="w-24 px-2">Trạng thái</th>
                      <th className="text-right w-40 px-2">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRequests.map((request) => (
                      <tr key={request.id} className="border-t">
                        <td className="py-3 pr-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(request.id)}
                            onChange={() => toggleSelect(request.id)}
                            className="h-4 w-4 text-red-500"
                          />
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.studentId}`}
                              />
                              <AvatarFallback>{request.studentName.split(" ").slice(-1)[0].charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{request.studentName}</div>
                              <div className="text-xs text-muted-foreground">ID: {request.studentId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">{request.class}</td>
                        <td className="py-3 px-2">{request.subject}</td>
                        <td className="py-3 px-2">{request.scoreType}</td>
                        <td className="py-3 px-2">{request.oldScore}</td>
                        <td className="py-3 px-2">{request.newScore}</td>
                        <td className="py-3 px-2 text-muted-foreground">{request.reason}</td>
                        <td className="py-3 px-2">{request.semester}</td>
                        <td className="py-3 px-2">{request.schoolYear}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className={statusColors[request.status]}>
                            {statusLabels[request.status]}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleOpenDialog(request, "view")}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-500 hover:text-red-600"
                              onClick={() => handleOpenDialog(request, "reject")}
                              disabled={request.status !== "pending"}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleOpenDialog(request, "approve")}
                              disabled={request.status !== "pending"}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>

          {/* Pagination Controls */}
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink isActive={currentPage === index + 1} onClick={() => setCurrentPage(index + 1)}>
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
      </main>

      {/* Review Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve"
                ? "Duyệt yêu cầu sửa điểm"
                : actionType === "reject"
                ? "Từ chối yêu cầu"
                : "Chi tiết yêu cầu"}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest?.teacherName} - {selectedRequest?.subject}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Học sinh</Label>
                  <p className="text-sm mt-1">{selectedRequest.studentName}</p>
                </div>
                <div>
                  <Label>Lớp</Label>
                  <p className="text-sm mt-1">{selectedRequest.class}</p>
                </div>
                <div>
                  <Label>Loại điểm</Label>
                  <p className="text-sm mt-1">{selectedRequest.scoreType}</p>
                </div>
                <div>
                  <Label>Thời gian gửi</Label>
                  <p className="text-sm mt-1">{new Date(selectedRequest.submittedAt).toLocaleString("vi-VN")}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <Label>Điểm cũ</Label>
                  <p className="text-3xl font-bold text-red-600 mt-2">{selectedRequest.oldScore}</p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Label>Điểm mới</Label>
                  <p className="text-3xl font-bold text-green-600 mt-2">{selectedRequest.newScore}</p>
                </div>
              </div>

              <div>
                <Label>Lý do đề nghị</Label>
                <p className="text-sm mt-1 p-3 rounded-lg bg-muted">{selectedRequest.reason}</p>
              </div>

              {selectedRequest.imageUrl && (
                <div>
                  <Label className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Hình ảnh bài kiểm tra
                  </Label>
                  <div className="mt-2 relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-border">
                    <Image
                      src={selectedRequest.imageUrl}
                      alt="Bài kiểm tra"
                      fill
                      className="object-contain bg-muted"
                      priority
                    />
                  </div>
                </div>
              )}

              {actionType !== "view" && (
                <div>
                  <Label htmlFor="reviewNote">Ghi chú {actionType === "reject" && "(Bắt buộc)"}</Label>
                  <Textarea
                    id="reviewNote"
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Nhập ghi chú..."
                    rows={4}
                    className="mt-1.5"
                  />
                </div>
              )}

              {selectedRequest.reviewNote && actionType === "view" && (
                <div>
                  <Label>Ghi chú xét duyệt</Label>
                  <p className="text-sm mt-1 p-3 rounded-lg bg-muted">{selectedRequest.reviewNote}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {actionType === "view" ? "Đóng" : "Hủy"}
            </Button>
            {actionType === "approve" && (
              <Button onClick={handleApprove} className="gap-2">
                <Check className="h-4 w-4" />
                Duyệt yêu cầu
              </Button>
            )}
            {actionType === "reject" && (
              <Button onClick={handleReject} variant="destructive" className="gap-2">
                <X className="h-4 w-4" />
                Từ chối yêu cầu
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
