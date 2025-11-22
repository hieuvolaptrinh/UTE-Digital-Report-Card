"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Save,
  Check,
  School,
} from "lucide-react";

export default function StudentDetailPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const [saved, setSaved] = useState(false);
  const [studentData, setStudentData] = useState({
    studentId: "2024001",
    name: "Nguyễn Văn A",
    class: "10A1",
    dateOfBirth: "2009-05-15",
    gender: "male" as "male" | "female",
    phone: "0901234567",
    email: "nguyenvana@student.ute.udn.vn",
    address: "123 Nguyễn Văn Cừ, Quận 5, TP.HCM",
    parentName: "Nguyễn Văn X",
    parentPhone: "0987654321",
    conduct: "Tốt" as "Tốt" | "Khá" | "Trung bình" | "Yếu",
    academicYear: "2024-2025",
  });

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "academic-officer")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleSave = () => {
    // TODO: Save student data
    console.log("Saving student data:", studentData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading || !user || user.role !== "academic-officer") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Header
        user={{
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: "academic-officer",
        }}
        onLogout={logout}
      />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-6">
              <Link href="/academic-officer/list-lop">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
                </Button>
              </Link>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-green-600 dark:text-green-400"
                >
                  <Check className="h-5 w-5" />
                  <span className="font-medium">Đã lưu</span>
                </motion.div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${studentData.studentId}`}
                />
                <AvatarFallback className="text-3xl">
                  {studentData.name.split(" ").slice(-1)[0].charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{studentData.name}</h1>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="text-base">
                    <School className="h-3 w-3 mr-1" />
                    {studentData.class}
                  </Badge>
                  <Badge variant="outline" className="text-base">
                    {studentData.studentId}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-base ${
                      studentData.conduct === "Tốt"
                        ? "bg-green-500/10 text-green-600"
                        : studentData.conduct === "Khá"
                        ? "bg-blue-500/10 text-blue-600"
                        : "bg-orange-500/10 text-orange-600"
                    }`}
                  >
                    Hạnh kiểm: {studentData.conduct}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard padding="lg">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin cá nhân
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Họ và tên */}
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    value={studentData.name}
                    onChange={(e) =>
                      setStudentData({ ...studentData, name: e.target.value })
                    }
                    className="bg-white/50 dark:bg-gray-800/50"
                  />
                </div>

                {/* Mã học sinh */}
                <div className="space-y-2">
                  <Label htmlFor="studentId">Mã học sinh</Label>
                  <Input
                    id="studentId"
                    value={studentData.studentId}
                    onChange={(e) =>
                      setStudentData({
                        ...studentData,
                        studentId: e.target.value,
                      })
                    }
                    className="bg-white/50 dark:bg-gray-800/50"
                  />
                </div>

                {/* Lớp */}
                <div className="space-y-2">
                  <Label htmlFor="class">Lớp</Label>
                  <Select
                    value={studentData.class}
                    onValueChange={(value) =>
                      setStudentData({ ...studentData, class: value })
                    }
                  >
                    <SelectTrigger className="bg-white/50 dark:bg-gray-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10A1">10A1</SelectItem>
                      <SelectItem value="10A2">10A2</SelectItem>
                      <SelectItem value="11A1">11A1</SelectItem>
                      <SelectItem value="11A2">11A2</SelectItem>
                      <SelectItem value="12A1">12A1</SelectItem>
                      <SelectItem value="12A2">12A2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ngày sinh */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={studentData.dateOfBirth}
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          dateOfBirth: e.target.value,
                        })
                      }
                      className="bg-white/50 dark:bg-gray-800/50 pl-10"
                    />
                  </div>
                </div>

                {/* Giới tính */}
                <div className="space-y-2">
                  <Label htmlFor="gender">Giới tính</Label>
                  <Select
                    value={studentData.gender}
                    onValueChange={(value: "male" | "female") =>
                      setStudentData({ ...studentData, gender: value })
                    }
                  >
                    <SelectTrigger className="bg-white/50 dark:bg-gray-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Năm học */}
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Năm học</Label>
                  <Input
                    id="academicYear"
                    value={studentData.academicYear}
                    onChange={(e) =>
                      setStudentData({
                        ...studentData,
                        academicYear: e.target.value,
                      })
                    }
                    className="bg-white/50 dark:bg-gray-800/50"
                  />
                </div>

                {/* Số điện thoại */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={studentData.phone}
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          phone: e.target.value,
                        })
                      }
                      className="bg-white/50 dark:bg-gray-800/50 pl-10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={studentData.email}
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          email: e.target.value,
                        })
                      }
                      className="bg-white/50 dark:bg-gray-800/50 pl-10"
                    />
                  </div>
                </div>

                {/* Địa chỉ */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Địa chỉ</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={studentData.address}
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          address: e.target.value,
                        })
                      }
                      className="bg-white/50 dark:bg-gray-800/50 pl-10"
                    />
                  </div>
                </div>

                {/* Hạnh kiểm */}
                <div className="space-y-2">
                  <Label htmlFor="conduct">Hạnh kiểm</Label>
                  <Select
                    value={studentData.conduct}
                    onValueChange={(
                      value: "Tốt" | "Khá" | "Trung bình" | "Yếu"
                    ) => setStudentData({ ...studentData, conduct: value })}
                  >
                    <SelectTrigger className="bg-white/50 dark:bg-gray-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tốt">Tốt</SelectItem>
                      <SelectItem value="Khá">Khá</SelectItem>
                      <SelectItem value="Trung bình">Trung bình</SelectItem>
                      <SelectItem value="Yếu">Yếu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">
                  Thông tin phụ huynh
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tên phụ huynh */}
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Họ và tên phụ huynh</Label>
                    <Input
                      id="parentName"
                      value={studentData.parentName}
                      onChange={(e) =>
                        setStudentData({
                          ...studentData,
                          parentName: e.target.value,
                        })
                      }
                      className="bg-white/50 dark:bg-gray-800/50"
                    />
                  </div>

                  {/* Số điện thoại phụ huynh */}
                  <div className="space-y-2">
                    <Label htmlFor="parentPhone">Số điện thoại phụ huynh</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="parentPhone"
                        value={studentData.parentPhone}
                        onChange={(e) =>
                          setStudentData({
                            ...studentData,
                            parentPhone: e.target.value,
                          })
                        }
                        className="bg-white/50 dark:bg-gray-800/50 pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Link href="/academic-officer/list-lop">
                  <Button variant="outline">Hủy</Button>
                </Link>
                <Button onClick={handleSave} size="lg">
                  <Save className="h-4 w-4 mr-2" />
                  Lưu thông tin
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
