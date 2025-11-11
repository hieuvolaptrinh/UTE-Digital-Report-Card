"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";
import { mockSchedule, mockGradeEditRequests, allMockStudents } from "@/mork-data";
import Link from "next/link";
import { 
  Calendar, 
  ClipboardList, 
  Users, 
  Bell, 
  BookOpen, 
  MessageSquare, 
  FileText, 
  TrendingUp,
  GraduationCap
} from "lucide-react";

export default function TeacherPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isTeacher(user))) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !isTeacher(user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const headerUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role as any,
  };

  const teacherSchedule = mockSchedule.filter(s => s.teacherId === user.teacherId);
  const pending = mockGradeEditRequests.filter(r => r.status === "pending").length;
  const homeRoomStudents = user.homeRoomClass 
    ? allMockStudents.filter(s => s.class === user.homeRoomClass).length 
    : 0;

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard Giáo viên</h1>
          <p className="text-muted-foreground mb-8">
            Xin chào, {user.name}!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Lớp giảng dạy"
              value={user.classes.length.toString()}
              icon={BookOpen}
              color="blue"
            />
            <StatCard
              label="HS lớp chủ nhiệm"
              value={homeRoomStudents.toString()}
              icon={GraduationCap}
              color="green"
            />
            <StatCard
              label="Tiết dạy/tuần"
              value={teacherSchedule.length.toString()}
              icon={Calendar}
              color="purple"
            />
            <StatCard
              label="YC chờ duyệt"
              value={pending.toString()}
              icon={Bell}
              color="orange"
            />
          </div>

          <h2 className="text-xl font-semibold mb-4">Truy cập nhanh</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {user.homeRoomClass && (
              <Link href="/teacher/homeroom-teacher">
                <GlassCard padding="md" className="hover:scale-105 transition-transform cursor-pointer h-full">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-green-500/10">
                      <Users className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Lớp chủ nhiệm</h3>
                      <p className="text-sm text-muted-foreground">{user.homeRoomClass}</p>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            )}

            <Link href="/teacher/class">
              <GlassCard padding="md" className="hover:scale-105 transition-transform cursor-pointer h-full">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <BookOpen className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Lớp giảng dạy</h3>
                    <p className="text-sm text-muted-foreground">Xem điểm</p>
                  </div>
                </div>
              </GlassCard>
            </Link>

            <Link href="/teacher/nhap-diem">
              <GlassCard padding="md" className="hover:scale-105 transition-transform cursor-pointer h-full">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-purple-500/10">
                    <ClipboardList className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Nhập điểm</h3>
                    <p className="text-sm text-muted-foreground">Quản lý điểm</p>
                  </div>
                </div>
              </GlassCard>
            </Link>

            <Link href="/teacher/hanh-kiem">
              <GlassCard padding="md" className="hover:scale-105 transition-transform cursor-pointer h-full">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-orange-500/10">
                    <FileText className="h-6 w-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Hạnh kiểm</h3>
                    <p className="text-sm text-muted-foreground">Đánh giá</p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </div>

          <GlassCard padding="lg">
            <h2 className="text-xl font-semibold mb-4">Thông tin</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Môn giảng dạy</h3>
                <Badge className="text-lg px-4 py-2">{user.subject || "N/A"}</Badge>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Lớp chủ nhiệm</h3>
                <Badge className="text-lg px-4 py-2">{user.homeRoomClass || "Không"}</Badge>
              </div>
            </div>
          </GlassCard>
        </div>
      </main>
      <Footer />
    </>
  );
}
