// Leave Requests (Đơn xin nghỉ học)
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

// Grade Edit Requests (Yêu cầu sửa điểm)
export interface GradeEditRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  studentId: string;
  studentName: string;
  class: string;
  subject: string;
  scoreType: "oral" | "test15min" | "test45min" | "midterm" | "final";
  oldScore: number;
  newScore: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
}

export const mockGradeEditRequests: GradeEditRequest[] = [
  {
    id: "GE001",
    teacherId: "GV001",
    teacherName: "Phạm Văn D",
    studentId: "HS001",
    studentName: "Nguyễn Văn B",
    class: "10A1",
    subject: "Toán học",
    scoreType: "test15min",
    oldScore: 7.5,
    newScore: 8.0,
    reason: "Nhầm lẫn khi chấm bài, điểm đúng là 8.0",
    status: "pending",
    requestedAt: "2024-12-18T10:00:00",
  },
  {
    id: "GE002",
    teacherId: "GV002",
    teacherName: "Nguyễn Thị E",
    studentId: "HS002",
    studentName: "Trần Thị C",
    class: "10A1",
    subject: "Ngữ văn",
    scoreType: "test45min",
    oldScore: 6.0,
    newScore: 7.0,
    reason: "Chấm thiếu câu 3, cần bổ sung điểm",
    status: "approved",
    requestedAt: "2024-12-15T11:00:00",
    reviewedBy: "GV000",
    reviewedAt: "2024-12-15T15:00:00",
    reviewNote: "Đã xem lại bài làm, đồng ý sửa điểm",
  },
  {
    id: "GE003",
    teacherId: "GV003",
    teacherName: "Trần Văn F",
    studentId: "HS003",
    studentName: "Lê Văn D",
    class: "10A2",
    subject: "Vật lý",
    scoreType: "midterm",
    oldScore: 5.5,
    newScore: 6.0,
    reason: "Học sinh có khiếu nại, cần review lại",
    status: "rejected",
    requestedAt: "2024-12-10T09:00:00",
    reviewedBy: "GV000",
    reviewedAt: "2024-12-10T14:00:00",
    reviewNote: "Đã kiểm tra kỹ, điểm chấm là chính xác",
  },
];

// Transcript Requests (Yêu cầu bảng điểm)
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

// Helper functions for Leave Requests
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

// Helper functions for Grade Edit Requests
export function getGradeEditRequestsByTeacher(
  teacherId: string
): GradeEditRequest[] {
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
    request.reviewNote = note;
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
    request.reviewNote = note;
    return true;
  }
  return false;
}

// Helper functions for Transcript Requests
export function getTranscriptRequestsByStudent(
  studentId: string
): TranscriptRequest[] {
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
