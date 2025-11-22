"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Send, Bell, Calendar } from "lucide-react";

export default function SchoolNotificationPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [recipient, setRecipient] = useState<
    "all" | "teachers" | "students" | "parents"
  >("all");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

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

  const handleSend = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setSending(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSending(false);
    setSent(true);

    // Reset form
    setTimeout(() => {
      setTitle("");
      setContent("");
      setPriority("medium");
      setRecipient("all");
      setSent(false);
    }, 3000);
  };

  const recentNotifications = [
    {
      id: 1,
      title: "Thông báo nghỉ học do bão",
      content:
        "Nhà trường thông báo nghỉ học các ngày 15-16/11 do ảnh hưởng của bão...",
      priority: "high" as const,
      recipient: "all" as const,
      date: "2024-11-10",
      sentBy: "Hiệu trưởng Trần Minh Phương",
    },
    {
      id: 2,
      title: "Lịch họp giáo viên",
      content: "Tổ chức cuộc họp toàn thể giáo viên vào thứ 6 tuần sau...",
      priority: "medium" as const,
      recipient: "teachers" as const,
      date: "2024-11-08",
      sentBy: "Hiệu trưởng Trần Minh Phương",
    },
    {
      id: 3,
      title: "Thông báo thi học kỳ 1",
      content: "Lịch thi học kỳ 1 sẽ được tổ chức từ ngày 20/12...",
      priority: "high" as const,
      recipient: "all" as const,
      date: "2024-11-05",
      sentBy: "Hiệu trưởng Trần Minh Phương",
    },
  ];

  const priorityColors = {
    high: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    medium:
      "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    low: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
  };

  const priorityLabels = {
    high: "Khẩn cấp",
    medium: "Quan trọng",
    low: "Thông thường",
  };

  const recipientLabels = {
    all: "Toàn trường",
    teachers: "Giáo viên",
    students: "Học sinh",
    parents: "Phụ huynh",
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
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Thông báo toàn trường</h1>
                <p className="text-muted-foreground">
                  Gửi thông báo đến toàn bộ giáo viên, học sinh và phụ huynh
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Send Notification Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <GlassCard padding="lg">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Soạn thông báo mới
                </h2>

                {sent && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400"
                  >
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      <span className="font-medium">
                        Thông báo đã được gửi thành công!
                      </span>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Tiêu đề</Label>
                    <Input
                      id="title"
                      placeholder="Nhập tiêu đề thông báo..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Mức độ ưu tiên</Label>
                      <Select
                        value={priority}
                        onValueChange={(value) =>
                          setPriority(value as "high" | "medium" | "low")
                        }
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">🔴 Khẩn cấp</SelectItem>
                          <SelectItem value="medium">🔵 Quan trọng</SelectItem>
                          <SelectItem value="low">⚪ Thông thường</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="recipient">Người nhận</Label>
                      <Select
                        value={recipient}
                        onValueChange={(value) =>
                          setRecipient(
                            value as "all" | "teachers" | "students" | "parents"
                          )
                        }
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toàn trường</SelectItem>
                          <SelectItem value="teachers">Giáo viên</SelectItem>
                          <SelectItem value="students">Học sinh</SelectItem>
                          <SelectItem value="parents">Phụ huynh</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="content">Nội dung</Label>
                    <Textarea
                      id="content"
                      placeholder="Nhập nội dung thông báo..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={8}
                      className="mt-1.5"
                    />
                  </div>

                  <Button
                    onClick={handleSend}
                    disabled={sending || !title.trim() || !content.trim()}
                    className="w-full gap-2"
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Gửi thông báo
                      </>
                    )}
                  </Button>
                </div>
              </GlassCard>
            </motion.div>

            {/* Recent Notifications */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard padding="lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Thông báo gần đây
                </h2>

                <div className="space-y-3">
                  {recentNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 rounded-lg border border-border/40 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-sm line-clamp-1">
                          {notification.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={priorityColors[notification.priority]}
                        >
                          {priorityLabels[notification.priority]}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {notification.content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(notification.date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {recipientLabels[notification.recipient]}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
