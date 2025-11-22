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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Clock,
  Check,
  X,
  Eye,
  Calendar,
  BookOpen,
  Filter,
} from "lucide-react";

interface TranscriptRequest {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  grade: string; // 10, 11, 12
  transcriptType: "semester" | "year" | "full-course"; // kỳ, lớp, toàn khóa
  semester?: string; // HK1, HK2
  yearLevel?: string; // Lớp 10, 11, 12
  purpose: string;
  status: "pending" | "confirmed" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

const mockTranscriptRequests: TranscriptRequest[] = [
  {
    id: "TR001",
    studentId: "2024001",
    studentName: "Nguyễn Văn A",
    class: "10A1",
    grade: "10",
    transcriptType: "semester",
    semester: "HK1",
    purpose: "Xin học bạ để nộp hồ sơ xét tuyển",
    status: "pending",
    submittedAt: "2024-11-20T10:00:00Z",
  },
  {
    id: "TR002",
    studentId: "2024002",
    studentName: "Trần Thị B",
    class: "10A1",
    grade: "10",
    transcriptType: "year",
    yearLevel: "Lớp 10",
    purpose: "Xin học bạ toàn khóa lớp 10 để chuyển trường",
    status: "pending",
    submittedAt: "2024-11-19T14:30:00Z",
  },
  {
    id: "TR003",
    studentId: "2024019",
    studentName: "Quách Văn T",
    class: "11A2",
    grade: "11",
    transcriptType: "full-course",
    purpose: "Xin học bạ toàn khóa để xin học bổng",
    status: "confirmed",
    submittedAt: "2024-11-18T09:15:00Z",
    reviewedAt: "2024-11-18T15:00:00Z",
    reviewNote: "Đã xác nhận và in học bạ",
  },
  {
    id: "TR004",
    studentId: "2024011",
    studentName: "Trịnh Văn L",
    class: "10A2",
    grade: "10",
    transcriptType: "semester",
    semester: "HK2",
    purpose: "Xin học bạ HK2 để xét học sinh giỏi",
    status: "rejected",
    submittedAt: "2024-11-17T11:00:00Z",
    reviewedAt: "2024-11-17T16:30:00Z",
    reviewNote: "Học kỳ 2 chưa kết thúc, không thể cấp học bạ",
  },
  {
    id: "TR005",
    studentId: "2024003",
    studentName: "Lê Văn C",
    class: "10A1",
    grade: "10",
    transcriptType: "year",
    yearLevel: "Lớp 10",
    purpose: "Xin học bạ lớp 10 để làm hồ sơ dự tuyển",
    status: "pending",
    submittedAt: "2024-11-21T08:45:00Z",
  },
  {
    id: "TR006",
    studentId: "2024012",
    studentName: "Hoàng Thị M",
    class: "10A2",
    grade: "10",
    transcriptType: "semester",
    semester: "HK1",
    purpose: "Xin học bạ HK1 để nộp cho phụ huynh",
    status: "confirmed",
    submittedAt: "2024-11-16T13:20:00Z",
    reviewedAt: "2024-11-16T17:00:00Z",
    reviewNote: "Đã xác nhận",
  },
];

export default function TranscriptRequestsPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<TranscriptRequest[]>(
    mockTranscriptRequests
  );
  const [selectedRequest, setSelectedRequest] =
    useState<TranscriptRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"confirm" | "reject" | "view">(
    "view"
  );
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

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

  const handleOpenDialog = (
    request: TranscriptRequest,
    action: "confirm" | "reject" | "view"
  ) => {
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

  // Apply filters
  const filteredRequests = requests.filter((r) => {
    if (filterClass !== "all" && r.class !== filterClass) return false;
    if (filterType !== "all" && r.transcriptType !== filterType) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    return true;
  });

  const pendingRequests = filteredRequests.filter(
    (r) => r.status === "pending"
  );
  const processedRequests = filteredRequests.filter(
    (r) => r.status !== "pending"
  );

  // Get unique classes for filter
  const uniqueClasses = Array.from(
    new Set(requests.map((r) => r.class))
  ).sort();

  const statusColors = {
    pending:
      "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    confirmed:
      "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    rejected: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  const statusLabels = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    rejected: "Từ chối",
  };

  const typeLabels = {
    semester: "Học bạ theo kỳ",
    year: "Học bạ theo lớp",
    "full-course": "Học bạ toàn khóa",
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
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Yêu cầu học bạ</h1>
                <p className="text-muted-foreground">
                  {pendingRequests.length} yêu cầu chờ xác nhận
                </p>
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
                    <Label className="whitespace-nowrap">Loại học bạ:</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="semester">Theo kỳ</SelectItem>
                        <SelectItem value="year">Theo lớp</SelectItem>
                        <SelectItem value="full-course">Toàn khóa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="whitespace-nowrap">Trạng thái:</Label>
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
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
                  {(filterClass !== "all" ||
                    filterType !== "all" ||
                    filterStatus !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFilterClass("all");
                        setFilterType("all");
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

          {/* Pending Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Yêu cầu chờ xác nhận
            </h2>
            <div className="space-y-4">
              {pendingRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <GlassCard hover padding="lg">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.studentId}`}
                        />
                        <AvatarFallback>
                          {request.studentName
                            .split(" ")
                            .slice(-1)[0]
                            .charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">
                              {request.studentName} - {request.class}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <BookOpen className="h-4 w-4" />
                              {typeLabels[request.transcriptType]}
                              {request.semester && ` - ${request.semester}`}
                              {request.yearLevel && ` - ${request.yearLevel}`}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={statusColors[request.status]}
                          >
                            {statusLabels[request.status]}
                          </Badge>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm font-medium mb-1">Mục đích:</p>
                          <p className="text-sm text-muted-foreground">
                            {request.purpose}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-border/40">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {new Date(request.submittedAt).toLocaleString(
                              "vi-VN"
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2"
                              onClick={() => handleOpenDialog(request, "view")}
                            >
                              <Eye className="h-4 w-4" />
                              Chi tiết
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-2 text-red-500 hover:text-red-600"
                              onClick={() =>
                                handleOpenDialog(request, "reject")
                              }
                            >
                              <X className="h-4 w-4" />
                              Từ chối
                            </Button>
                            <Button
                              size="sm"
                              className="gap-2"
                              onClick={() =>
                                handleOpenDialog(request, "confirm")
                              }
                            >
                              <Check className="h-4 w-4" />
                              Xác nhận
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}

              {pendingRequests.length === 0 && (
                <GlassCard padding="lg">
                  <p className="text-center text-muted-foreground">
                    Không có yêu cầu nào chờ xác nhận
                  </p>
                </GlassCard>
              )}
            </div>
          </motion.div>

          {/* Processed Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Yêu cầu đã xử lý
            </h2>
            <div className="space-y-4">
              {processedRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <GlassCard padding="lg" className="opacity-75">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">
                            {request.studentName} - {request.class}
                          </h3>
                          <Badge
                            variant="outline"
                            className={statusColors[request.status]}
                          >
                            {statusLabels[request.status]}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-3 w-3" />
                            {typeLabels[request.transcriptType]}
                            {request.semester && ` - ${request.semester}`}
                            {request.yearLevel && ` - ${request.yearLevel}`}
                          </div>
                          <div>Mục đích: {request.purpose}</div>
                          {request.reviewNote && (
                            <div className="text-xs">
                              Ghi chú: {request.reviewNote}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDialog(request, "view")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
                  <Label>Loại học bạ</Label>
                  <p className="text-sm mt-1">
                    {typeLabels[selectedRequest.transcriptType]}
                  </p>
                </div>
                <div>
                  <Label>Chi tiết</Label>
                  <p className="text-sm mt-1">
                    {selectedRequest.semester ||
                      selectedRequest.yearLevel ||
                      "Toàn khóa"}
                  </p>
                </div>
              </div>

              <div>
                <Label>Mục đích</Label>
                <p className="text-sm mt-1 p-3 rounded-lg bg-muted">
                  {selectedRequest.purpose}
                </p>
              </div>

              <div>
                <Label>Thời gian gửi</Label>
                <p className="text-sm mt-1">
                  {new Date(selectedRequest.submittedAt).toLocaleString(
                    "vi-VN"
                  )}
                </p>
              </div>

              {selectedRequest.reviewNote && actionType === "view" && (
                <div>
                  <Label>Ghi chú xét duyệt</Label>
                  <p className="text-sm mt-1 p-3 rounded-lg bg-muted">
                    {selectedRequest.reviewNote}
                  </p>
                </div>
              )}

              {actionType === "confirm" && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-green-600 dark:text-green-400">
                    ⓘ Sau khi xác nhận, học bạ sẽ được in và chuẩn bị cho học
                    sinh.
                  </p>
                </div>
              )}

              {actionType === "reject" && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    ⓘ Từ chối yêu cầu này nếu học sinh chưa đủ điều kiện hoặc
                    thông tin không chính xác.
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
              <Button
                onClick={handleReject}
                variant="destructive"
                className="gap-2"
              >
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
