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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockGrades } from "@/mork-data";
import { Filter, FileEdit } from "lucide-react";
import {
  GradeEditRequestPopup,
  type ScoreItem,
} from "@/components/section/student/grade-edit-request-popup";

export default function StudentPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [academicYear, setAcademicYear] = useState("2024-2025");
  const [semester, setSemester] = useState<1 | 2>(1);
  const [studentGrades, setStudentGrades] = useState(mockGrades);
  const [selectedScores, setSelectedScores] = useState<ScoreItem[]>([]);
  const [showEditPopup, setShowEditPopup] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isStudent(user))) {
      router.push("/login");
    }

    if (user && isStudent(user)) {
      const grades = mockGrades.filter(
        (g) =>
          g.studentId === user.studentId &&
          g.academicYear === academicYear &&
          g.semester === semester
      );
      setStudentGrades(grades);
    }
  }, [user, isLoading, router, academicYear, semester]);

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

  const handleOpenEditPopup = () => {
    if (selectedScores.length === 0) {
      alert("Vui lòng chọn ít nhất một điểm để sửa");
      return;
    }
    setShowEditPopup(true);
  };

  const handleRemoveScore = (score: ScoreItem) => {
    setSelectedScores((prev) => prev.filter((s) => s.id !== score.id));
  };

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-6">
          {/* Selected Scores Bar */}
          {selectedScores.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
            >
              <GlassCard padding="sm">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">
                    Đã chọn {selectedScores.length} điểm
                  </span>
                  <Button
                    size="sm"
                    onClick={handleOpenEditPopup}
                    className="gap-2"
                  >
                    <FileEdit className="h-4 w-4" />
                    Gửi yêu cầu sửa điểm
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedScores([])}
                  >
                    Hủy chọn
                  </Button>
                </div>
              </GlassCard>
            </motion.div>
          )}
          {/* Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <GlassCard padding="md">
              <div className="flex items-center gap-3 mb-4">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Lọc bảng điểm</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="academicYear">Năm học</Label>
                  <Select value={academicYear} onValueChange={setAcademicYear}>
                    <SelectTrigger id="academicYear">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-2025">2024-2025</SelectItem>
                      <SelectItem value="2023-2024">2023-2024</SelectItem>
                      <SelectItem value="2022-2023">2022-2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Học kỳ</Label>
                  <Select
                    value={semester.toString()}
                    onValueChange={(val) => setSemester(parseInt(val) as 1 | 2)}
                  >
                    <SelectTrigger id="semester">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Học kỳ I</SelectItem>
                      <SelectItem value="2">Học kỳ II</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <GradesOverview grades={studentGrades} />
          <GradesTable
            grades={studentGrades}
            selectedScores={selectedScores}
            onScoreSelect={setSelectedScores}
          />
        </div>
      </main>
      <Footer />

      {/* Edit Score Popup */}
      <GradeEditRequestPopup
        isOpen={showEditPopup}
        onClose={() => setShowEditPopup(false)}
        selectedScores={selectedScores}
        onRemoveScore={handleRemoveScore}
      />
    </>
  );
}
