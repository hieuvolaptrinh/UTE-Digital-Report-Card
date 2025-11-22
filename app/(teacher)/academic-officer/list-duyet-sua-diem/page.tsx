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
import {
  FileText,
  Clock,
  Check,
  X,
  Eye,
  Calendar,
  User,
  BookOpen,
  Filter,
  Image as ImageIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

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
  },
];

export default function GradeEditApprovalPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<GradeEditRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] =
    useState<GradeEditRequest | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | "view">(
    "view"
  );
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterTeacher, setFilterTeacher] = useState<string>("all");

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
    request: GradeEditRequest,
    action: "approve" | "reject" | "view"
  ) => {
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
    if (filterTeacher !== "all" && r.teacherName !== filterTeacher)
      return false;
    return true;
  });

  const pendingRequests = filteredRequests.filter(
    (r) => r.status === "pending"
  );
  const processedRequests = filteredRequests.filter(
    (r) => r.status !== "pending"
  );

  // Get unique classes and teachers for filter
  const uniqueClasses = Array.from(
    new Set(requests.map((r) => r.class))
  ).sort();
  const uniqueTeachers = Array.from(
    new Set(requests.map((r) => r.teacherName))
  ).sort();

  const statusColors = {
    pending:
      "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    approved:
      "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    rejected: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };

  const statusLabels = {
    pending: "Chờ duyệt",
    approved: "Đã duyệt",
    rejected: "Từ chối",
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
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Duyệt yêu cầu sửa điểm</h1>
                <p className="text-muted-foreground">
                  {pendingRequests.length} yêu cầu chờ duyệt
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
                    <Select
                      value={filterTeacher}
                      onValueChange={setFilterTeacher}
                    >
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
                  {(filterClass !== "all" || filterTeacher !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFilterClass("all");
                        setFilterTeacher("all");
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
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Yêu cầu chờ duyệt
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
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.teacherId}`}
                        />
                        <AvatarFallback>
                          {request.teacherName
                            .split(" ")
                            .slice(-1)[0]
                            .charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">
                              {request.teacherName} - {request.subject}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>HS: {request.studentName}</span>
                              <span>•</span>
                              <span>Lớp: {request.class}</span>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={statusColors[request.status]}
                          >
                            {statusLabels[request.status]}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Điểm cũ
                              </p>
                              <p className="text-2xl font-bold text-red-600">
                                {request.oldScore}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {request.scoreType}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Điểm mới
                              </p>
                              <p className="text-2xl font-bold text-green-600">
                                {request.newScore}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Đề nghị thay đổi
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm font-medium mb-1">Lý do:</p>
                          <p className="text-sm text-muted-foreground">
                            {request.reason}
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
                                handleOpenDialog(request, "approve")
                              }
                            >
                              <Check className="h-4 w-4" />
                              Duyệt
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
                    Không có yêu cầu nào chờ duyệt
                  </p>
                </GlassCard>
              )}
            </div>
          </motion.div>

          {/* Processed Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
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
                            {request.teacherName} - {request.studentName}
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
                            <span>
                              {request.subject} - {request.scoreType}
                            </span>
                          </div>
                          <div>
                            Điểm: {request.oldScore} → {request.newScore}
                          </div>
                          {request.reviewNote && (
                            <div className="mt-2 p-2 rounded bg-muted/50">
                              <p className="text-xs font-medium">Ghi chú:</p>
                              <p className="text-xs">{request.reviewNote}</p>
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
                  <p className="text-sm mt-1">
                    {new Date(selectedRequest.submittedAt).toLocaleString(
                      "vi-VN"
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <Label>Điểm cũ</Label>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {selectedRequest.oldScore}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Label>Điểm mới</Label>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {selectedRequest.newScore}
                  </p>
                </div>
              </div>

              <div>
                <Label>Lý do đề nghị</Label>
                <p className="text-sm mt-1 p-3 rounded-lg bg-muted">
                  {selectedRequest.reason}
                </p>
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
                  <Label htmlFor="reviewNote">
                    Ghi chú {actionType === "reject" && "(Bắt buộc)"}
                  </Label>
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
                  <p className="text-sm mt-1 p-3 rounded-lg bg-muted">
                    {selectedRequest.reviewNote}
                  </p>
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
              <Button
                onClick={handleReject}
                variant="destructive"
                className="gap-2"
              >
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
