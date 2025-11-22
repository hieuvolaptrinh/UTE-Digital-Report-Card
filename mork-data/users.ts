// Mock Users Database
export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  name: string;
  avatar?: string;
  role:
    | "student"
    | "teacher"
    | "principal"
    | "academic-officer"
    | "parent"
    | "admin";
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: "male" | "female";
}

// Extended User Types
export interface StudentUser extends User {
  role: "student";
  studentId: string;
  class: string;
  academicYear: string;
  parentIds: string[];
}

export interface TeacherUser extends User {
  role: "teacher" | "principal" | "academic-officer";
  teacherId: string;
  subject?: string;
  classes: string[];
  isHomeRoomTeacher?: boolean;
  homeRoomClass?: string;
}

export interface ParentUser extends User {
  role: "parent";
  parentId: string;
  children: {
    studentId: string;
    name: string;
    class: string;
  }[];
}

// Mock Users
export const mockUsers: (StudentUser | TeacherUser | ParentUser)[] = [
  // Students
  {
    id: "S001",
    username: "nguyenvana",
    password: "123456",
    email: "nguyenvana@student.ute.udn.vn",
    name: "Nguyễn Văn A",
    role: "student",
    studentId: "2024001",
    class: "10A1",
    academicYear: "2024-2025",
    phone: "0901234567",
    dateOfBirth: "2009-05-15",
    gender: "male",
    parentIds: ["P001"],
  },
  {
    id: "S008",
    username: "levancsss",
    password: "123456",
    email: "levancsss@student.ute.udn.vn",
    name: "Lê Văn C",
    role: "student",
    studentId: "2024003",
    class: "11A2",
    academicYear: "2024-2025",
    phone: "0901234569",
    dateOfBirth: "2008-03-10",
    gender: "male",
    parentIds: ["P001"],
  },
  {
    id: "S002",
    username: "tranthib",
    password: "123456",
    email: "tranthib@student.ute.udn.vn",
    name: "Trần Thị B",
    role: "student",
    studentId: "2024002",
    class: "10A1",
    academicYear: "2024-2025",
    phone: "0901234568",
    dateOfBirth: "2009-08-20",
    gender: "female",
    parentIds: ["P002"],
  },
  {
    id: "S003",
    username: "levanc",
    password: "123456",
    email: "levanc@student.ute.udn.vn",
    name: "Lê Văn C",
    role: "student",
    studentId: "2024003",
    class: "11A2",
    academicYear: "2024-2025",
    phone: "0901234569",
    dateOfBirth: "2008-03-10",
    gender: "male",
    parentIds: ["P003"],
  },

  // Teacher - Universal account with ALL classes and subjects
  {
    id: "T001",
    username: "teacher",
    password: "123456",
    email: "teacher@ute.udn.vn",
    name: "Nguyễn Văn Giáo Viên",
    role: "teacher",
    teacherId: "GV001",
    subject: "Tất cả môn học",
    classes: ["10A1", "10A2", "11A1", "11A2", "12A1", "12A2"],
    isHomeRoomTeacher: true,
    homeRoomClass: "10A1",
    phone: "0912345678",
    dateOfBirth: "1985-06-15",
    gender: "male",
  },

  // Academic Officer - Can manage all academic records
  {
    id: "AO001",
    username: "academic",
    password: "123456",
    email: "academic@ute.udn.vn",
    name: "Lê Thị Cán Bộ Học Vụ",
    role: "academic-officer",
    teacherId: "CBHV001",
    classes: ["10A1", "10A2", "11A1", "11A2", "12A1", "12A2"],
    phone: "0912345680",
    dateOfBirth: "1980-03-20",
    gender: "female",
    address: "TP. Hồ Chí Minh",
  },

  // Principal - Can see everything
  {
    id: "P000",
    username: "principal",
    password: "123456",
    email: "principal@ute.udn.vn",
    name: "Trần Minh Hiệu Trưởng",
    role: "principal",
    teacherId: "HT001",
    classes: ["10A1", "10A2", "11A1", "11A2", "12A1", "12A2"],
    phone: "0912345681",
    dateOfBirth: "1975-01-10",
    gender: "male",
    address: "TP. Hồ Chí Minh",
  },

  // Parents
  {
    id: "P001",
    username: "nguyenvanx",
    password: "123456",
    email: "nguyenvanx@parent.ute.udn.vn",
    name: "Nguyễn Văn X",
    role: "parent",
    parentId: "PH001",
    phone: "0923456789",
    children: [
      {
        studentId: "2024001",
        name: "Nguyễn Văn A",
        class: "10A1",
      },
    ],
  },
  {
    id: "P002",
    username: "tranthiy",
    password: "123456",
    email: "tranthiy@parent.ute.udn.vn",
    name: "Trần Thị Y",
    role: "parent",
    parentId: "PH002",
    phone: "0923456790",
    children: [
      {
        studentId: "2024002",
        name: "Trần Thị B",
        class: "10A1",
      },
    ],
  },
  {
    id: "P003",
    username: "levanz",
    password: "123456",
    email: "levanz@parent.ute.udn.vn",
    name: "Lê Văn Z",
    role: "parent",
    parentId: "PH003",
    phone: "0923456791",
    children: [
      {
        studentId: "2024003",
        name: "Lê Văn C",
        class: "11A2",
      },
      {
        studentId: "2024015",
        name: "Lê Thị D",
        class: "12A3",
      },
    ],
  },
];

// Login function
export function login(username: string, password: string) {
  const user = mockUsers.find(
    (u) => u.username === username && u.password === password
  );
  return user || null;
}

// Get user by ID
export function getUserById(id: string) {
  return mockUsers.find((u) => u.id === id) || null;
}

// Get students by class
export function getStudentsByClass(className: string) {
  return mockUsers.filter(
    (u) => u.role === "student" && (u as StudentUser).class === className
  ) as StudentUser[];
}

// Get teacher's classes
export function getTeacherClasses(teacherId: string) {
  const teacher = mockUsers.find((u) => u.id === teacherId) as TeacherUser;
  return teacher?.classes || [];
}
