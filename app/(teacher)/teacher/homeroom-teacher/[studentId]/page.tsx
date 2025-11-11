"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allMockStudents, type StudentDetail } from "@/mork-data";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  User,
  Phone,
  Mail,
  MapPin,
  Users,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export default function StudentDetailPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [conduct, setConduct] = useState<string>("");
  const [teacherNote, setTeacherNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isTeacher(user))) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const foundStudent = allMockStudents.find((s) => s.studentId === studentId);
    if (foundStudent) {
      setStudent(foundStudent);
      setConduct(foundStudent.conduct || "Trung bình");
      setTeacherNote(foundStudent.teacherNote || "");
    }
  }, [studentId]);

  const handleSave = async () => {
    setSaving(true);
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading || !user || !isTeacher(user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <>
        <Header
          user={{
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role as any,
          }}
          onLogout={logout}
        />
        <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50">
          <div className="container mx-auto px-4 py-6">
            <GlassCard padding="lg">
              <p className="text-center text-muted-foreground">
                Không tìm thấy thông tin học sinh
              </p>
            </GlassCard>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const conductColors = {
    Tốt: "bg-green-500/10 text-green-500 border-green-500/20",
    Khá: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Trung bình": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Yếu: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <>
      <Header
        user={{
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role as any,
        }}
        onLogout={logout}
      />
      <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50">
        <div className="container mx-auto px-4 py-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/teacher/homeroom-teacher">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại danh sách
              </Button>
            </Link>

            <div className="flex items-center gap-3 mb-8">
              <User className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Thông tin học sinh</h1>
                <p className="text-muted-foreground">
                  Chi tiết và quản lý hồ sơ học sinh
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Student Info */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GlassCard padding="lg">
                <div className="flex flex-col items-center text-center mb-6">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.studentId}`}
                    />
                    <AvatarFallback className="text-3xl">
                      {student.name.split(" ").slice(-1)[0].charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold mb-2">{student.name}</h2>
                  <Badge variant="secondary" className="mb-2">
                    {student.studentId}
                  </Badge>
                  <Badge variant="outline">{student.class}</Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày sinh</p>
                      <p className="font-medium">
                        {new Date(student.dateOfBirth).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium break-all">{student.email}</p>
                    </div>
                  </div>

                  {student.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Điện thoại
                        </p>
                        <p className="font-medium">{student.phone}</p>
                      </div>
                    </div>
                  )}

                  {student.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Địa chỉ</p>
                        <p className="font-medium">{student.address}</p>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Phụ huynh
                        </p>
                        <p className="font-medium">{student.parentName}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {student.parentPhone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Right Column - Conduct & Notes */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {/* Academic Info */}
              <GlassCard padding="lg">
                <h3 className="text-xl font-semibold mb-4">
                  Thông tin học tập
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Năm học
                    </p>
                    <p className="font-semibold text-lg">
                      {student.academicYear}
                    </p>
                  </div>
                  {student.averageGrade && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Điểm trung bình
                      </p>
                      <p className="font-semibold text-lg text-primary">
                        {student.averageGrade.toFixed(1)}
                      </p>
                    </div>
                  )}
                  {student.attendance && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Điểm danh
                      </p>
                      <p className="font-semibold text-lg">
                        {student.attendance.present}/{student.attendance.total}
                        <span className="text-sm text-muted-foreground ml-1">
                          buổi
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Conduct Assessment */}
              <GlassCard padding="lg">
                <h3 className="text-xl font-semibold mb-4">
                  Đánh giá hạnh kiểm
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="conduct">Xếp loại hạnh kiểm</Label>
                    <Select value={conduct} onValueChange={setConduct}>
                      <SelectTrigger id="conduct" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tốt">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                            Tốt
                          </div>
                        </SelectItem>
                        <SelectItem value="Khá">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500" />
                            Khá
                          </div>
                        </SelectItem>
                        <SelectItem value="Trung bình">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-orange-500" />
                            Trung bình
                          </div>
                        </SelectItem>
                        <SelectItem value="Yếu">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            Yếu
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Nhận xét của giáo viên</Label>
                    <Textarea
                      id="notes"
                      placeholder="Nhập nhận xét về học sinh..."
                      value={teacherNote}
                      onChange={(e) => setTeacherNote(e.target.value)}
                      rows={6}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleSave}
                      disabled={saving || saved}
                      className="flex-1"
                    >
                      {saving ? (
                        "Đang lưu..."
                      ) : saved ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Đã lưu
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Lưu thay đổi
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </GlassCard>

              {/* Attendance Details */}
              {student.attendance && (
                <GlassCard padding="lg">
                  <h3 className="text-xl font-semibold mb-4">
                    Chi tiết điểm danh
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Tổng số buổi
                      </p>
                      <p className="font-semibold text-2xl">
                        {student.attendance.total}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Có mặt
                      </p>
                      <p className="font-semibold text-2xl text-green-500">
                        {student.attendance.present}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Vắng</p>
                      <p className="font-semibold text-2xl text-red-500">
                        {student.attendance.absent}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Vắng có phép
                      </p>
                      <p className="font-semibold text-2xl text-orange-500">
                        {student.attendance.excused}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
