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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Check, X, Eye, Filter } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface TranscriptRequest {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  contentPrint: string;
  schoolYear?: string; // 2024-2025 etc.
  purpose: string;
  status: "pending" | "confirmed" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

// Update the mock data to reflect the new requirements for printing requests
const mockTranscriptRequests: TranscriptRequest[] = [
  {
    id: "TR001",
    studentId: "2024001",
    studentName: "Nguyễn Văn A",
    class: "10A1",
    contentPrint: "10 (HK1)",
    schoolYear: "2024-2025",
    purpose: "Nộp hồ sơ xét tuyển",
    status: "pending",
    submittedAt: "2024-11-20T10:00:00Z",
  },
  {
    id: "TR002",
    studentId: "2024002",
    studentName: "Trần Thị B",
    class: "10A1",
    contentPrint: "10 (Cả năm)",
    schoolYear: "2023-2025",
    purpose: "Chuyển trường",
    status: "pending",
    submittedAt: "2024-11-19T14:30:00Z",
  },
  {
    id: "TR004",
    studentId: "2024011",
    studentName: "Trịnh Văn L",
    class: "10A2",
    contentPrint: "10 (HK2)",
    schoolYear: "2024-2025",
    purpose: "Xét học sinh giỏi",
    status: "rejected",
    submittedAt: "2024-11-17T11:00:00Z",
    reviewedAt: "2024-11-17T16:30:00Z",
    reviewNote: "Học kỳ 2 chưa kết thúc, không thể cấp học bạ",
  },
  {
    id: "TR003",
    studentId: "2024019",
    studentName: "Quách Văn T",
    class: "11A2",
    contentPrint: "11 (HK2)",
    schoolYear: "2023-2024",
    purpose: "Xin học bổng",
    status: "confirmed",
    submittedAt: "2024-11-18T09:15:00Z",
    reviewedAt: "2024-11-18T15:00:00Z",
    reviewNote: "Đã xác nhận và in học bạ",
  },
  {
    id: "TR007",
    studentId: "2024020",
    studentName: "Phạm Văn D",
    class: "11A1",
    contentPrint: "10 (HK1), 11 (HK2)",
    schoolYear: "2023-2025",
    purpose: "Chuyển trường",
    status: "pending",
    submittedAt: "2024-11-22T09:00:00Z",
  },
  {
    id: "TR005",
    studentId: "2024003",
    studentName: "Lê Văn C",
    class: "12A1",
    contentPrint: "10 (Cả năm), 11 (Cả năm), 12 (HK1)",
    schoolYear: "2023-2025",
    purpose: "Làm hồ sơ dự tuyển",
    status: "pending",
    submittedAt: "2024-11-21T08:45:00Z",
  },
  {
    id: "TR006",
    studentId: "2024012",
    studentName: "Hoàng Thị M",
    class: "12A2",
    contentPrint: "12 (HK1)",
    schoolYear: "2024-2025",
    purpose: "Nộp cho phụ huynh",
    status: "confirmed",
    submittedAt: "2024-11-16T13:20:00Z",
    reviewedAt: "2024-11-16T17:00:00Z",
    reviewNote: "Đã xác nhận",
  },
  {
    id: "TR008",
    studentId: "2024021",
    studentName: "Ngô Thị E",
    class: "12A1",
    contentPrint: "10 (Cả năm), 11 (Cả năm), 12 (HK1)",
    schoolYear: "2022-2025",
    purpose: "Nộp hồ sơ du học",
    status: "pending",
    submittedAt: "2024-11-23T10:30:00Z",
  },
];

export default function TranscriptRequestsPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<TranscriptRequest[]>(mockTranscriptRequests);
  const [selectedRequest, setSelectedRequest] = useState<TranscriptRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"confirm" | "reject" | "view">("view");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSchoolYear, setFilterSchoolYear] = useState<string>("all");

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

  const handleOpenDialog = (request: TranscriptRequest, action: "confirm" | "reject" | "view") => {
    setSelectedRequest(request);
    setActionType(action);
    setDialogOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedRequest) return;

    setRequests(
      requests.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: "confirmed",
              reviewedAt: new Date().toISOString(),
              reviewNote: "Đã xác nhận và chuẩn bị học bạ",
            }
          : req
      )
    );
    setDialogOpen(false);
  };

  const handleReject = () => {
    if (!selectedRequest) return;

    setRequests(
      requests.map((req) =>
        req.id === selectedRequest.id
          ? {
              ...req,
              status: "rejected",
              reviewedAt: new Date().toISOString(),
              reviewNote: "Không đủ điều kiện cấp học bạ",
            }
          : req
      )
    );
    setDialogOpen(false);
  };

  // Selection helpers for bulk actions
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === pendingRequests.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingRequests.map((r) => r.id));
    }
  };

  const bulkConfirmSelected = () => {
    if (selectedIds.length === 0) return;
    setRequests((prev) =>
      prev.map((req) =>
        selectedIds.includes(req.id) && req.status === "pending"
          ? {
              ...req,
              status: "confirmed",
              reviewedAt: new Date().toISOString(),
              reviewNote: "Đã xác nhận hàng loạt",
            }
          : req
      )
    );
    setSelectedIds([]);
  };

  // Apply filters
  const filteredRequests = requests.filter((r) => {
    if (filterClass !== "all" && r.class !== filterClass) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (filterSchoolYear !== "all" && r.schoolYear !== filterSchoolYear) return false;
    return true;
  });

  const pendingRequests = filteredRequests.filter((r) => r.status === "pending");

  // Get unique classes for filter
  const uniqueClasses = Array.from(new Set(requests.map((r) => r.class))).sort();

  // Define uniqueSemesters to extract unique semester values from requests

  // Define uniqueSchoolYears to extract unique school year values from requests
  const uniqueSchoolYears = Array.from(new Set(requests.map((r) => r.schoolYear).filter(Boolean))).sort();

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    confirmed: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    rejected: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  const statusLabels = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    rejected: "Từ chối",
  };

  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

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
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Yêu cầu học bạ</h1>
                <p className="text-muted-foreground">{pendingRequests.length} yêu cầu chờ xác nhận</p>
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
              <div className="flex items-center gap-4 flex-wrap">
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
                    <Label className="whitespace-nowrap">Khóa:</Label>
                    <Select value={filterSchoolYear} onValueChange={setFilterSchoolYear}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {uniqueSchoolYears.map((y) => (
                          <SelectItem key={y} value={y}>
                            {y}
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
                        <SelectItem value="pending">Chờ xác nhận</SelectItem>
                        <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                        <SelectItem value="rejected">Từ chối</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(filterClass !== "all" || filterSchoolYear !== "all" || filterStatus !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFilterClass("all");
                        setFilterSchoolYear("all");
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

          {/* Requests Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8"
          >
            <div className="mb-4 flex items-center justify-end">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={bulkConfirmSelected}
                  disabled={selectedIds.length === 0}
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  Xác nhận đã chọn ({selectedIds.length})
                </Button>
              </div>
            </div>

            {filteredRequests.length > 0 ? (
              <GlassCard padding="lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-muted-foreground">
                        <th className="pr-4 w-8">
                          <input
                            type="checkbox"
                            checked={selectedIds.length > 0 && selectedIds.length === filteredRequests.length}
                            onChange={toggleSelectAll}
                            aria-label="Select all"
                            className="h-4 w-4 text-red-500"
                          />
                        </th>
                        <th className="w-48">Học sinh</th>
                        <th className="w-20">Lớp</th>
                        <th className="w-56">Nội dung in</th>
                        <th className="w-32">Khóa</th>
                        <th className="w-72">Lý do</th>
                        <th className="w-40">Thời gian</th>
                        <th className="w-24">Trạng thái</th>
                        <th className="text-right w-48">Hành động</th>
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
                          <td className="py-3">
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
                          <td className="py-3">{request.class}</td>
                          <td className="py-3">{request.contentPrint}</td>
                          <td className="py-3">{request.schoolYear || "-"}</td>
                          <td className="py-3 text-muted-foreground">{request.purpose}</td>
                          <td className="py-3 text-xs text-muted-foreground">
                            {new Date(request.submittedAt).toLocaleString("vi-VN")}
                          </td>
                          <td className="py-3">
                            <Badge variant="outline" className={statusColors[request.status]}>
                              {statusLabels[request.status]}
                            </Badge>
                          </td>
                          <td className="py-3 text-right">
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
                                onClick={() => handleOpenDialog(request, "confirm")}
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
            ) : (
              <GlassCard padding="lg">
                <p className="text-center text-muted-foreground">Không có yêu cầu nào chờ xác nhận</p>
              </GlassCard>
            )}
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {actionType === "confirm"
                ? "Xác nhận yêu cầu học bạ"
                : actionType === "reject"
                ? "Từ chối yêu cầu"
                : "Chi tiết yêu cầu"}
            </DialogTitle>
            <DialogDescription>
              {selectedRequest?.studentName} - {selectedRequest?.class}
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
                  <Label>Nội dung in</Label>
                  <p className="text-sm mt-1">{selectedRequest.contentPrint}</p>
                </div>
                <div>
                  <Label>Khóa</Label>
                  <p className="text-sm mt-1">{selectedRequest.schoolYear || "-"}</p>
                </div>
              </div>

              <div>
                <Label>Mục đích</Label>
                <p className="text-sm mt-1 p-3 rounded-lg bg-muted">{selectedRequest.purpose}</p>
              </div>

              <div>
                <Label>Thời gian gửi</Label>
                <p className="text-sm mt-1">{new Date(selectedRequest.submittedAt).toLocaleString("vi-VN")}</p>
              </div>

              {selectedRequest.reviewNote && actionType === "view" && (
                <div>
                  <Label>Ghi chú xét duyệt</Label>
                  <p className="text-sm mt-1 p-3 rounded-lg bg-muted">{selectedRequest.reviewNote}</p>
                </div>
              )}

              {actionType === "confirm" && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    ⓘ Sau khi xác nhận, học bạ sẽ được in và chuẩn bị cho học sinh.
                  </p>
                </div>
              )}

              {actionType === "reject" && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    ⓘ Từ chối yêu cầu này nếu học sinh chưa đủ điều kiện hoặc thông tin không chính xác.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {actionType === "view" ? "Đóng" : "Hủy"}
            </Button>
            {actionType === "confirm" && (
              <Button onClick={handleConfirm} className="gap-2">
                <Check className="h-4 w-4" />
                Xác nhận
              </Button>
            )}
            {actionType === "reject" && (
              <Button onClick={handleReject} variant="destructive" className="gap-2">
                <X className="h-4 w-4" />
                Từ chối
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </>
  );
}
