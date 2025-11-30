// mork-data/requests.ts

// ==========================================
// 1. LEAVE REQUESTS (Đơn xin nghỉ học) - GIỮ NGUYÊN
// ==========================================
export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  parentId: string;
  parentName: string;
  reason: string;
  fromDate: string;
  toDate: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "LR001",
    studentId: "HS001",
    studentName: "Nguyễn Văn B",
    class: "10A1",
    parentId: "P001",
    parentName: "Lê Thị X",
    reason: "Em bị ốm, cần nghỉ học để điều trị",
    fromDate: "2024-12-18",
    toDate: "2024-12-18",
    status: "approved",
    requestedAt: "2024-12-17T06:30:00",
    reviewedBy: "GV001",
    reviewedAt: "2024-12-17T08:00:00",
    reviewNote: "Đồng ý cho nghỉ. Nhớ bù bài tập khi trở lại.",
  },
  {
    id: "LR002",
    studentId: "HS002",
    studentName: "Trần Thị C",
    class: "10A1",
    parentId: "P002",
    parentName: "Nguyễn Văn Y",
    reason: "Gia đình có việc đột xuất, cần xin nghỉ 2 ngày",
    fromDate: "2024-12-20",
    toDate: "2024-12-21",
    status: "pending",
    requestedAt: "2024-12-18T14:20:00",
  },
  {
    id: "LR003",
    studentId: "HS004",
    studentName: "Võ Thị D",
    class: "11A2",
    parentId: "P003",
    parentName: "Phạm Thị Z",
    reason: "Tham gia cuộc thi Olympic Toán cấp tỉnh",
    fromDate: "2024-12-22",
    toDate: "2024-12-23",
    status: "approved",
    requestedAt: "2024-12-15T09:00:00",
    reviewedBy: "GV003",
    reviewedAt: "2024-12-15T10:30:00",
    reviewNote: "Đồng ý. Chúc em đạt giải cao!",
  },
];

// ==========================================
// 2. GRADE EDIT REQUESTS (Yêu cầu sửa điểm) - ĐÃ CẬP NHẬT
// ==========================================
export interface GradeEditRequest {
  id: string;
  studentId: string;
  studentName?: string;
  class?: string;
  
  // Thông tin môn học & Giáo viên
  subjectId: string;       // <-- QUAN TRỌNG: Để lọc theo môn
  subjectName: string;
  teacherId?: string;      // Để lọc theo GV
  teacherName?: string;

  // Thông tin điểm
  scoreType: string;       // VD: 'midterm'
  scoreTypeLabel: string;  // VD: "Điểm giữa kỳ"
  currentScore: number | string; // Điểm cũ
  desiredScore: number;          // Điểm mới

  // Chi tiết yêu cầu
  reason: string;
  evidence?: string;
  status: "pending" | "approved" | "rejected";
  
  // Phản hồi
  teacherResponse?: string; 
  reviewedBy?: string;
  reviewedAt?: string;

  // Thời gian
  createdAt: string;
}

export const mockGradeEditRequests: GradeEditRequest[] = [
  {
    id: "REQ001",
    studentId: "2024001",
    studentName: "Nguyễn Văn A",
    class: "10A1",
    subjectId: "TOAN",
    subjectName: "Toán học",
    teacherId: "GV001",
    scoreType: "midterm",
    scoreTypeLabel: "Điểm giữa kỳ",
    currentScore: 8.5,
    desiredScore: 9.0,
    reason: "Em nghĩ thầy nhập nhầm điểm câu 4 ạ.",
    status: "pending",
    createdAt: "2024-11-20T10:30:00Z",
  },
  {
    id: "REQ002",
    studentId: "2024001",
    studentName: "Nguyễn Văn A",
    subjectId: "TOAN",
    subjectName: "Toán học",
    teacherId: "GV001",
    scoreType: "oral",
    scoreTypeLabel: "Điểm miệng",
    currentScore: 7,
    desiredScore: 8,
    reason: "Em xung phong lên bảng ngày 15/10 nhưng chưa thấy điểm.",
    status: "rejected",
    teacherResponse: "Ngày đó em trả lời chưa trọn vẹn câu hỏi phụ.",
    reviewedBy: "GV001",
    createdAt: "2024-10-16T14:00:00Z",
  },
  {
    id: "REQ003",
    studentId: "2024001",
    subjectId: "VAN",
    subjectName: "Ngữ văn",
    teacherId: "GV002",
    scoreType: "15min",
    scoreTypeLabel: "Điểm 15 phút",
    currentScore: 6.5,
    desiredScore: 7.0,
    reason: "Phúc khảo bài kiểm tra số 2.",
    status: "approved",
    teacherResponse: "Đã kiểm tra lại, cộng thiếu 0.5đ phần trắc nghiệm.",
    reviewedBy: "GV002",
    createdAt: "2024-11-05T09:15:00Z",
  },
];

// ==========================================
// 3. TRANSCRIPT REQUESTS (Yêu cầu bảng điểm) - GIỮ NGUYÊN
// ==========================================
export interface TranscriptRequest {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  requestType: "semester" | "year" | "all";
  semester?: 1 | 2;
  academicYear?: string;
  purpose: string;
  status: "pending" | "processing" | "completed" | "rejected";
  requestedAt: string;
  completedAt?: string;
  downloadUrl?: string;
}

export const mockTranscriptRequests: TranscriptRequest[] = [
  {
    id: "TR001",
    studentId: "HS001",
    studentName: "Nguyễn Văn B",
    class: "10A1",
    requestType: "semester",
    semester: 1,
    academicYear: "2024-2025",
    purpose: "Xin học bổng",
    status: "completed",
    requestedAt: "2024-12-10T08:00:00",
    completedAt: "2024-12-11T10:00:00",
    downloadUrl: "/transcripts/HS001_HK1_2024-2025.pdf",
  },
  {
    id: "TR002",
    studentId: "HS002",
    studentName: "Trần Thị C",
    class: "10A1",
    requestType: "year",
    academicYear: "2023-2024",
    purpose: "Nộp hồ sơ du học",
    status: "processing",
    requestedAt: "2024-12-18T09:30:00",
  },
  {
    id: "TR003",
    studentId: "HS004",
    studentName: "Võ Thị D",
    class: "11A2",
    requestType: "all",
    purpose: "Chuyển trường",
    status: "pending",
    requestedAt: "2024-12-18T14:00:00",
  },
];

// ==========================================
// 4. HELPER FUNCTIONS
// ==========================================

// --- Leave Requests Helpers ---
export function getLeaveRequestsByStudent(studentId: string): LeaveRequest[] {
  return mockLeaveRequests.filter((req) => req.studentId === studentId);
}

export function getLeaveRequestsByClass(className: string): LeaveRequest[] {
  return mockLeaveRequests.filter((req) => req.class === className);
}

export function getPendingLeaveRequests(): LeaveRequest[] {
  return mockLeaveRequests.filter((req) => req.status === "pending");
}

export function approveLeaveRequest(
  requestId: string,
  reviewerId: string,
  note?: string
): boolean {
  const request = mockLeaveRequests.find((req) => req.id === requestId);
  if (request && request.status === "pending") {
    request.status = "approved";
    request.reviewedBy = reviewerId;
    request.reviewedAt = new Date().toISOString();
    request.reviewNote = note;
    return true;
  }
  return false;
}

export function rejectLeaveRequest(
  requestId: string,
  reviewerId: string,
  note: string
): boolean {
  const request = mockLeaveRequests.find((req) => req.id === requestId);
  if (request && request.status === "pending") {
    request.status = "rejected";
    request.reviewedBy = reviewerId;
    request.reviewedAt = new Date().toISOString();
    request.reviewNote = note;
    return true;
  }
  return false;
}

// --- Grade Edit Requests Helpers (ĐÃ CẬP NHẬT THEO INTERFACE MỚI) ---
export function getGradeEditRequestsByTeacher(teacherId: string): GradeEditRequest[] {
  return mockGradeEditRequests.filter((req) => req.teacherId === teacherId);
}

export function getPendingGradeEditRequests(): GradeEditRequest[] {
  return mockGradeEditRequests.filter((req) => req.status === "pending");
}

export function approveGradeEditRequest(
  requestId: string,
  reviewerId: string,
  note?: string
): boolean {
  const request = mockGradeEditRequests.find((req) => req.id === requestId);
  if (request && request.status === "pending") {
    request.status = "approved";
    request.reviewedBy = reviewerId;
    request.reviewedAt = new Date().toISOString();
    request.teacherResponse = note; // Cập nhật: reviewNote -> teacherResponse
    return true;
  }
  return false;
}

export function rejectGradeEditRequest(
  requestId: string,
  reviewerId: string,
  note: string
): boolean {
  const request = mockGradeEditRequests.find((req) => req.id === requestId);
  if (request && request.status === "pending") {
    request.status = "rejected";
    request.reviewedBy = reviewerId;
    request.reviewedAt = new Date().toISOString();
    request.teacherResponse = note; // Cập nhật: reviewNote -> teacherResponse
    return true;
  }
  return false;
}

// --- Transcript Requests Helpers ---
export function getTranscriptRequestsByStudent(studentId: string): TranscriptRequest[] {
  return mockTranscriptRequests.filter((req) => req.studentId === studentId);
}

export function createTranscriptRequest(
  request: Omit<TranscriptRequest, "id" | "status" | "requestedAt">
): TranscriptRequest {
  const newRequest: TranscriptRequest = {
    ...request,
    id: `TR${String(mockTranscriptRequests.length + 1).padStart(3, "0")}`,
    status: "pending",
    requestedAt: new Date().toISOString(),
  };
  mockTranscriptRequests.push(newRequest);
  return newRequest;
}