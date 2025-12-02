// Mock data for grade entry and edit deadlines management
export interface GradeDeadline {
  id: string;
  academicYear: string; // Năm học (e.g., "2024-2025")
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
    academicYear: "2024-2025",
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
  // Học kỳ 1 - Khối 11
  {
    id: "gd-002",
    academicYear: "2024-2025",
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
  // Học kỳ 1 - Khối 12
  {
    id: "gd-003",
    academicYear: "2024-2025",
    grade: "12",
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
    id: "gd-004",
    academicYear: "2024-2025",
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
    id: "gd-005",
    academicYear: "2024-2025",
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
    id: "gd-006",
    academicYear: "2024-2025",
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
    id: "gd-007",
    academicYear: "2025-2026",
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
];

// List of grades
export const mockGrades = ["10", "11", "12"];

// List of semesters
export const mockSemesters = [
  { value: 1, label: "Học kỳ 1" },
  { value: 2, label: "Học kỳ 2" },
];

// List of academic years
export const mockAcademicYears = ["2023-2024", "2024-2025", "2025-2026"];
