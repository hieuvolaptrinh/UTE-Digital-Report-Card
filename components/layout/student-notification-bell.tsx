"use client";

import * as React from "react";
import { Bell, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Hard-coded notifications
const HARDCODED_NOTIFICATIONS = [
  {
    id: "1",
    title: "Giáo viên nhập điểm",
    message: "Giáo viên Nguyễn Văn Minh đã nhập điểm môn Toán học",
    score: 8.5,
    teacher: "Nguyễn Văn Minh",
    subject: "Toán học",
    time: "10 phút trước",
    read: false,
  },
  {
    id: "2",
    title: "Giáo viên nhập điểm",
    message: "Giáo viên Trần Thị Lan đã nhập điểm môn Vật lý",
    score: 9.0,
    teacher: "Trần Thị Lan",
    subject: "Vật lý",
    time: "1 giờ trước",
    read: false,
  },
  {
    id: "3",
    title: "Giáo viên nhập điểm",
    message: "Giáo viên Lê Văn Tùng đã nhập điểm môn Hóa học",
    score: 7.5,
    teacher: "Lê Văn Tùng",
    subject: "Hóa học",
    time: "3 giờ trước",
    read: true,
  },
  {
    id: "4",
    title: "Giáo viên nhập điểm",
    message: "Giáo viên Hoàng Thị Hoa đã nhập điểm môn Ngữ văn",
    score: 8.8,
    teacher: "Hoàng Thị Hoa",
    subject: "Ngữ văn",
    time: "5 giờ trước",
    read: true,
  },
  {
    id: "5",
    title: "Giáo viên nhập điểm",
    message: "Giáo viên Đỗ Văn Nam đã nhập điểm môn Tiếng Anh",
    score: 9.2,
    teacher: "Đỗ Văn Nam",
    subject: "Tiếng Anh",
    time: "Hôm qua",
    read: true,
  },
];

export function StudentNotificationBell(): React.ReactNode {
  const unreadCount = HARDCODED_NOTIFICATIONS.filter((n) => !n.read).length;

  const getScoreBadgeColor = (score: number) => {
    if (score >= 8.0)
      return "bg-green-500/10 text-green-700 border-green-500/20";
    if (score >= 6.5) return "bg-blue-500/10 text-blue-700 border-blue-500/20";
    if (score >= 5.0)
      return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
    return "bg-red-500/10 text-red-700 border-red-500/20";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <>
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Thông báo nhập điểm</span>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} mới
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[500px] overflow-y-auto">
          {HARDCODED_NOTIFICATIONS.map((notification) => (
            <div
              key={notification.id}
              className={cn(
                "p-3 hover:bg-muted/50 cursor-pointer border-b transition-colors",
                !notification.read && "bg-primary/5"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg shrink-0 bg-blue-500/10">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        !notification.read && "text-primary"
                      )}
                    >
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="h-2 w-2 bg-blue-500 rounded-full shrink-0 mt-1"></span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-xs">
                      {notification.subject}
                    </Badge>
                    <Badge
                      variant="default"
                      className={cn(
                        "text-xs",
                        getScoreBadgeColor(notification.score)
                      )}
                    >
                      {notification.score} điểm
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      {notification.teacher}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full">
            Xem tất cả thông báo
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
