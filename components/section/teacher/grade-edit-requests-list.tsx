"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { mockGradeEditRequests, GradeEditRequest } from "@/mork-data";
import { FileText, Eye, Clock, CheckCircle, XCircle } from "lucide-react";

export function GradeEditRequestsList() {
  const [requests, setRequests] = useState<GradeEditRequest[]>(
    mockGradeEditRequests
  );
  const [selectedRequest, setSelectedRequest] =
    useState<GradeEditRequest | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: {
        label: "Chờ duyệt",
        color: "bg-orange-500/10 text-orange-600",
        icon: Clock,
      },
      approved: {
        label: "Đã duyệt",
        color: "bg-green-500/10 text-green-600",
        icon: CheckCircle,
      },
      rejected: {
        label: "Từ chối",
        color: "bg-red-500/10 text-red-600",
        icon: XCircle,
      },
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const getScoreTypeName = (type: string) => {
    const types: { [key: string]: string } = {
      oral: "Miệng",
      test15min: "15 phút",
      test45min: "1 tiết",
      midterm: "Giữa kỳ",
      final: "Cuối kỳ",
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      <GlassCard padding="md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Yêu cầu sửa điểm</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Danh sách yêu cầu sửa điểm đã gửi
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {requests.filter((r) => r.status === "pending").length} chờ duyệt
          </Badge>
        </div>
      </GlassCard>

      <GlassCard padding="none">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead>Mã YC</TableHead>
                <TableHead>Học sinh</TableHead>
                <TableHead>Lớp</TableHead>
                <TableHead>Môn học</TableHead>
                <TableHead>Loại điểm</TableHead>
                <TableHead>Điểm hiện tại</TableHead>
                <TableHead>Điểm đề xuất</TableHead>
                <TableHead>Ngày gửi</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request, index) => {
                const statusInfo = getStatusBadge(request.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-white/10"
                  >
                    <TableCell className="font-mono text-sm">
                      {request.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {request.studentName}
                    </TableCell>
                    <TableCell>{request.class}</TableCell>
                    <TableCell>{request.subject}</TableCell>
                    <TableCell>{getScoreTypeName(request.scoreType)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{request.oldScore}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500/10 text-blue-600">
                        {request.newScore}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(request.requestedAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusInfo.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="h-4 w-4" />
                            Chi tiết
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Chi tiết yêu cầu sửa điểm</DialogTitle>
                          </DialogHeader>
                          {selectedRequest && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Mã yêu cầu
                                  </p>
                                  <p className="font-semibold font-mono">
                                    {selectedRequest.id}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Trạng thái
                                  </p>
                                  <Badge
                                    className={
                                      getStatusBadge(selectedRequest.status)
                                        .color
                                    }
                                  >
                                    {
                                      getStatusBadge(selectedRequest.status)
                                        .label
                                    }
                                  </Badge>
                                </div>
                              </div>

                              <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">
                                  Thông tin học sinh
                                </h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">
                                      Họ tên
                                    </p>
                                    <p>{selectedRequest.studentName}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Lớp</p>
                                    <p>{selectedRequest.class}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      Môn học
                                    </p>
                                    <p>{selectedRequest.subject}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      Ngày gửi
                                    </p>
                                    <p>
                                      {new Date(
                                        selectedRequest.requestedAt
                                      ).toLocaleDateString("vi-VN")}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">
                                  Thông tin điểm
                                </h4>
                                <div className="grid grid-cols-3 gap-3">
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Loại điểm
                                    </p>
                                    <Badge variant="outline">
                                      {getScoreTypeName(
                                        selectedRequest.scoreType
                                      )}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Điểm hiện tại
                                    </p>
                                    <p className="text-lg font-bold text-red-600">
                                      {selectedRequest.oldScore}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">
                                      Điểm đề xuất
                                    </p>
                                    <p className="text-lg font-bold text-green-600">
                                      {selectedRequest.newScore}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">Lý do</h4>
                                <p className="text-sm bg-muted p-3 rounded-md">
                                  {selectedRequest.reason}
                                </p>
                              </div>

                              <div className="border-t pt-4">
                                <div className="text-sm text-muted-foreground">
                                  <p>
                                    Người gửi: {selectedRequest.teacherName}
                                  </p>
                                  <p>
                                    Ngày gửi:{" "}
                                    {new Date(
                                      selectedRequest.requestedAt
                                    ).toLocaleString("vi-VN")}
                                  </p>
                                </div>
                              </div>

                              {selectedRequest.reviewNote && (
                                <div className="border-t pt-4">
                                  <h4 className="font-semibold mb-2">
                                    Phản hồi từ ban giám hiệu
                                  </h4>
                                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-md p-3">
                                    <p className="text-sm mb-2">
                                      {selectedRequest.reviewNote}
                                    </p>
                                    <div className="text-xs text-muted-foreground">
                                      <p>
                                        Người duyệt:{" "}
                                        {selectedRequest.reviewedBy}
                                      </p>
                                      <p>
                                        {selectedRequest.reviewedAt
                                          ? new Date(
                                              selectedRequest.reviewedAt
                                            ).toLocaleString("vi-VN")
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {selectedRequest.status === "pending" && (
                                <div className="border-t pt-4 flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setShowRejectDialog(true)}
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Từ chối
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      window.location.href = `/teacher/class/10A1/2024001`;
                                    }}
                                  >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Sửa ngay
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      {/* Reject Dialog */}
                      <Dialog
                        open={showRejectDialog}
                        onOpenChange={setShowRejectDialog}
                      >
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Từ chối yêu cầu sửa điểm</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">
                                Nhập lý do từ chối yêu cầu sửa điểm
                              </p>
                              <Textarea
                                value={rejectReason}
                                onChange={(e) =>
                                  setRejectReason(e.target.value)
                                }
                                placeholder="Nhập lý do từ chối..."
                                rows={4}
                                className="resize-none"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowRejectDialog(false);
                                setRejectReason("");
                              }}
                            >
                              Hủy
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => {
                                // TODO: Handle reject logic here
                                console.log("Reject reason:", rejectReason);
                                setShowRejectDialog(false);
                                setRejectReason("");
                              }}
                              disabled={!rejectReason.trim()}
                            >
                              Xác nhận từ chối
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </GlassCard>
    </div>
  );
}
