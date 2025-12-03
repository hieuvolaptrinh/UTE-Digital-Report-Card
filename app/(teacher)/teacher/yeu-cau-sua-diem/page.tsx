"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";

// Import component danh sách từ Bước 1
import { GradeEditRequestsList } from "@/components/section/teacher/grade-edit-requests-list";

export default function GradeEditRequestsPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !isTeacher(user))) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !isTeacher(user)) return null;

  const headerUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role as any,
  };

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-20">
        <div className="container mx-auto px-4 py-8">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center gap-3"
          >
            <div className="p-3 rounded-xl bg-[#F43F5E]/10 text-[#F43F5E] shadow-sm">
                <Bell className="h-6 w-6" />
            </div>
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Yêu cầu sửa điểm
                </h1>
                <p className="text-muted-foreground mt-1">
                  Danh sách yêu cầu sửa điểm đã gửi từ học sinh
                </p>
            </div>
          </motion.div>

          {/* Component Danh sách nằm ở đây */}
          <GradeEditRequestsList />
          
        </div>
      </main>
      <Footer />
    </>
  );
}