// Mock data for grade entry and edit deadlines management
export interface GradeDeadline {
  id: string;
  subject: string; // Môn học
  grade: string; // Khối (e.g., "10", "11", "12")
  semester: number; // Học kỳ (1 hoặc 2)
  entryStartDate: Date; // Ngày bắt đầu nhập điểm
  entryEndDate: Date; // Ngày kết thúc nhập điểm
  editEndDate: Date; // Ngày kết thúc sửa điểm (mặc định +7 ngày sau entryEndDate)
  createdBy: string; // Người tạo
  createdAt: Date;
  updatedAt: Date;
  status: "active" | "expired" | "upcoming"; // Trạng thái
}

// Helper function to calculate edit deadline (7 days after entry deadline)
export function calculateEditDeadline(entryEndDate: Date): Date {
  const editDeadline = new Date(entryEndDate);
  editDeadline.setDate(editDeadline.getDate() + 7);
  return editDeadline;
}

// Helper function to determine status
export function getDeadlineStatus(
  entryStartDate: Date,
  editEndDate: Date
): "active" | "expired" | "upcoming" {
  const now = new Date();
  if (now < entryStartDate) return "upcoming";
  if (now > editEndDate) return "expired";
  return "active";
}

// Mock data for current school year (2024-2025)
export const mockGradeDeadlines: GradeDeadline[] = [
  // Học kỳ 1 - Khối 10
  {
    id: "gd-001",
    subject: "Toán học",
    grade: "10",
    semester: 1,
    entryStartDate: new Date("2024-09-01"),
    entryEndDate: new Date("2024-12-20"),
    editEndDate: new Date("2024-12-27"), // +7 days
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-08-25"),
    updatedAt: new Date("2024-08-25"),
    status: "expired",
  },
  {
    id: "gd-002",
    subject: "Vật lý",
    grade: "10",
    semester: 1,
    entryStartDate: new Date("2024-09-01"),
    entryEndDate: new Date("2024-12-20"),
    editEndDate: new Date("2024-12-27"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-08-25"),
    updatedAt: new Date("2024-08-25"),
    status: "expired",
  },
  {
    id: "gd-003",
    subject: "Hóa học",
    grade: "10",
    semester: 1,
    entryStartDate: new Date("2024-09-01"),
    entryEndDate: new Date("2024-12-20"),
    editEndDate: new Date("2024-12-27"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-08-25"),
    updatedAt: new Date("2024-08-25"),
    status: "expired",
  },
  {
    id: "gd-004",
    subject: "Ngữ văn",
    grade: "10",
    semester: 1,
    entryStartDate: new Date("2024-09-01"),
    entryEndDate: new Date("2024-12-20"),
    editEndDate: new Date("2024-12-27"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-08-25"),
    updatedAt: new Date("2024-08-25"),
    status: "expired",
  },
  {
    id: "gd-005",
    subject: "Tiếng Anh",
    grade: "10",
    semester: 1,
    entryStartDate: new Date("2024-09-01"),
    entryEndDate: new Date("2024-12-20"),
    editEndDate: new Date("2024-12-27"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-08-25"),
    updatedAt: new Date("2024-08-25"),
    status: "expired",
  },

  // Học kỳ 1 - Khối 11
  {
    id: "gd-006",
    subject: "Toán học",
    grade: "11",
    semester: 1,
    entryStartDate: new Date("2024-09-01"),
    entryEndDate: new Date("2024-12-20"),
    editEndDate: new Date("2024-12-27"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-08-25"),
    updatedAt: new Date("2024-08-25"),
    status: "expired",
  },
  {
    id: "gd-007",
    subject: "Vật lý",
    grade: "11",
    semester: 1,
    entryStartDate: new Date("2024-09-01"),
    entryEndDate: new Date("2024-12-20"),
    editEndDate: new Date("2024-12-27"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-08-25"),
    updatedAt: new Date("2024-08-25"),
    status: "expired",
  },
  {
    id: "gd-008",
    subject: "Hóa học",
    grade: "11",
    semester: 1,
    entryStartDate: new Date("2024-09-01"),
    entryEndDate: new Date("2024-12-20"),
    editEndDate: new Date("2024-12-27"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-08-25"),
    updatedAt: new Date("2024-08-25"),
    status: "expired",
  },

  // Học kỳ 2 - Khối 10 (Active)
  {
    id: "gd-009",
    subject: "Toán học",
    grade: "10",
    semester: 2,
    entryStartDate: new Date("2025-01-06"),
    entryEndDate: new Date("2025-05-15"),
    editEndDate: new Date("2025-05-22"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
    status: "active",
  },
  {
    id: "gd-010",
    subject: "Vật lý",
    grade: "10",
    semester: 2,
    entryStartDate: new Date("2025-01-06"),
    entryEndDate: new Date("2025-05-15"),
    editEndDate: new Date("2025-05-22"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
    status: "active",
  },
  {
    id: "gd-011",
    subject: "Hóa học",
    grade: "10",
    semester: 2,
    entryStartDate: new Date("2025-01-06"),
    entryEndDate: new Date("2025-05-15"),
    editEndDate: new Date("2025-05-22"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
    status: "active",
  },
  {
    id: "gd-012",
    subject: "Ngữ văn",
    grade: "10",
    semester: 2,
    entryStartDate: new Date("2025-01-06"),
    entryEndDate: new Date("2025-05-15"),
    editEndDate: new Date("2025-05-22"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
    status: "active",
  },

  // Học kỳ 2 - Khối 11 (Active)
  {
    id: "gd-013",
    subject: "Toán học",
    grade: "11",
    semester: 2,
    entryStartDate: new Date("2025-01-06"),
    entryEndDate: new Date("2025-05-15"),
    editEndDate: new Date("2025-05-22"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
    status: "active",
  },
  {
    id: "gd-014",
    subject: "Vật lý",
    grade: "11",
    semester: 2,
    entryStartDate: new Date("2025-01-06"),
    entryEndDate: new Date("2025-05-15"),
    editEndDate: new Date("2025-05-22"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
    status: "active",
  },
  {
    id: "gd-015",
    subject: "Sinh học",
    grade: "11",
    semester: 2,
    entryStartDate: new Date("2025-01-06"),
    entryEndDate: new Date("2025-05-15"),
    editEndDate: new Date("2025-05-22"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
    status: "active",
  },

  // Học kỳ 2 - Khối 12 (Active)
  {
    id: "gd-016",
    subject: "Toán học",
    grade: "12",
    semester: 2,
    entryStartDate: new Date("2025-01-06"),
    entryEndDate: new Date("2025-05-15"),
    editEndDate: new Date("2025-05-22"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
    status: "active",
  },
  {
    id: "gd-017",
    subject: "Vật lý",
    grade: "12",
    semester: 2,
    entryStartDate: new Date("2025-01-06"),
    entryEndDate: new Date("2025-05-15"),
    editEndDate: new Date("2025-05-22"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
    status: "active",
  },
  {
    id: "gd-018",
    subject: "Hóa học",
    grade: "12",
    semester: 2,
    entryStartDate: new Date("2025-01-06"),
    entryEndDate: new Date("2025-05-15"),
    editEndDate: new Date("2025-05-22"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
    status: "active",
  },

  // Upcoming deadlines
  {
    id: "gd-019",
    subject: "Toán học",
    grade: "10",
    semester: 1,
    entryStartDate: new Date("2025-09-01"),
    entryEndDate: new Date("2025-12-20"),
    editEndDate: new Date("2025-12-27"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2025-08-20"),
    updatedAt: new Date("2025-08-20"),
    status: "upcoming",
  },
  {
    id: "gd-020",
    subject: "Tiếng Anh",
    grade: "12",
    semester: 2,
    entryStartDate: new Date("2025-01-06"),
    entryEndDate: new Date("2025-05-15"),
    editEndDate: new Date("2025-05-22"),
    createdBy: "Nguyễn Văn A",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
    status: "active",
  },
];

// List of subjects
export const mockSubjects = [
  "Toán học",
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Ngữ văn",
  "Tiếng Anh",
  "Lịch sử",
  "Địa lý",
  "GDCD",
  "Tin học",
  "Thể dục",
  "Công nghệ",
];

// List of grades
export const mockGrades = ["10", "11", "12"];

// List of semesters
export const mockSemesters = [
  { value: 1, label: "Học kỳ 1" },
  { value: 2, label: "Học kỳ 2" },
];
