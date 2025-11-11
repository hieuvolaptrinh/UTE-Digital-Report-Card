"use client";

import { useAuth, isParent } from "@/lib/auth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ChildDetailView } from "@/components/section/parent/child-detail-view";
import { mockGrades, Grade } from "@/mork-data";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ChildDetailPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const childId = params.child as string;
  const [childGrades, setChildGrades] = useState<Grade[]>([]);
  const [childInfo, setChildInfo] = useState<{
    name: string;
    class: string;
    studentId: string;
  } | null>(null);

  useEffect(() => {
    if (!isLoading && (!user || !isParent(user))) {
      router.push("/login");
    }

    if (user && isParent(user)) {
      // Find child info
      const child = user.children.find((c) => c.studentId === childId);
      if (!child) {
        router.push("/parent");
        return;
      }

      setChildInfo({
        name: child.name,
        class: child.class,
        studentId: child.studentId,
      });

      // Load grades for this child
      const grades = mockGrades.filter((g) => g.studentId === child.studentId);
      setChildGrades(grades);
    }
  }, [user, isLoading, router, childId]);

  if (isLoading || !user || !isParent(user) || !childInfo) {
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
    role: user.role as "parent",
  };

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Link href="/parent">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
            </Link>
          </motion.div>

          {/* Child Detail */}
          <ChildDetailView
            childName={childInfo.name}
            childClass={childInfo.class}
            studentId={childInfo.studentId}
            grades={childGrades}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
