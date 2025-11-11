// Schedule and Class Data
export interface Schedule {
  id: string;
  class: string;
  dayOfWeek: number; // 2-7 (Monday-Saturday)
  period: number; // 1-10
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  room: string;
  startTime: string;
  endTime: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  grade: number; // 10, 11, 12
  academicYear: string;
  homeRoomTeacherId: string;
  homeRoomTeacherName: string;
  studentCount: number;
  room: string;
}

// Mock Class Data
export const mockClasses: ClassInfo[] = [
  {
    id: "10A1",
    name: "10A1",
    grade: 10,
    academicYear: "2024-2025",
    homeRoomTeacherId: "GV001",
    homeRoomTeacherName: "Phạm Văn D",
    studentCount: 42,
    room: "A201",
  },
  {
    id: "10A2",
    name: "10A2",
    grade: 10,
    academicYear: "2024-2025",
    homeRoomTeacherId: "GV002",
    homeRoomTeacherName: "Nguyễn Thị E",
    studentCount: 40,
    room: "A202",
  },
  {
    id: "11A2",
    name: "11A2",
    grade: 11,
    academicYear: "2024-2025",
    homeRoomTeacherId: "GV003",
    homeRoomTeacherName: "Trần Văn F",
    studentCount: 38,
    room: "B105",
  },
  {
    id: "12A3",
    name: "12A3",
    grade: 12,
    academicYear: "2024-2025",
    homeRoomTeacherId: "GV006",
    homeRoomTeacherName: "Lê Thị I",
    studentCount: 40,
    room: "C301",
  },
];

// Time slots
export const timeSlots = [
  { period: 1, startTime: "07:00", endTime: "07:45" },
  { period: 2, startTime: "07:50", endTime: "08:35" },
  { period: 3, startTime: "08:40", endTime: "09:25" },
  { period: 4, startTime: "09:30", endTime: "10:15" },
  { period: 5, startTime: "10:20", endTime: "11:05" },
  { period: 6, startTime: "13:00", endTime: "13:45" },
  { period: 7, startTime: "13:50", endTime: "14:35" },
  { period: 8, startTime: "14:40", endTime: "15:25" },
  { period: 9, startTime: "15:30", endTime: "16:15" },
  { period: 10, startTime: "16:20", endTime: "17:05" },
];

// Mock Schedule Data for class 10A1
export const mockSchedule: Schedule[] = [
  // Monday
  {
    id: "s1",
    class: "10A1",
    dayOfWeek: 2,
    period: 1,
    subjectId: "TOAN",
    subjectName: "Toán học",
    teacherId: "GV001",
    teacherName: "Phạm Văn D",
    room: "A201",
    startTime: "07:00",
    endTime: "07:45",
  },
  {
    id: "s2",
    class: "10A1",
    dayOfWeek: 2,
    period: 2,
    subjectId: "TOAN",
    subjectName: "Toán học",
    teacherId: "GV001",
    teacherName: "Phạm Văn D",
    room: "A201",
    startTime: "07:50",
    endTime: "08:35",
  },
  {
    id: "s3",
    class: "10A1",
    dayOfWeek: 2,
    period: 3,
    subjectId: "VAN",
    subjectName: "Ngữ văn",
    teacherId: "GV002",
    teacherName: "Nguyễn Thị E",
    room: "A201",
    startTime: "08:40",
    endTime: "09:25",
  },
  {
    id: "s4",
    class: "10A1",
    dayOfWeek: 2,
    period: 4,
    subjectId: "ANH",
    subjectName: "Tiếng Anh",
    teacherId: "GV004",
    teacherName: "Lê Thị G",
    room: "A201",
    startTime: "09:30",
    endTime: "10:15",
  },
  {
    id: "s5",
    class: "10A1",
    dayOfWeek: 2,
    period: 5,
    subjectId: "TD",
    subjectName: "Thể dục",
    teacherId: "GV007",
    teacherName: "Nguyễn Văn K",
    room: "Sân TD",
    startTime: "10:20",
    endTime: "11:05",
  },

  // Tuesday
  {
    id: "s6",
    class: "10A1",
    dayOfWeek: 3,
    period: 1,
    subjectId: "LY",
    subjectName: "Vật lý",
    teacherId: "GV003",
    teacherName: "Trần Văn F",
    room: "A201",
    startTime: "07:00",
    endTime: "07:45",
  },
  {
    id: "s7",
    class: "10A1",
    dayOfWeek: 3,
    period: 2,
    subjectId: "HOA",
    subjectName: "Hóa học",
    teacherId: "GV005",
    teacherName: "Nguyễn Văn H",
    room: "A201",
    startTime: "07:50",
    endTime: "08:35",
  },
  {
    id: "s8",
    class: "10A1",
    dayOfWeek: 3,
    period: 3,
    subjectId: "SINH",
    subjectName: "Sinh học",
    teacherId: "GV008",
    teacherName: "Trần Thị L",
    room: "A201",
    startTime: "08:40",
    endTime: "09:25",
  },
  {
    id: "s9",
    class: "10A1",
    dayOfWeek: 3,
    period: 4,
    subjectId: "TOAN",
    subjectName: "Toán học",
    teacherId: "GV001",
    teacherName: "Phạm Văn D",
    room: "A201",
    startTime: "09:30",
    endTime: "10:15",
  },
  {
    id: "s10",
    class: "10A1",
    dayOfWeek: 3,
    period: 5,
    subjectId: "VAN",
    subjectName: "Ngữ văn",
    teacherId: "GV002",
    teacherName: "Nguyễn Thị E",
    room: "A201",
    startTime: "10:20",
    endTime: "11:05",
  },

  // Wednesday
  {
    id: "s11",
    class: "10A1",
    dayOfWeek: 4,
    period: 1,
    subjectId: "ANH",
    subjectName: "Tiếng Anh",
    teacherId: "GV004",
    teacherName: "Lê Thị G",
    room: "A201",
    startTime: "07:00",
    endTime: "07:45",
  },
  {
    id: "s12",
    class: "10A1",
    dayOfWeek: 4,
    period: 2,
    subjectId: "SU",
    subjectName: "Lịch sử",
    teacherId: "GV009",
    teacherName: "Phạm Văn M",
    room: "A201",
    startTime: "07:50",
    endTime: "08:35",
  },
  {
    id: "s13",
    class: "10A1",
    dayOfWeek: 4,
    period: 3,
    subjectId: "DIA",
    subjectName: "Địa lý",
    teacherId: "GV010",
    teacherName: "Lê Thị N",
    room: "A201",
    startTime: "08:40",
    endTime: "09:25",
  },
  {
    id: "s14",
    class: "10A1",
    dayOfWeek: 4,
    period: 4,
    subjectId: "TOAN",
    subjectName: "Toán học",
    teacherId: "GV001",
    teacherName: "Phạm Văn D",
    room: "A201",
    startTime: "09:30",
    endTime: "10:15",
  },
  {
    id: "s15",
    class: "10A1",
    dayOfWeek: 4,
    period: 5,
    subjectId: "LY",
    subjectName: "Vật lý",
    teacherId: "GV003",
    teacherName: "Trần Văn F",
    room: "A201",
    startTime: "10:20",
    endTime: "11:05",
  },

  // Thursday
  {
    id: "s16",
    class: "10A1",
    dayOfWeek: 5,
    period: 1,
    subjectId: "VAN",
    subjectName: "Ngữ văn",
    teacherId: "GV002",
    teacherName: "Nguyễn Thị E",
    room: "A201",
    startTime: "07:00",
    endTime: "07:45",
  },
  {
    id: "s17",
    class: "10A1",
    dayOfWeek: 5,
    period: 2,
    subjectId: "HOA",
    subjectName: "Hóa học",
    teacherId: "GV005",
    teacherName: "Nguyễn Văn H",
    room: "A201",
    startTime: "07:50",
    endTime: "08:35",
  },
  {
    id: "s18",
    class: "10A1",
    dayOfWeek: 5,
    period: 3,
    subjectId: "GDCD",
    subjectName: "GDCD",
    teacherId: "GV011",
    teacherName: "Nguyễn Thị O",
    room: "A201",
    startTime: "08:40",
    endTime: "09:25",
  },
  {
    id: "s19",
    class: "10A1",
    dayOfWeek: 5,
    period: 4,
    subjectId: "TIN",
    subjectName: "Tin học",
    teacherId: "GV012",
    teacherName: "Trần Văn P",
    room: "Lab TH1",
    startTime: "09:30",
    endTime: "10:15",
  },
  {
    id: "s20",
    class: "10A1",
    dayOfWeek: 5,
    period: 5,
    subjectId: "ANH",
    subjectName: "Tiếng Anh",
    teacherId: "GV004",
    teacherName: "Lê Thị G",
    room: "A201",
    startTime: "10:20",
    endTime: "11:05",
  },

  // Friday
  {
    id: "s21",
    class: "10A1",
    dayOfWeek: 6,
    period: 1,
    subjectId: "TOAN",
    subjectName: "Toán học",
    teacherId: "GV001",
    teacherName: "Phạm Văn D",
    room: "A201",
    startTime: "07:00",
    endTime: "07:45",
  },
  {
    id: "s22",
    class: "10A1",
    dayOfWeek: 6,
    period: 2,
    subjectId: "LY",
    subjectName: "Vật lý",
    teacherId: "GV003",
    teacherName: "Trần Văn F",
    room: "A201",
    startTime: "07:50",
    endTime: "08:35",
  },
  {
    id: "s23",
    class: "10A1",
    dayOfWeek: 6,
    period: 3,
    subjectId: "SINH",
    subjectName: "Sinh học",
    teacherId: "GV008",
    teacherName: "Trần Thị L",
    room: "A201",
    startTime: "08:40",
    endTime: "09:25",
  },
  {
    id: "s24",
    class: "10A1",
    dayOfWeek: 6,
    period: 4,
    subjectId: "CN",
    subjectName: "Công nghệ",
    teacherId: "GV013",
    teacherName: "Lê Văn Q",
    room: "A201",
    startTime: "09:30",
    endTime: "10:15",
  },
  {
    id: "s25",
    class: "10A1",
    dayOfWeek: 6,
    period: 5,
    subjectId: "VAN",
    subjectName: "Ngữ văn",
    teacherId: "GV002",
    teacherName: "Nguyễn Thị E",
    room: "A201",
    startTime: "10:20",
    endTime: "11:05",
  },

  // Saturday
  {
    id: "s26",
    class: "10A1",
    dayOfWeek: 7,
    period: 1,
    subjectId: "ANH",
    subjectName: "Tiếng Anh",
    teacherId: "GV004",
    teacherName: "Lê Thị G",
    room: "A201",
    startTime: "07:00",
    endTime: "07:45",
  },
  {
    id: "s27",
    class: "10A1",
    dayOfWeek: 7,
    period: 2,
    subjectId: "HOA",
    subjectName: "Hóa học",
    teacherId: "GV005",
    teacherName: "Nguyễn Văn H",
    room: "A201",
    startTime: "07:50",
    endTime: "08:35",
  },
  {
    id: "s28",
    class: "10A1",
    dayOfWeek: 7,
    period: 3,
    subjectId: "TD",
    subjectName: "Thể dục",
    teacherId: "GV007",
    teacherName: "Nguyễn Văn K",
    room: "Sân TD",
    startTime: "08:40",
    endTime: "09:25",
  },
];

// Helper functions
export function getScheduleByClass(className: string, dayOfWeek?: number) {
  return mockSchedule.filter(
    (s) => s.class === className && (!dayOfWeek || s.dayOfWeek === dayOfWeek)
  );
}

export function getScheduleByTeacher(teacherId: string, dayOfWeek?: number) {
  return mockSchedule.filter(
    (s) =>
      s.teacherId === teacherId && (!dayOfWeek || s.dayOfWeek === dayOfWeek)
  );
}

export function getTodaySchedule(className: string) {
  const today = new Date().getDay(); // 0-6 (Sunday-Saturday)
  const dayOfWeek = today === 0 ? 7 : today + 1; // Convert to 2-7
  return getScheduleByClass(className, dayOfWeek);
}

export const dayNames = [
  "Chủ nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];
