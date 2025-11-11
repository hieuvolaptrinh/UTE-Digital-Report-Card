// Mock Conduct (Hạnh kiểm) Data
export interface Conduct {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  semester: number;
  academicYear: string;
  rating: "Tốt" | "Khá" | "Trung bình" | "Yếu";
  notes?: string;
  teacherId: string;
  teacherName: string;
  lastUpdated: string;
}

export const mockConduct: Conduct[] = [
  {
    id: "CD001",
    studentId: "SV001",
    studentName: "Nguyễn Văn A",
    class: "12A1",
    semester: 1,
    academicYear: "2024-2025",
    rating: "Tốt",
    notes: "Học sinh chăm chỉ, có ý thức tự giác",
    teacherId: "GV001",
    teacherName: "Nguyễn Thị B",
    lastUpdated: "2024-12-15",
  },
  {
    id: "CD002",
    studentId: "SV002",
    studentName: "Trần Thị C",
    class: "12A1",
    semester: 1,
    academicYear: "2024-2025",
    rating: "Tốt",
    notes: "Tham gia tích cực các hoạt động tập thể",
    teacherId: "GV001",
    teacherName: "Nguyễn Thị B",
    lastUpdated: "2024-12-15",
  },
  {
    id: "CD003",
    studentId: "SV003",
    studentName: "Lê Văn D",
    class: "12A1",
    semester: 1,
    academicYear: "2024-2025",
    rating: "Khá",
    notes: "Cần cải thiện về nề nếp",
    teacherId: "GV001",
    teacherName: "Nguyễn Thị B",
    lastUpdated: "2024-12-15",
  },
];

// Grade Edit Requests
export interface GradeEditRequest {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  subject: string;
  subjectId: string;
  semester: number;
  academicYear: string;
  currentScore: {
    type: "oral" | "test15min" | "test45min" | "midterm" | "final";
    value: number;
  };
  proposedScore: number;
  reason: string;
  requestedBy: string;
  requestedByName: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedByName?: string;
  reviewDate?: string;
  reviewNote?: string;
}

export const mockGradeEditRequests: GradeEditRequest[] = [
  {
    id: "GER001",
    studentId: "SV001",
    studentName: "Nguyễn Văn A",
    class: "12A1",
    subject: "Toán",
    subjectId: "TOAN",
    semester: 1,
    academicYear: "2024-2025",
    currentScore: {
      type: "test45min",
      value: 7.5,
    },
    proposedScore: 8.0,
    reason: "Chấm thiếu câu cuối, học sinh đã làm đúng",
    requestedBy: "GV001",
    requestedByName: "Nguyễn Thị B",
    requestDate: "2024-12-10",
    status: "pending",
  },
  {
    id: "GER002",
    studentId: "SV002",
    studentName: "Trần Thị C",
    class: "12A1",
    subject: "Lý",
    subjectId: "LY",
    semester: 1,
    academicYear: "2024-2025",
    currentScore: {
      type: "midterm",
      value: 6.0,
    },
    proposedScore: 6.5,
    reason: "Điểm trung bình cộng không chính xác, cần cộng điểm thưởng",
    requestedBy: "GV002",
    requestedByName: "Trần Văn D",
    requestDate: "2024-12-08",
    status: "approved",
    reviewedBy: "HT001",
    reviewedByName: "Phạm Thị E - Hiệu trưởng",
    reviewDate: "2024-12-12",
    reviewNote: "Đồng ý điều chỉnh điểm",
  },
  {
    id: "GER003",
    studentId: "SV003",
    studentName: "Lê Văn D",
    class: "12A2",
    subject: "Hóa",
    subjectId: "HOA",
    semester: 1,
    academicYear: "2024-2025",
    currentScore: {
      type: "final",
      value: 5.0,
    },
    proposedScore: 5.5,
    reason: "Học sinh khiếu nại về đáp án câu 5",
    requestedBy: "GV003",
    requestedByName: "Lê Thị F",
    requestDate: "2024-12-05",
    status: "rejected",
    reviewedBy: "HT001",
    reviewedByName: "Phạm Thị E - Hiệu trưởng",
    reviewDate: "2024-12-09",
    reviewNote: "Sau khi xem xét lại bài thi, điểm chấm là chính xác",
  },
];
