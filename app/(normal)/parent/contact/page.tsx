"use client";

import { useAuth, isParent } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, User, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  sender: "parent" | "teacher";
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

// Hard-coded messages
const HARDCODED_MESSAGES: Message[] = [
  {
    id: "MSG001",
    sender: "teacher",
    senderName: "Cô Nguyễn Thị Lan",
    content: "Chào phụ huynh, em học tập rất tốt trong tuần này. Chúc mừng!",
    timestamp: "2025-12-20 09:30",
    isRead: true,
  },
  {
    id: "MSG002",
    sender: "parent",
    senderName: "Phụ huynh",
    content: "Xin cảm ơn cô. Con em có cần cải thiện gì thêm không ạ?",
    timestamp: "2025-12-20 10:15",
    isRead: true,
  },
  {
    id: "MSG003",
    sender: "teacher",
    senderName: "Cô Nguyễn Thị Lan",
    content:
      "Em cần chú ý hơn vào môn Toán, phụ huynh có thể giúp em ôn tập thêm ở nhà.",
    timestamp: "2025-12-20 14:20",
    isRead: true,
  },
  {
    id: "MSG004",
    sender: "parent",
    senderName: "Phụ huynh",
    content: "Dạ em. Tôi sẽ cho con học thêm môn Toán. Cảm ơn cô đã quan tâm!",
    timestamp: "2025-12-20 16:45",
    isRead: true,
  },
  {
    id: "MSG005",
    sender: "teacher",
    senderName: "Cô Nguyễn Thị Lan",
    content:
      "Tuần tới nhà trường sẽ có họp phụ huynh. Mong phụ huynh sắp xếp tham gia nhé!",
    timestamp: "2025-12-22 08:00",
    isRead: true,
  },
  {
    id: "MSG006",
    sender: "parent",
    senderName: "Phụ huynh",
    content: "Dạ em, tôi sẽ có mặt đúng giờ. Xin cảm ơn cô!",
    timestamp: "2025-12-22 09:30",
    isRead: true,
  },
  {
    id: "MSG007",
    sender: "teacher",
    senderName: "Cô Nguyễn Thị Lan",
    content:
      "Em có vẻ chưa tập trung trong giờ học gần đây. Phụ huynh nên nhắc nhở em thêm.",
    timestamp: "2025-12-23 15:30",
    isRead: false,
  },
];

export default function ContactTeacherPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(HARDCODED_MESSAGES);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || !isParent(user))) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `MSG${String(messages.length + 1).padStart(3, "0")}`,
      sender: "parent",
      senderName: "Phụ huynh",
      content: newMessage,
      timestamp: new Date().toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      isRead: true,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

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

  const unreadCount = messages.filter(
    (m) => m.sender === "teacher" && !m.isRead
  ).length;

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-20">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Link href="/parent">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Liên hệ giáo viên chủ nhiệm
                </h1>
                <p className="text-muted-foreground mt-1">
                  Giao tiếp trực tiếp với giáo viên của con em
                </p>
              </div>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-fit">
                  {unreadCount} mới
                </Badge>
              )}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Teacher Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard padding="md">
                <h3 className="text-lg font-semibold mb-4">
                  Thông tin giáo viên
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/20">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        CL
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-lg">
                        Cô Nguyễn Thị Lan
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Giáo viên chủ nhiệm
                      </p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        Lớp 10A1
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">
                        nguyenlan@school.edu.vn
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Số điện thoại
                      </p>
                      <p className="text-sm font-medium">0123 456 789</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Môn giảng dạy
                      </p>
                      <p className="text-sm font-medium">Toán học</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Thời gian làm việc
                      </p>
                      <p className="text-sm font-medium">
                        Thứ 2 - Thứ 6, 7:00 - 17:00
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-muted-foreground mb-2">
                      Thống kê tin nhắn
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 rounded-lg bg-blue-500/10">
                        <p className="text-2xl font-bold text-blue-600">
                          {messages.length}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Tổng tin nhắn
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-orange-500/10">
                        <p className="text-2xl font-bold text-orange-600">
                          {unreadCount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Chưa đọc
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Chat Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <GlassCard padding="none" className="flex flex-col h-[600px]">
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        CL
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">Cô Nguyễn Thị Lan</h4>
                      <p className="text-xs text-muted-foreground">
                        Giáo viên chủ nhiệm lớp 10A1
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Đang hoạt động
                    </Badge>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`flex gap-3 ${
                          message.sender === "parent"
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback
                            className={
                              message.sender === "teacher"
                                ? "bg-primary/10 text-primary"
                                : "bg-green-500/10 text-green-600"
                            }
                          >
                            {message.sender === "teacher" ? (
                              <User className="h-4 w-4" />
                            ) : (
                              "PH"
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`flex-1 ${
                            message.sender === "parent"
                              ? "flex flex-col items-end"
                              : ""
                          }`}
                        >
                          <div
                            className={`inline-block max-w-[80%] p-3 rounded-lg ${
                              message.sender === "teacher"
                                ? "bg-white/50 dark:bg-white/5 text-foreground"
                                : "bg-primary text-primary-foreground"
                            }`}
                          >
                            <p className="text-sm font-medium mb-1">
                              {message.senderName}
                            </p>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1 px-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp}
                            </span>
                            {message.sender === "parent" && (
                              <Badge variant="outline" className="text-xs h-5">
                                Đã gửi
                              </Badge>
                            )}
                            {message.sender === "teacher" &&
                              !message.isRead && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs h-5"
                                >
                                  Mới
                                </Badge>
                              )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Nhập tin nhắn của bạn..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="min-h-[60px] resize-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="icon"
                      className="h-[60px] w-[60px] shrink-0"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Nhấn Enter để gửi, Shift + Enter để xuống dòng
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </>
  );
}
