// Grades and Academic Data
export interface Grade {
  studentId: string;
  subjectId: string;
  subjectName: string;
  semester: 1 | 2;
  academicYear: string;
  scores: {
    oral: number[]; // Điểm miệng
    test15min: number[]; // Điểm 15 phút
    test45min: number[]; // Điểm 1 tiết
    midterm: number; // Điểm giữa kỳ
    final: number; // Điểm cuối kỳ
  };
  average: number;
  teacherId: string;
  teacherName: string;
}

export interface Conduct {
  studentId: string;
  semester: 1 | 2;
  academicYear: string;
  rating: "Tốt" | "Khá" | "Trung bình" | "Yếu";
  comment: string;
  teacherId: string;
  teacherName: string;
  updatedAt: string;
}

// Mock Grades Data
export const mockGrades: Grade[] = [
  // Student S001 - Nguyễn Văn A - 10A1
  {
    studentId: "2024001",
    subjectId: "TOAN",
    subjectName: "Toán học",
    semester: 1,
    academicYear: "2024-2025",
    scores: {
      oral: [8, 9, 7],
      test15min: [8.5, 9],
      test45min: [8, 9],
      midterm: 8.5,
      final: 9,
    },
    average: 8.6,
    teacherId: "GV001",
    teacherName: "Phạm Văn D",
  },
  {
    studentId: "2024001",
    subjectId: "VAN",
    subjectName: "Ngữ văn",
    semester: 1,
    academicYear: "2024-2025",
    scores: {
      oral: [7, 8, 7.5],
      test15min: [7, 8],
      test45min: [7.5, 8],
      midterm: 7.5,
      final: 8,
    },
    average: 7.6,
    teacherId: "GV002",
    teacherName: "Nguyễn Thị E",
  },
  {
    studentId: "2024001",
    subjectId: "ANH",
    subjectName: "Tiếng Anh",
    semester: 1,
    academicYear: "2024-2025",
    scores: {
      oral: [9, 9, 8.5],
      test15min: [9, 9.5],
      test45min: [9, 9],
      midterm: 9,
      final: 9.5,
    },
    average: 9.1,
    teacherId: "GV004",
    teacherName: "Lê Thị G",
  },
  {
    studentId: "2024001",
    subjectId: "LY",
    subjectName: "Vật lý",
    semester: 1,
    academicYear: "2024-2025",
    scores: {
      oral: [8, 8.5, 9],
      test15min: [8, 8.5],
      test45min: [8.5, 9],
      midterm: 8.5,
      final: 9,
    },
    average: 8.6,
    teacherId: "GV003",
    teacherName: "Trần Văn F",
  },
  {
    studentId: "2024001",
    subjectId: "HOA",
    subjectName: "Hóa học",
    semester: 1,
    academicYear: "2024-2025",
    scores: {
      oral: [7.5, 8, 7],
      test15min: [7.5, 8],
      test45min: [7, 8],
      midterm: 7.5,
      final: 8,
    },
    average: 7.6,
    teacherId: "GV005",
    teacherName: "Nguyễn Văn H",
  },

  // Student S002 - Trần Thị B - 10A1
  {
    studentId: "2024002",
    subjectId: "TOAN",
    subjectName: "Toán học",
    semester: 1,
    academicYear: "2024-2025",
    scores: {
      oral: [9, 9, 9.5],
      test15min: [9, 9.5],
      test45min: [9, 9.5],
      midterm: 9.5,
      final: 9.5,
    },
    average: 9.3,
    teacherId: "GV001",
    teacherName: "Phạm Văn D",
  },
  {
    studentId: "2024002",
    subjectId: "VAN",
    subjectName: "Ngữ văn",
    semester: 1,
    academicYear: "2024-2025",
    scores: {
      oral: [8, 8.5, 9],
      test15min: [8, 8.5],
      test45min: [8.5, 9],
      midterm: 8.5,
      final: 9,
    },
    average: 8.6,
    teacherId: "GV002",
    teacherName: "Nguyễn Thị E",
  },
];

// Mock Conduct Data
export const mockConduct: Conduct[] = [
  {
    studentId: "2024001",
    semester: 1,
    academicYear: "2024-2025",
    rating: "Tốt",
    comment:
      "Học sinh có ý thức học tập tốt, tích cực tham gia các hoạt động của lớp và nhà trường. Luôn chấp hành nội quy, quy định.",
    teacherId: "GV001",
    teacherName: "Phạm Văn D",
    updatedAt: "2024-11-10T10:00:00Z",
  },
  {
    studentId: "2024002",
    semester: 1,
    academicYear: "2024-2025",
    rating: "Tốt",
    comment:
      "Học sinh gương mẫu, luôn đạt thành tích cao trong học tập. Nhiệt tình giúp đỡ bạn bè. Là tấm gương cho các bạn trong lớp.",
    teacherId: "GV001",
    teacherName: "Phạm Văn D",
    updatedAt: "2024-11-10T10:05:00Z",
  },
  {
    studentId: "2024003",
    semester: 1,
    academicYear: "2024-2025",
    rating: "Khá",
    comment:
      "Học sinh có ý thức học tập khá tốt. Cần cố gắng hơn nữa trong việc tham gia các hoạt động tập thể.",
    teacherId: "GV003",
    teacherName: "Trần Văn F",
    updatedAt: "2024-11-10T10:10:00Z",
  },
];

// Helper functions
export function getGradesByStudent(
  studentId: string,
  semester?: number,
  academicYear?: string
) {
  return mockGrades.filter(
    (g) =>
      g.studentId === studentId &&
      (!semester || g.semester === semester) &&
      (!academicYear || g.academicYear === academicYear)
  );
}

export function getConductByStudent(
  studentId: string,
  semester?: number,
  academicYear?: string
) {
  return mockConduct.find(
    (c) =>
      c.studentId === studentId &&
      (!semester || c.semester === semester) &&
      (!academicYear || c.academicYear === academicYear)
  );
}

export function calculateGPA(grades: Grade[]): number {
  if (grades.length === 0) return 0;
  const sum = grades.reduce((acc, g) => acc + g.average, 0);
  return Math.round((sum / grades.length) * 10) / 10;
}

// Subjects
export const subjects = [
  { id: "TOAN", name: "Toán học", code: "TOAN" },
  { id: "VAN", name: "Ngữ văn", code: "VAN" },
  { id: "ANH", name: "Tiếng Anh", code: "ANH" },
  { id: "LY", name: "Vật lý", code: "LY" },
  { id: "HOA", name: "Hóa học", code: "HOA" },
  { id: "SINH", name: "Sinh học", code: "SINH" },
  { id: "SU", name: "Lịch sử", code: "SU" },
  { id: "DIA", name: "Địa lý", code: "DIA" },
  { id: "GDCD", name: "GDCD", code: "GDCD" },
  { id: "TD", name: "Thể dục", code: "TD" },
  { id: "CN", name: "Công nghệ", code: "CN" },
  { id: "TIN", name: "Tin học", code: "TIN" },
];
