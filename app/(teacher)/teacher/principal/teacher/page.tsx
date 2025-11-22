"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserCog,
  Search,
  Plus,
  Mail,
  Phone,
  BookOpen,
  Users,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  classes: string[];
  isHomeRoomTeacher: boolean;
  homeRoomClass?: string;
  status: "active" | "inactive";
}

const mockTeachers: Teacher[] = [
  {
    id: "GV001",
    name: "Phạm Văn D",
    email: "phamvand@ute.udn.vn",
    phone: "0912345678",
    subject: "Toán học",
    classes: ["10A1", "11A2"],
    isHomeRoomTeacher: true,
    homeRoomClass: "10A1",
    status: "active",
  },
  {
    id: "GV002",
    name: "Nguyễn Thị E",
    email: "nguyenthie@ute.udn.vn",
    phone: "0912345679",
    subject: "Văn học",
    classes: ["10A1", "10A2"],
    isHomeRoomTeacher: false,
    status: "active",
  },
  {
    id: "GV003",
    name: "Trần Văn F",
    email: "tranvanf@ute.udn.vn",
    phone: "0912345680",
    subject: "Vật lý",
    classes: ["11A2"],
    isHomeRoomTeacher: true,
    homeRoomClass: "11A2",
    status: "active",
  },
  {
    id: "GV004",
    name: "Lê Thị G",
    email: "lethig@ute.udn.vn",
    phone: "0912345681",
    subject: "Tiếng Anh",
    classes: ["10A1", "10A2", "11A2"],
    isHomeRoomTeacher: false,
    status: "active",
  },
  {
    id: "GV005",
    name: "Nguyễn Văn H",
    email: "nguyenvanh@ute.udn.vn",
    phone: "0912345682",
    subject: "Hóa học",
    classes: ["12A1", "12A2"],
    isHomeRoomTeacher: true,
    homeRoomClass: "12A1",
    status: "active",
  },
];

export default function TeacherManagementPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (teacherId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa giáo viên này?")) {
      setTeachers(teachers.filter((t) => t.id !== teacherId));
    }
  };

  return (
    <>
      <Header
        user={{
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role as "teacher" | "academic-officer" | "principal",
        }}
        onLogout={logout}
      />
      <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <UserCog className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Quản lý giáo viên</h1>
                  <p className="text-muted-foreground">
                    Quản lý {teachers.length} giáo viên
                  </p>
                </div>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Thêm giáo viên
              </Button>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email, môn học, mã GV..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Teachers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTeachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <GlassCard hover padding="lg">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.id}`}
                      />
                      <AvatarFallback>
                        {teacher.name.split(" ").slice(-1)[0].charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {teacher.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{teacher.id}</Badge>
                            <Badge
                              variant={
                                teacher.status === "active"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {teacher.status === "active"
                                ? "Đang hoạt động"
                                : "Tạm nghỉ"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                            onClick={() => handleDelete(teacher.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{teacher.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{teacher.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>Môn: {teacher.subject}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <div className="flex flex-wrap gap-1">
                            <span>Lớp:</span>
                            {teacher.classes.map((cls) => (
                              <Badge
                                key={cls}
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  cls === teacher.homeRoomClass &&
                                    "bg-primary/10 border-primary text-primary"
                                )}
                              >
                                {cls}
                                {cls === teacher.homeRoomClass && " (CN)"}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {filteredTeachers.length === 0 && (
            <GlassCard padding="lg">
              <p className="text-center text-muted-foreground">
                Không tìm thấy giáo viên nào phù hợp
              </p>
            </GlassCard>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
