"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TeacherUser } from "@/mork-data";
import { Send, AlertCircle, CheckCircle2 } from "lucide-react";

interface NotificationSenderProps {
  teacher: TeacherUser;
}

export function NotificationSender({ teacher }: NotificationSenderProps) {
  const [notificationType, setNotificationType] = useState("announcement");
  const [recipientType, setRecipientType] = useState<"all" | "class">("class");
  const [selectedClass, setSelectedClass] = useState(teacher.classes[0] || "");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const notificationTypes = [
    { value: "announcement", label: "Thông báo chung" },
    { value: "grade", label: "Thông báo điểm" },
    { value: "conduct", label: "Thông báo hạnh kiểm" },
    { value: "schedule", label: "Thông báo lịch học" },
    { value: "leave", label: "Thông báo nghỉ học" },
  ];

  const handleSend = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung");
      return;
    }

    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setShowSuccess(true);
    setIsSending(false);

    // Reset form
    setTimeout(() => {
      setTitle("");
      setContent("");
      setIsImportant(false);
      setShowSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <GlassCard padding="md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Gửi thông báo</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Gửi thông báo tới học sinh và phụ huynh
            </p>
          </div>
        </div>
      </GlassCard>

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <GlassCard
            padding="md"
            className="bg-green-500/10 border-green-500/20"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <p className="font-semibold text-green-700 dark:text-green-400">
                Gửi thông báo thành công!
              </p>
            </div>
          </GlassCard>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard padding="lg">
          <h3 className="font-semibold mb-4">Thông tin thông báo</h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="type">Loại thông báo</Label>
              <Select
                value={notificationType}
                onValueChange={setNotificationType}
              >
                <SelectTrigger id="type" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {notificationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Tiêu đề</Label>
              <input
                id="title"
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                placeholder="Nhập tiêu đề thông báo..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="content">Nội dung</Label>
              <Textarea
                id="content"
                placeholder="Nhập nội dung thông báo..."
                className="mt-2 min-h-[150px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="important"
                className="h-4 w-4 rounded border-gray-300"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
              />
              <Label htmlFor="important" className="cursor-pointer">
                Đánh dấu là thông báo quan trọng
              </Label>
            </div>
          </div>
        </GlassCard>

        <GlassCard padding="lg">
          <h3 className="font-semibold mb-4">Đối tượng nhận</h3>

          <div className="space-y-4">
            <div>
              <Label>Gửi tới</Label>
              <RadioGroup
                value={recipientType}
                onValueChange={(value: "all" | "class") =>
                  setRecipientType(value)
                }
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="cursor-pointer">
                    Toàn trường
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="class" id="class" />
                  <Label htmlFor="class" className="cursor-pointer">
                    Lớp học cụ thể
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {recipientType === "class" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Label htmlFor="class-select">Chọn lớp</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger id="class-select" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {teacher.classes.map((classId) => (
                      <SelectItem key={classId} value={classId}>
                        {classId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}

            <GlassCard
              padding="md"
              className="bg-blue-500/5 border-blue-500/20"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-semibold text-blue-700 dark:text-blue-400">
                    Lưu ý:
                  </p>
                  <ul className="text-muted-foreground space-y-1">
                    <li>
                      • Thông báo sẽ được gửi đến cả học sinh và phụ huynh
                    </li>
                    <li>• Thông báo quan trọng sẽ được hiển thị nổi bật</li>
                    <li>• Không thể chỉnh sửa sau khi đã gửi</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <Button
              className="w-full gap-2"
              size="lg"
              onClick={handleSend}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <span className="animate-spin">⏳</span>
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
      </div>
    </div>
  );
}
