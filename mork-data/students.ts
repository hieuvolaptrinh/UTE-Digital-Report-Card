// Student Details with Academic Information
export interface StudentDetail {
  studentId: string;
  name: string;
  class: string;
  dateOfBirth: string;
  gender: "male" | "female";
  phone?: string;
  email: string;
  address?: string;
  parentName: string;
  parentPhone: string;
  conduct?: "Tốt" | "Khá" | "Trung bình" | "Yếu";
  teacherNote?: string;
  academicYear: string;
  averageGrade?: number;
  attendance?: {
    total: number;
    present: number;
    absent: number;
    excused: number;
  };
}

// Subject grades for a student
export interface StudentSubjectGrade {
  studentId: string;
  subjectId: string;
  subjectName: string;
  oral: number[];
  test15min: number[];
  test45min: number[];
  midterm: number | null;
  final: number | null;
  average?: number;
}

// Mock student details for class 12A1
export const mockStudentDetails: StudentDetail[] = [
  {
    studentId: "SV001",
    name: "Nguyễn Văn A",
    class: "12A1",
    dateOfBirth: "2007-05-15",
    gender: "male",
    phone: "0901234567",
    email: "nguyenvana@student.ute.udn.vn",
    address: "123 Nguyễn Văn Cừ, Quận 5, TP.HCM",
    parentName: "Nguyễn Văn X",
    parentPhone: "0987654321",
    conduct: "Tốt",
    teacherNote: "Học sinh chăm chỉ, tích cực tham gia các hoạt động lớp",
    academicYear: "2024-2025",
    averageGrade: 8.5,
    attendance: {
      total: 100,
      present: 95,
      absent: 5,
      excused: 3,
    },
  },
  {
    studentId: "SV002",
    name: "Trần Thị B",
    class: "12A1",
    dateOfBirth: "2007-08-20",
    gender: "female",
    phone: "0901234568",
    email: "tranthib@student.ute.udn.vn",
    address: "456 Lý Thường Kiệt, Quận 10, TP.HCM",
    parentName: "Trần Văn Y",
    parentPhone: "0987654322",
    conduct: "Tốt",
    teacherNote: "Học sinh giỏi, thường xuyên đạt điểm cao",
    academicYear: "2024-2025",
    averageGrade: 9.2,
    attendance: {
      total: 100,
      present: 98,
      absent: 2,
      excused: 2,
    },
  },
  {
    studentId: "SV003",
    name: "Lê Văn C",
    class: "12A1",
    dateOfBirth: "2007-03-10",
    gender: "male",
    phone: "0901234569",
    email: "levanc@student.ute.udn.vn",
    address: "789 Trần Hưng Đạo, Quận 1, TP.HCM",
    parentName: "Lê Văn Z",
    parentPhone: "0987654323",
    conduct: "Khá",
    teacherNote: "Cần cải thiện thái độ học tập, hay nói chuyện trong giờ",
    academicYear: "2024-2025",
    averageGrade: 7.8,
    attendance: {
      total: 100,
      present: 90,
      absent: 10,
      excused: 5,
    },
  },
  {
    studentId: "SV004",
    name: "Phạm Thị D",
    class: "12A1",
    dateOfBirth: "2007-11-25",
    gender: "female",
    phone: "0901234570",
    email: "phamthid@student.ute.udn.vn",
    address: "321 Võ Văn Tần, Quận 3, TP.HCM",
    parentName: "Phạm Văn W",
    parentPhone: "0987654324",
    conduct: "Tốt",
    teacherNote: "Học sinh ngoan, chăm học",
    academicYear: "2024-2025",
    averageGrade: 8.8,
    attendance: {
      total: 100,
      present: 97,
      absent: 3,
      excused: 3,
    },
  },
  {
    studentId: "SV005",
    name: "Hoàng Văn E",
    class: "12A1",
    dateOfBirth: "2007-01-30",
    gender: "male",
    phone: "0901234571",
    email: "hoangvane@student.ute.udn.vn",
    address: "654 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    parentName: "Hoàng Văn V",
    parentPhone: "0987654325",
    conduct: "Khá",
    teacherNote: "Có năng lực nhưng cần cố gắng hơn",
    academicYear: "2024-2025",
    averageGrade: 7.5,
    attendance: {
      total: 100,
      present: 88,
      absent: 12,
      excused: 7,
    },
  },
];

// Mock students for class 12A2
export const mockStudentDetails12A2: StudentDetail[] = [
  {
    studentId: "SV006",
    name: "Đỗ Thị F",
    class: "12A2",
    dateOfBirth: "2007-06-18",
    gender: "female",
    phone: "0901234572",
    email: "dothif@student.ute.udn.vn",
    address: "111 Cách Mạng Tháng 8, Quận 10, TP.HCM",
    parentName: "Đỗ Văn U",
    parentPhone: "0987654326",
    conduct: "Tốt",
    teacherNote: "Học sinh xuất sắc",
    academicYear: "2024-2025",
    averageGrade: 9.5,
    attendance: {
      total: 100,
      present: 99,
      absent: 1,
      excused: 1,
    },
  },
  {
    studentId: "SV007",
    name: "Vũ Văn G",
    class: "12A2",
    dateOfBirth: "2007-09-22",
    gender: "male",
    phone: "0901234573",
    email: "vuvang@student.ute.udn.vn",
    address: "222 Lạc Long Quân, Quận 11, TP.HCM",
    parentName: "Vũ Văn T",
    parentPhone: "0987654327",
    conduct: "Khá",
    teacherNote: "Cần tập trung hơn trong giờ học",
    academicYear: "2024-2025",
    averageGrade: 7.2,
    attendance: {
      total: 100,
      present: 85,
      absent: 15,
      excused: 8,
    },
  },
  {
    studentId: "SV008",
    name: "Bùi Thị H",
    class: "12A2",
    dateOfBirth: "2007-12-05",
    gender: "female",
    phone: "0901234574",
    email: "buithih@student.ute.udn.vn",
    address: "333 Hồng Bàng, Quận 6, TP.HCM",
    parentName: "Bùi Văn S",
    parentPhone: "0987654328",
    conduct: "Tốt",
    teacherNote: "Học sinh tích cực, nhiệt huyết",
    academicYear: "2024-2025",
    averageGrade: 8.9,
    attendance: {
      total: 100,
      present: 96,
      absent: 4,
      excused: 4,
    },
  },
];

// All students combined
export const allMockStudents = [
  ...mockStudentDetails,
  ...mockStudentDetails12A2,
];

// Helper function to get student details by class
export const getStudentDetailsByClass = (
  className: string
): StudentDetail[] => {
  return allMockStudents.filter((student) => student.class === className);
};

// Helper function to get student detail by ID
export const getStudentById = (
  studentId: string
): StudentDetail | undefined => {
  return allMockStudents.find((student) => student.studentId === studentId);
};

// Mock grades for students by class and subject
export const mockStudentGradesByClassSubject: Record<
  string,
  Record<string, StudentSubjectGrade[]>
> = {
  "10A1": {
    "Toán học": [
      {
        studentId: "2024001",
        subjectId: "TOAN",
        subjectName: "Toán học",
        oral: [8, 9, 7],
        test15min: [8.5, 9],
        test45min: [8, 9],
        midterm: 8.5,
        final: 9,
        average: 8.6,
      },
      {
        studentId: "2024002",
        subjectId: "TOAN",
        subjectName: "Toán học",
        oral: [9, 9.5, 9],
        test15min: [9, 9.5],
        test45min: [9, 9.5],
        midterm: 9.5,
        final: 9.5,
        average: 9.3,
      },
    ],
    "Văn học": [
      {
        studentId: "2024001",
        subjectId: "VAN",
        subjectName: "Văn học",
        oral: [7, 8, 7.5],
        test15min: [7, 8],
        test45min: [7.5, 8],
        midterm: 7.5,
        final: 8,
        average: 7.6,
      },
      {
        studentId: "2024002",
        subjectId: "VAN",
        subjectName: "Văn học",
        oral: [8, 8.5, 9],
        test15min: [8, 8.5],
        test45min: [8.5, 9],
        midterm: 8.5,
        final: 9,
        average: 8.6,
      },
    ],
  },
  "11A2": {
    "Toán học": [
      {
        studentId: "2024003",
        subjectId: "TOAN",
        subjectName: "Toán học",
        oral: [7, 7.5, 8],
        test15min: [7.5, 8],
        test45min: [7, 8],
        midterm: 7.5,
        final: 8,
        average: 7.6,
      },
    ],
    "Vật lý": [
      {
        studentId: "2024003",
        subjectId: "LY",
        subjectName: "Vật lý",
        oral: [8, 8.5, 9],
        test15min: [8, 8.5],
        test45min: [8.5, 9],
        midterm: 8.5,
        final: 9,
        average: 8.6,
      },
    ],
  },
};

// Helper to get grades for a class and subject
export const getGradesByClassAndSubject = (
  className: string,
  subject: string
): StudentSubjectGrade[] => {
  return mockStudentGradesByClassSubject[className]?.[subject] || [];
};
