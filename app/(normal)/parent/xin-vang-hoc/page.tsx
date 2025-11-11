"use client";

import { useAuth, isParent } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LeaveRequestForm } from "@/components/section/parent/leave-request-form";
import { GlassCard } from "@/components/ui/glass-card";
import { FileText, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LeaveRequestPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isParent(user))) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !isParent(user)) {
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
    role: user.role as "parent",
  };

  const leaveRequests = [
    {
      id: "LR001",
      studentName: user.children[0]?.name || "",
      reason: "Em bị ốm, cần nghỉ học để điều trị",
      fromDate: "18/12/2024",
      toDate: "18/12/2024",
      status: "approved",
      reviewNote: "Đồng ý cho nghỉ. Nhớ bù bài tập khi trở lại.",
    },
    {
      id: "LR002",
      studentName: user.children[0]?.name || "",
      reason: "Gia đình có việc đột xuất",
      fromDate: "20/12/2024",
      toDate: "21/12/2024",
      status: "pending",
      reviewNote: "",
    },
  ];

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-6 sm:py-8">
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
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Xin nghỉ học</h1>
                <p className="text-muted-foreground mt-1">
                  Gửi đơn xin nghỉ học cho con em
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <LeaveRequestForm parent={user} />
            </motion.div>

            {/* History & Notes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Request History */}
              <GlassCard padding="md">
                <h3 className="text-lg font-semibold mb-4">Lịch sử đơn</h3>
                <div className="space-y-3">
                  {leaveRequests.map((request) => (
                    <div
                      key={request.id}
                      className="p-4 rounded-lg border border-white/10 hover:bg-white/5 dark:hover:bg-black/5 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{request.studentName}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Mã đơn: {request.id}
                          </p>
                        </div>
                        <Badge
                          variant={
                            request.status === "approved"
                              ? "default"
                              : request.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {request.status === "approved"
                            ? "Đã duyệt"
                            : request.status === "pending"
                            ? "Chờ duyệt"
                            : "Từ chối"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {request.reason}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        Từ {request.fromDate} đến {request.toDate}
                      </div>
                      {request.reviewNote && (
                        <div className="mt-2 p-2 rounded bg-blue-500/10 text-xs">
                          <span className="font-medium">Phản hồi: </span>
                          {request.reviewNote}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Notes */}
              <GlassCard padding="md">
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <h3 className="font-semibold">Lưu ý quan trọng</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Đơn xin nghỉ học cần được gửi trước ít nhất 1 ngày
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Nêu rõ lý do và thời gian nghỉ học cụ thể</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>
                      Giáo viên chủ nhiệm sẽ xét duyệt đơn trong vòng 24h
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Học sinh cần bù bài tập khi trở lại học</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Nghỉ học quá 3 ngày liên tục cần giấy xác nhận</span>
                  </li>
                </ul>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
