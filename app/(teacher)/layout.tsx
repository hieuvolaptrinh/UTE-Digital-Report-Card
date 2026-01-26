"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { TeacherSidebar } from "@/components/layout/teacher/sidebar";
import type { TeacherUser } from "@/components/layout/teacher/sidebar";
import { useAuth, isTeacher } from "@/lib/auth";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && (!user || !isTeacher(user))) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Show loading state
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user is a teacher/principal/academic-officer
  if (!isTeacher(user)) {
    return null;
  }

  // Convert user to TeacherUser format
  const teacherUser: TeacherUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role as "teacher" | "principal" | "academic-officer",
    subject: user.subject,
    classes: user.classes,
  };

  // Header user format
  const headerUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role as "teacher" | "principal",
  };

  return (
    <>

      <div className="flex min-h-screen">
        <TeacherSidebar user={teacherUser} onLogout={handleLogout} />
        <main className="flex-1 lg:ml-[280px] pt-16 lg:pt-0">
          <div className="h-full bg-background">{children}</div>
        </main>
      </div>
    </>
  );
}
