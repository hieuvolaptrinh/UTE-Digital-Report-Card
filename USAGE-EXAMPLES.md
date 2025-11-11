// ============================================
// USAGE EXAMPLES - UTE Digital Report Card
// ============================================

// ===== 1. HEADER COMPONENT =====
// File: app/(normal)/student/page.tsx
"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const user = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@student.hcmute.edu.vn",
  avatar: "",
  role: "student" as const,
};

export default function StudentPage() {
  const handleLogout = () => {
    // Implement logout logic
    console.log("Logging out...");
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <main>{/* Your content */}</main>
      <Footer />
    </>
  );
}

// ===== 2. TEACHER SIDEBAR =====
// File: app/(teacher)/layout.tsx
"use client";

import { TeacherSidebar } from "@/components/layout/teacher/sidebar";

const teacherUser = {
  name: "Nguyễn Văn B",
  email: "teacher@hcmute.edu.vn",
  avatar: "",
  role: "teacher" as const,
  subject: "Toán học",
  classes: ["10A1", "11A2"],
};

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <TeacherSidebar user={teacherUser} onLogout={() => console.log("Logout")} />
      <main className="flex-1 lg:ml-[280px] pt-16 lg:pt-0">{children}</main>
    </div>
  );
}

// ===== 3. PRINCIPAL SIDEBAR (Same as Teacher) =====
const principalUser = {
  name: "Trần Văn C",
  email: "principal@hcmute.edu.vn",
  avatar: "",
  role: "principal" as const,
};

// Principal có thêm menu items: Báo cáo thống kê, Quản lý giáo viên, Toàn trường
<TeacherSidebar user={principalUser} onLogout={() => {}} />

// ===== 4. ACADEMIC OFFICER (Giáo viên chủ nhiệm) =====
const academicOfficerUser = {
  name: "Lê Thị D",
  email: "academic@hcmute.edu.vn",
  avatar: "",
  role: "academic-officer" as const,
  classes: ["10A1"],
};

<TeacherSidebar user={academicOfficerUser} onLogout={() => {}} />

// ===== 5. PARENT HEADER =====
const parentUser = {
  name: "Trần Thị E",
  email: "parent@hcmute.edu.vn",
  avatar: "",
  role: "parent" as const,
};

<Header user={parentUser} onLogout={() => {}} />

// ===== 6. LOGIN PAGE (No Header) =====
// File: app/(normal)/login/page.tsx
// Login page không cần Header/Footer, full page form

// ===== 7. ANIMATION WITH MOTION =====
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
>
  <h1>Animated Content</h1>
</motion.div>

// ===== 8. GLASSMORPHISM CARD =====
<div className="bg-background/80 backdrop-blur-[6px] border border-border/40 rounded-xl p-6 shadow-sm">
  <h2 className="text-xl font-bold text-foreground">Card Title</h2>
  <p className="text-muted-foreground">Card content with glass effect</p>
</div>

// ===== 9. RESPONSIVE LAYOUT =====
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
</div>

// ===== 10. THEME TOGGLE =====
import { ModeToggle } from "@/components/toggle.theme";

<ModeToggle />

// ===== 11. STATS CARD PATTERN =====
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {[
    { label: "Điểm TB", value: "8.5", icon: "📊" },
    { label: "Học kỳ", value: "HK2", icon: "📅" },
  ].map((stat) => (
    <div
      key={stat.label}
      className="rounded-xl bg-background/80 backdrop-blur-sm border border-border/40 p-6"
    >
      <p className="text-sm text-muted-foreground">{stat.label}</p>
      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
    </div>
  ))}
</div>

// ===== 12. NAVIGATION BASED ON ROLE =====
// Header tự động filter navigation items dựa trên user.role
// Teacher role: Hiển thị menu "Giáo viên" với dropdown
// Student role: Hiển thị "Kết quả học tập", "Thời khóa biểu", "Yêu cầu học bạ"
// Parent role: Hiển thị menu phù hợp với phụ huynh

// ===== 13. CUSTOM HOOKS (if needed) =====
import { useState, useEffect } from "react";

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data
    // setUser(userData);
    setLoading(false);
  }, []);

  return { user, loading };
}

// Usage in page:
// const { user, loading } = useAuth();
// if (loading) return <Spinner />;
// if (!user) return <Navigate to="/login" />;
// return <Header user={user} />;

// ===== 14. PROTECTED ROUTE PATTERN =====
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedPage() {
  const router = useRouter();
  // const { user } = useAuth();

  useEffect(() => {
    // if (!user) router.push("/login");
  }, []);

  return <div>Protected Content</div>;
}

// ===== 15. LOADING STATE =====
import { Spinner } from "@/components/ui/spinner";

const [isLoading, setIsLoading] = useState(false);

{isLoading ? (
  <div className="flex items-center justify-center min-h-[400px]">
    <Spinner className="h-8 w-8" />
  </div>
) : (
  <div>Content</div>
)}

// ===== 16. ERROR BOUNDARY PATTERN =====
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold text-foreground mb-4">Có lỗi xảy ra!</h2>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
      >
        Thử lại
      </button>
    </div>
  );
}
