export type ConductLevel = "Tốt" | "Khá" | "Trung bình" | "Yếu";

export const CONDUCT_LEVELS: ConductLevel[] = ["Tốt", "Khá", "Trung bình", "Yếu"];

export const CONDUCT_COLORS: Record<string, string> = {
  "Tốt": "bg-green-500/10 text-green-500 border-green-500/20",
  "Khá": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Trung bình": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "Yếu": "bg-red-500/10 text-red-500 border-red-500/20",
};

export interface Conduct {
  id: string;
  studentId: string;
  studentName?: string;
  term: string; 
  level: ConductLevel;
  comment: string;
  updatedAt: string;
  updatedBy?: string; 
}

export const mockConduct: Conduct[] = [
  {
    id: "CD001",
    studentId: "HS001",
    studentName: "Nguyễn Văn An",
    term: "Học kỳ I",
    level: "Tốt",
    comment: "Học sinh ngoan, lễ phép, tích cực tham gia các hoạt động của lớp.",
    updatedAt: "2024-01-15T08:30:00Z",
    updatedBy: "GV001"
  },
  {
    id: "CD002",
    studentId: "HS002",
    studentName: "Trần Thị Bích",
    term: "Học kỳ I",
    level: "Khá",
    comment: "Có ý thức học tập nhưng đôi khi còn mất trật tự trong giờ.",
    updatedAt: "2024-01-15T09:00:00Z",
    updatedBy: "GV001"
  },
  {
    id: "CD003",
    studentId: "HS003",
    studentName: "Lê Hoàng Cường",
    term: "Học kỳ I",
    level: "Trung bình",
    comment: "Thường xuyên đi học muộn, chưa hoàn thành bài tập về nhà.",
    updatedAt: "2024-01-16T10:15:00Z",
    updatedBy: "GV002"
  },
  {
    id: "CD004",
    studentId: "HS004",
    studentName: "Phạm Minh Duy",
    term: "Học kỳ I",
    level: "Tốt",
    comment: "Gương mẫu, giúp đỡ bạn bè, hoàn thành tốt nhiệm vụ lớp trưởng.",
    updatedAt: "2024-01-16T14:20:00Z",
    updatedBy: "GV001"
  }
];


export const submitConductAssessment = async (
  studentIds: string[],
  level: string,
  comment: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`[API Mock] Đã lưu đánh giá hạnh kiểm: ${level} - "${comment}" cho các ID:`, studentIds);
      resolve(true);
    }, 1000);
  });
};