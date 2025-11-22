"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Send,
  Bell,
  Users,
  UserCog,
  GraduationCap,
  Home,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type RecipientType =
  | "students"
  | "parents"
  | "homeroom-teachers"
  | "subject-teachers";
type Priority = "high" | "medium" | "low";

export default function SchoolNotificationPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [recipients, setRecipients] = useState<RecipientType[]>([]);
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

  const handleRecipientToggle = (type: RecipientType) => {
    setRecipients((prev) =>
      prev.includes(type) ? prev.filter((r) => r !== type) : [...prev, type]
    );
  };

  const handleSend = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
      return;
    }

    if (recipients.length === 0) {
      alert("Vui lòng chọn ít nhất một đối tượng nhận thông báo!");
      return;
    }

    setSending(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Sending notification:", {
      title,
      content,
      priority,
      recipients,
      timestamp: new Date().toISOString(),
    });

    setSending(false);
    setSent(true);

    // Reset form after 2 seconds
    setTimeout(() => {
      setTitle("");
      setContent("");
      setPriority("medium");
      setRecipients([]);
      setSent(false);
    }, 2000);
  };

  const recipientOptions = [
    {
      type: "students" as RecipientType,
      label: "Học sinh",
      icon: GraduationCap,
      description: "Gửi đến tất cả học sinh",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      type: "parents" as RecipientType,
      label: "Phụ huynh",
      icon: Home,
      description: "Gửi đến phụ huynh học sinh",
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      type: "homeroom-teachers" as RecipientType,
      label: "Giáo viên chủ nhiệm",
      icon: UserCog,
      description: "Gửi đến GVCN các lớp",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      type: "subject-teachers" as RecipientType,
      label: "Giáo viên bộ môn",
      icon: Users,
      description: "Gửi đến tất cả giáo viên",
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ];

  const priorityColors = {
    high: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    medium:
      "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    low: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  };

  const priorityLabels = {
    high: "Quan trọng",
    medium: "Bình thường",
    low: "Thông tin",
  };

  if (sent) {
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center min-h-[60vh]"
            >
              <GlassCard padding="lg" className="text-center max-w-md">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4"
                >
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2">Gửi thành công!</h2>
                <p className="text-muted-foreground mb-6">
                  Thông báo đã được gửi đến {recipients.length} nhóm đối tượng
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {recipients.map((type) => {
                    const option = recipientOptions.find(
                      (o) => o.type === type
                    );
                    return option ? (
                      <Badge key={type} variant="outline">
                        {option.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

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
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold bg-linear-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent flex items-center gap-3">
              <Bell className="h-8 w-8 text-orange-600" />
              Thông báo toàn trường
            </h1>
            <p className="text-muted-foreground mt-2">
              Gửi thông báo đến học sinh, phụ huynh và giáo viên
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notification Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <GlassCard padding="lg">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Nội dung thông báo
                </h2>

                <div className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Tiêu đề</Label>
                    <Input
                      id="title"
                      placeholder="Nhập tiêu đề thông báo..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label htmlFor="priority">Mức độ ưu tiên</Label>
                    <Select
                      value={priority}
                      onValueChange={(value) => setPriority(value as Priority)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">🔴 Quan trọng</SelectItem>
                        <SelectItem value="medium">🟡 Bình thường</SelectItem>
                        <SelectItem value="low">🔵 Thông tin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content">Nội dung</Label>
                    <Textarea
                      id="content"
                      placeholder="Nhập nội dung thông báo chi tiết..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={10}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      {content.length} ký tự
                    </p>
                  </div>

                  {/* Preview */}
                  {(title || content) && (
                    <div className="rounded-lg border border-border/50 p-4 bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-2">
                        Xem trước
                      </p>
                      {title && (
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Badge className={priorityColors[priority]}>
                            {priorityLabels[priority]}
                          </Badge>
                          {title}
                        </h3>
                      )}
                      {content && (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {content}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>

            {/* Recipients Selection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard padding="lg" className="sticky top-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Đối tượng nhận
                </h2>

                <div className="space-y-3 mb-6">
                  {recipientOptions.map((option, index) => (
                    <motion.div
                      key={option.type}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-lg border border-border/50 transition-all cursor-pointer hover:shadow-md",
                        recipients.includes(option.type)
                          ? "bg-primary/5 border-primary/30"
                          : "bg-white/50 dark:bg-gray-800/50"
                      )}
                      onClick={() => handleRecipientToggle(option.type)}
                    >
                      <Checkbox
                        checked={recipients.includes(option.type)}
                        onCheckedChange={() =>
                          handleRecipientToggle(option.type)
                        }
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={cn("p-1.5 rounded", option.bgColor)}>
                            <option.icon
                              className={cn("h-4 w-4", option.color)}
                            />
                          </div>
                          <span className="font-medium">{option.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Summary */}
                <div className="rounded-lg bg-muted/50 p-4 mb-4">
                  <p className="text-sm font-medium mb-2">Tổng quan:</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Đối tượng</span>
                    <Badge>{recipients.length} nhóm</Badge>
                  </div>
                </div>

                {/* Send Button */}
                <Button
                  onClick={handleSend}
                  disabled={
                    sending || !title || !content || recipients.length === 0
                  }
                  className="w-full bg-linear-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
                  size="lg"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Gửi thông báo
                    </>
                  )}
                </Button>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
