// app/(normal)/student/transcript-request/page.tsx
"use client";

import { useAuth, isStudent } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Send, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TranscriptRequestPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [requestType, setRequestType] = useState("");
  const [copies, setCopies] = useState("1");
  const [purpose, setPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isStudent(user))) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !isStudent(user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert("Yêu cầu đã được gửi thành công! Vui lòng chờ xác nhận.");
    setIsSubmitting(false);
    setRequestType("");
    setCopies("1");
    setPurpose("");
  };

  const headerUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role as any,
  };

  const requests = [
    {
      id: "REQ001",
      type: "Bảng điểm học kỳ I",
      date: "15/12/2024",
      status: "Đã duyệt",
      statusColor: "bg-green-500/10 text-green-600",
    },
    {
      id: "REQ002",
      type: "Học bạ toàn khóa",
      date: "10/11/2024",
      status: "Đang xử lý",
      statusColor: "bg-orange-500/10 text-orange-600",
    },
  ];

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-6 sm:py-8">
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
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Yêu cầu học bạ
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gửi yêu cầu cấp học bạ và bảng điểm
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard padding="md">
                <h3 className="text-lg font-semibold mb-6">Tạo yêu cầu mới</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="requestType">Loại yêu cầu</Label>
                    <Select
                      value={requestType}
                      onValueChange={setRequestType}
                      required
                    >
                      <SelectTrigger id="requestType">
                        <SelectValue placeholder="Chọn loại yêu cầu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semester">
                          Bảng điểm học kỳ
                        </SelectItem>
                        <SelectItem value="year">Bảng điểm năm học</SelectItem>
                        <SelectItem value="full">Học bạ toàn khóa</SelectItem>
                        <SelectItem value="conduct">
                          Phiếu nhận xét hạnh kiểm
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="copies">Số bản sao</Label>
                    <Input
                      id="copies"
                      type="number"
                      min="1"
                      max="10"
                      value={copies}
                      onChange={(e) => setCopies(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purpose">Mục đích sử dụng</Label>
                    <Textarea
                      id="purpose"
                      placeholder="Nhập mục đích sử dụng học bạ..."
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !requestType || !purpose}
                      className="w-full gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full"
                          />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Gửi yêu cầu
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <GlassCard padding="md">
                <h3 className="text-lg font-semibold mb-4">Lịch sử yêu cầu</h3>
                <div className="space-y-3">
                  {requests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 rounded-lg bg-white/5 dark:bg-black/5 hover:bg-white/10 dark:hover:bg-black/10 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">
                            {request.type}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Mã: {request.id}
                          </p>
                        </div>
                        <Badge className={request.statusColor}>
                          {request.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Ngày gửi: {request.date}
                        </span>
                        {request.status === "Đã duyệt" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 h-8"
                          >
                            <Download className="h-3 w-3" />
                            <span className="text-xs">Tải xuống</span>
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard padding="md">
                <h3 className="font-semibold mb-3">Lưu ý</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Thời gian xử lý: 3-5 ngày làm việc</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Phí xử lý: 20.000 VNĐ/bản</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Nhận tại văn phòng phòng Đào tạo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Liên hệ: (028) 3897 2092</span>
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
