"use client";

import * as React from "react";
import { TeacherSidebar } from "@/components/layout/teacher/sidebar";
import type { TeacherUser } from "@/components/layout/teacher/sidebar";

// Mock teacher user - replace with actual authentication
const mockTeacherUser: TeacherUser = {
  name: "Nguyễn Văn B",
  email: "nguyenvanb@hcmute.edu.vn",
  avatar: "",
  role: "teacher",
  subject: "Toán học",
  classes: ["10A1", "11A2"],
};

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleLogout = () => {
    console.log("Teacher logout");
    // Implement logout logic here
  };

  return (
    <div className="flex min-h-screen">
      <TeacherSidebar user={mockTeacherUser} onLogout={handleLogout} />
      <main className="flex-1 lg:ml-[280px] pt-16 lg:pt-0">
        <div className="h-full bg-background">{children}</div>
      </main>
    </div>
  );
}
