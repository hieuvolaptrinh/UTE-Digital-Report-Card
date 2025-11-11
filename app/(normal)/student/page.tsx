"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { UserRole } from "@/components/layout/header";

// Mock user data - replace with actual authentication
const mockStudentUser = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@student.hcmute.edu.vn",
  avatar: "",
  role: "student" as UserRole,
};

export default function StudentPage() {
  const handleLogout = () => {
    console.log("Logout");
    // Implement logout logic here
  };

  return (
    <>
      <Header user={mockStudentUser} onLogout={handleLogout} />
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 sm:px-6 py-8"
        >
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-background to-background border border-border/40 p-8 md:p-12">
              <div className="relative z-10 space-y-4">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-3xl md:text-4xl font-bold text-foreground"
                >
                  Xin chào, {mockStudentUser.name.split(" ").pop()}! 👋
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-muted-foreground text-lg"
                >
                  Chào mừng bạn đến với hệ thống quản lý học bạ điện tử
                </motion.p>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Điểm trung bình", value: "8.5", icon: "📊" },
                { label: "Học kỳ hiện tại", value: "HK2", icon: "📅" },
                { label: "Số môn học", value: "12", icon: "📚" },
                { label: "Hạnh kiểm", value: "Tốt", icon: "⭐" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 4) }}
                  className="relative overflow-hidden rounded-xl bg-background/80 backdrop-blur-sm border border-border/40 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <div className="text-4xl opacity-50">{stat.icon}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Content Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="rounded-xl bg-background/80 backdrop-blur-sm border border-border/40 p-8 text-center"
            >
              <p className="text-muted-foreground">
                Nội dung trang học sinh sẽ được phát triển tiếp...
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
