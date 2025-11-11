// Notifications and Announcements
export interface Notification {
  id: string;
  type: "announcement" | "grade" | "conduct" | "schedule" | "leave" | "system";
  title: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: "teacher" | "principal" | "admin";
  recipientType: "all" | "class" | "student" | "parent";
  recipientIds?: string[]; // class IDs or user IDs
  isRead: boolean;
  isImportant: boolean;
  createdAt: string;
  attachments?: { name: string; url: string }[];
}

export const mockNotifications: Notification[] = [
  {
    id: "N001",
    type: "announcement",
    title: "Thông báo nghỉ học ngày 20/12/2024",
    content:
      "Kính gửi quý phụ huynh và các em học sinh. Nhà trường xin thông báo nghỉ học vào ngày 20/12/2024 (Thứ Sáu) nhân dịp Ngày Nhà giáo Việt Nam. Học sinh sẽ trở lại học bình thường vào ngày 23/12/2024 (Thứ Hai). Trân trọng!",
    senderId: "GV000",
    senderName: "Nguyễn Văn A",
    senderRole: "principal",
    recipientType: "all",
    isRead: false,
    isImportant: true,
    createdAt: "2024-12-15T08:00:00",
    attachments: [],
  },
  {
    id: "N002",
    type: "grade",
    title: "Điểm kiểm tra 15 phút môn Toán",
    content:
      "Điểm kiểm tra 15 phút môn Toán học kỳ I đã được cập nhật. Học sinh và phụ huynh vui lòng kiểm tra.",
    senderId: "GV001",
    senderName: "Phạm Văn D",
    senderRole: "teacher",
    recipientType: "class",
    recipientIds: ["10A1"],
    isRead: false,
    isImportant: false,
    createdAt: "2024-12-10T14:30:00",
  },
  {
    id: "N003",
    type: "conduct",
    title: "Nhận xét hạnh kiểm tháng 12",
    content:
      "Nhận xét hạnh kiểm tháng 12/2024 đã được cập nhật. Phụ huynh và học sinh vui lòng theo dõi để có biện pháp điều chỉnh kịp thời.",
    senderId: "GV001",
    senderName: "Phạm Văn D",
    senderRole: "teacher",
    recipientType: "class",
    recipientIds: ["10A1"],
    isRead: true,
    isImportant: false,
    createdAt: "2024-12-08T16:00:00",
  },
  {
    id: "N004",
    type: "announcement",
    title: "Thông báo thi học kỳ I năm học 2024-2025",
    content:
      "Kỳ thi học kỳ I năm học 2024-2025 sẽ diễn ra từ ngày 06/01/2025 đến 12/01/2025. Lịch thi chi tiết sẽ được thông báo sau. Học sinh cần ôn tập kỹ lưỡng.",
    senderId: "GV000",
    senderName: "Nguyễn Văn A",
    senderRole: "principal",
    recipientType: "all",
    isRead: true,
    isImportant: true,
    createdAt: "2024-12-01T09:00:00",
    attachments: [
      { name: "Lich_thi_HKI_2024-2025.pdf", url: "/files/lich-thi-hk1.pdf" },
    ],
  },
  {
    id: "N005",
    type: "schedule",
    title: "Điều chỉnh thời khóa biểu tuần 15",
    content:
      "Thời khóa biểu tuần 15 (từ 16/12 - 21/12) có thay đổi: Tiết 3 thứ 4 môn Vật lý chuyển sang môn Hóa học. Học sinh lưu ý chuẩn bị bài đầy đủ.",
    senderId: "GV001",
    senderName: "Phạm Văn D",
    senderRole: "teacher",
    recipientType: "class",
    recipientIds: ["10A1"],
    isRead: false,
    isImportant: true,
    createdAt: "2024-12-14T07:00:00",
  },
  {
    id: "N006",
    type: "announcement",
    title: "Cuộc thi Olympic Toán học cấp tỉnh",
    content:
      "Nhà trường tổ chức tuyển chọn học sinh tham gia cuộc thi Olympic Toán học cấp tỉnh. Học sinh có nguyện vọng đăng ký tại văn phòng trước ngày 20/12/2024.",
    senderId: "GV001",
    senderName: "Phạm Văn D",
    senderRole: "teacher",
    recipientType: "all",
    isRead: true,
    isImportant: false,
    createdAt: "2024-12-05T10:00:00",
  },
  {
    id: "N007",
    type: "leave",
    title: "Đơn xin nghỉ học của học sinh Nguyễn Văn B",
    content:
      "Phụ huynh của học sinh Nguyễn Văn B đã gửi đơn xin nghỉ học ngày 18/12/2024 do lý do sức khỏe. Đơn đã được phê duyệt.",
    senderId: "P001",
    senderName: "Lê Thị X",
    senderRole: "teacher",
    recipientType: "student",
    recipientIds: ["HS001"],
    isRead: true,
    isImportant: false,
    createdAt: "2024-12-17T06:30:00",
  },
  {
    id: "N008",
    type: "system",
    title: "Cập nhật hệ thống",
    content:
      "Hệ thống sổ điểm điện tử sẽ được bảo trì vào 22:00 - 23:00 ngày 20/12/2024. Trong thời gian này, các chức năng có thể tạm thời không khả dụng.",
    senderId: "ADMIN",
    senderName: "Quản trị viên",
    senderRole: "admin",
    recipientType: "all",
    isRead: false,
    isImportant: false,
    createdAt: "2024-12-18T12:00:00",
  },
];

// Helper functions
export function getNotificationsByUser(
  userId: string,
  userRole: "student" | "parent" | "teacher" | "principal",
  userClass?: string
): Notification[] {
  return mockNotifications.filter((notif) => {
    // All users see 'all' notifications
    if (notif.recipientType === "all") return true;

    // Class-based notifications
    if (notif.recipientType === "class" && userClass) {
      return notif.recipientIds?.includes(userClass);
    }

    // Direct notifications to user
    if (
      (notif.recipientType === "student" && userRole === "student") ||
      (notif.recipientType === "parent" && userRole === "parent")
    ) {
      return notif.recipientIds?.includes(userId);
    }

    return false;
  });
}

export function getUnreadCount(userId: string, userClass?: string): number {
  return mockNotifications.filter(
    (notif) =>
      !notif.isRead &&
      (notif.recipientType === "all" ||
        (notif.recipientType === "class" &&
          userClass &&
          notif.recipientIds?.includes(userClass)) ||
        notif.recipientIds?.includes(userId))
  ).length;
}

export function markAsRead(notificationId: string): void {
  const notif = mockNotifications.find((n) => n.id === notificationId);
  if (notif) notif.isRead = true;
}

export function createNotification(
  notification: Omit<Notification, "id" | "createdAt">
): Notification {
  const newNotif: Notification = {
    ...notification,
    id: `N${String(mockNotifications.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
  };
  mockNotifications.unshift(newNotif);
  return newNotif;
}
