// components/section/parent/notifications-list.tsx
"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertCircle, BookOpen, Calendar, MessageSquare } from "lucide-react";
import { Notification } from "@/mork-data";

interface NotificationsListProps {
  notifications: Notification[];
}

const notificationIcons = {
  announcement: Bell,
  grade: BookOpen,
  conduct: AlertCircle,
  schedule: Calendar,
  leave: MessageSquare,
  system: Bell,
};

const notificationColors = {
  announcement: "text-blue-500 bg-blue-500/10",
  grade: "text-green-500 bg-green-500/10",
  conduct: "text-orange-500 bg-orange-500/10",
  schedule: "text-purple-500 bg-purple-500/10",
  leave: "text-pink-500 bg-pink-500/10",
  system: "text-gray-500 bg-gray-500/10",
};

export function NotificationsList({ notifications }: NotificationsListProps) {
  return (
    <GlassCard padding="md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Thông báo từ giáo viên</h3>
        <Badge variant="secondary">
          {notifications.filter((n) => !n.isRead).length} mới
        </Badge>
      </div>
      
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>Chưa có thông báo nào</p>
          </div>
        ) : (
          notifications.map((notif, index) => {
            const Icon = notificationIcons[notif.type];
            const colorClass = notificationColors[notif.type];
            
            return (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 rounded-lg hover:bg-white/5 dark:hover:bg-black/5 cursor-pointer transition-colors border border-white/10"
              >
                <div className="flex gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-medium text-sm">{notif.title}</h4>
                      {!notif.isRead && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {notif.content}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>
                        {new Date(notif.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span>Từ: {notif.senderName}</span>
                      {notif.isImportant && (
                        <>
                          <span>•</span>
                          <Badge variant="destructive" className="text-xs px-1 py-0">
                            Quan trọng
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </GlassCard>
  );
}
