"use client";

import { useAuth, isStudent } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GradesOverview } from "@/components/section/student/grades-overview";
import { GradesTable } from "@/components/section/student/grades-table";
import { GlassCard } from "@/components/ui/glass-card";
import { mockGrades } from "@/mork-data";
import { Calendar, FileText, BookOpen, Clock } from "lucide-react";
import Link from "next/link";

export default function StudentPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [studentGrades, setStudentGrades] = useState(mockGrades);

  useEffect(() => {
    if (!isLoading && (!user || !isStudent(user))) {
      router.push("/login");
    }

    if (user && isStudent(user)) {
      const grades = mockGrades.filter((g) => g.studentId === user.studentId);
      setStudentGrades(grades);
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !isStudent(user)) {
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
    role: user.role as "student",
  };

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-6">
          <GradesOverview grades={studentGrades} />
          <GradesTable grades={studentGrades} />
        </div>
      </main>
      <Footer />
    </>
  );
}
