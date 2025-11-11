// School Information
export interface SchoolInfo {
  name: string;
  fullName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  founded: number;
  motto: string;
  description: string;
  principal: {
    name: string;
    title: string;
    avatar: string;
    message: string;
  };
  achievements: Achievement[];
  gallery: GalleryImage[];
  stats: SchoolStats;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  year: number;
  icon: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
}

export interface SchoolStats {
  students: number;
  teachers: number;
  classes: number;
  years: number;
}

export const schoolInfo: SchoolInfo = {
  name: "UTE",
  fullName: "Trường Đại học Sư phạm Kỹ thuật TP. Hồ Chí Minh",
  address: "01 Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh",
  phone: "(028) 3897 2092",
  email: "dhspkt@hcmute.edu.vn",
  website: "https://www.hcmute.edu.vn",
  founded: 1962,
  motto: "Đào tạo - Nghiên cứu - Ứng dụng",
  description:
    "Trường Đại học Sư phạm Kỹ thuật TP.HCM là cơ sở đào tạo giáo viên kỹ thuật, công nghệ hàng đầu Việt Nam. Với hơn 60 năm xây dựng và phát triển, nhà trường đã đào tạo hàng vạn cử nhân, kỹ sư, thạc sĩ, tiến sĩ trong các lĩnh vực kỹ thuật và công nghệ.",
  principal: {
    name: "PGS.TS. Trần Minh Phương",
    title: "Hiệu trưởng",
    avatar: "/images/principal.jpg",
    message:
      "Chào mừng quý phụ huynh và các em học sinh đến với hệ thống quản lý học bạ điện tử của trường. Chúng tôi cam kết mang đến nền giáo dục chất lượng cao và môi trường học tập an toàn, thân thiện cho mọi học sinh.",
  },
  achievements: [
    {
      id: "a1",
      title: "Top 10 trường đại học kỹ thuật hàng đầu",
      description:
        "Được xếp hạng trong top 10 trường đại học kỹ thuật uy tín nhất Việt Nam",
      year: 2024,
      icon: "🏆",
    },
    {
      id: "a2",
      title: "Chứng nhận chất lượng giáo dục quốc tế",
      description: "Được công nhận bởi các tổ chức giáo dục quốc tế",
      year: 2023,
      icon: "🎓",
    },
    {
      id: "a3",
      title: "100% sinh viên có việc làm sau tốt nghiệp",
      description: "Tỷ lệ sinh viên có việc làm đúng ngành đạt 95%",
      year: 2024,
      icon: "💼",
    },
    {
      id: "a4",
      title: "Hợp tác với 50+ doanh nghiệp lớn",
      description: "Liên kết đào tạo và thực tập với các tập đoàn hàng đầu",
      year: 2024,
      icon: "🤝",
    },
  ],
  gallery: [
    {
      id: "g1",
      url: "/images/campus-1.jpg",
      title: "Khuôn viên trường",
      description: "Khuôn viên xanh, sạch, đẹp với cơ sở vật chất hiện đại",
    },
    {
      id: "g2",
      url: "/images/library.jpg",
      title: "Thư viện",
      description: "Thư viện với hơn 100,000 đầu sách và tài liệu điện tử",
    },
    {
      id: "g3",
      url: "/images/lab.jpg",
      title: "Phòng thí nghiệm",
      description: "Phòng thí nghiệm được trang bị thiết bị hiện đại",
    },
    {
      id: "g4",
      url: "/images/sports.jpg",
      title: "Sân thể thao",
      description: "Khu thể thao đa năng phục vụ hoạt động ngoại khóa",
    },
  ],
  stats: {
    students: 15000,
    teachers: 450,
    classes: 320,
    years: 62,
  },
};

// Featured Teachers
export interface FeaturedTeacher {
  id: string;
  name: string;
  title: string;
  subject: string;
  avatar: string;
  description: string;
  achievements: string[];
}

export const featuredTeachers: FeaturedTeacher[] = [
  {
    id: "ft1",
    name: "PGS.TS. Nguyễn Văn An",
    title: "Phó Hiệu trưởng",
    subject: "Công nghệ thông tin",
    avatar: "/images/teacher-1.jpg",
    description: "Chuyên gia hàng đầu về trí tuệ nhân tạo và machine learning",
    achievements: [
      "15+ năm kinh nghiệm giảng dạy",
      "100+ bài báo khoa học quốc tế",
      "Giáo viên giỏi cấp quốc gia 2023",
    ],
  },
  {
    id: "ft2",
    name: "TS. Trần Thị Bình",
    title: "Trưởng khoa Điện - Điện tử",
    subject: "Kỹ thuật điện tử",
    avatar: "/images/teacher-2.jpg",
    description: "Chuyên gia về hệ thống nhúng và IoT",
    achievements: [
      "12+ năm kinh nghiệm",
      "50+ dự án nghiên cứu",
      "Nhà khoa học trẻ tiêu biểu 2022",
    ],
  },
  {
    id: "ft3",
    name: "ThS. Lê Văn Cường",
    title: "Giảng viên cao cấp",
    subject: "Cơ khí chế tạo máy",
    avatar: "/images/teacher-3.jpg",
    description: "Chuyên gia về công nghệ CAD/CAM và sản xuất tự động",
    achievements: [
      "10+ năm kinh nghiệm",
      "30+ sáng chế và giải pháp hữu ích",
      "Giảng viên xuất sắc 2023",
    ],
  },
  {
    id: "ft4",
    name: "TS. Phạm Thị Dung",
    title: "Giảng viên",
    subject: "Quản trị kinh doanh",
    avatar: "/images/teacher-4.jpg",
    description: "Chuyên gia tư vấn doanh nghiệp và khởi nghiệp",
    achievements: [
      "8+ năm kinh nghiệm",
      "20+ dự án tư vấn doanh nghiệp",
      "Giảng viên trẻ xuất sắc 2024",
    ],
  },
];
