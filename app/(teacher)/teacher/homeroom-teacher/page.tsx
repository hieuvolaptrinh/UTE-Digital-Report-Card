"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getStudentDetailsByClass } from "@/mork-data";
import Link from "next/link";
import { Users, Phone, Mail, PenSquare, Eye, X } from "lucide-react";

// --- COMPONENT MODAL ĐÁNH GIÁ (Nhúng trực tiếp để dễ sử dụng) ---
interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentIds: string[];
  allStudents: any[]; // Dữ liệu để hiển thị thông tin
}

function AssessmentModal({ isOpen, onClose, studentIds, allStudents }: AssessmentModalProps) {
  const [conduct, setConduct] = useState("Tốt");
  const [comment, setComment] = useState("");

  // Lọc ra danh sách học sinh đang được đánh giá
  const targetStudents = allStudents.filter((s) => studentIds.includes(s.studentId));
  const isBulk = targetStudents.length > 1;

  // Reset form khi mở modal mới
  useEffect(() => {
    if (isOpen) {
      setConduct("Tốt");
      setComment("");
    }
  }, [isOpen, studentIds]);

  const handleSubmit = () => {
    // Xử lý lưu dữ liệu ở đây (Gọi API cập nhật)
    console.log("Lưu đánh giá cho:", studentIds);
    console.log("Hạnh kiểm:", conduct);
    console.log("Nhận xét:", comment);
    
    // Đóng modal sau khi lưu
    onClose();
    alert(`Đã cập nhật đánh giá cho ${targetStudents.length} học sinh thành công!`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Modal */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <PenSquare className="w-5 h-5 text-primary" />
              {isBulk ? "Đánh giá hàng loạt" : "Đánh giá học sinh"}
            </h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Body Modal */}
          <div className="p-6 overflow-y-auto">
            {/* Phần thông tin học sinh */}
            <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
              {isBulk ? (
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {targetStudents.slice(0, 3).map((s, i) => (
                      <Avatar key={i} className="w-10 h-10 border-2 border-white">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.studentId}`} />
                        <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {targetStudents.length > 3 && (
                      <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-600">
                        +{targetStudents.length - 3}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      Đang chọn {targetStudents.length} học sinh
                    </p>
                    <p className="text-xs text-gray-500">Áp dụng đánh giá này cho tất cả học sinh đã chọn</p>
                  </div>
                </div>
              ) : (
                targetStudents[0] && (
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${targetStudents[0].studentId}`} />
                      <AvatarFallback>{targetStudents[0].name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white">{targetStudents[0].name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Badge variant="outline" className="text-xs">{targetStudents[0].studentId}</Badge>
                        <span>{targetStudents[0].email}</span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Form đánh giá */}
            <div className="space-y-4">
              {/* Chọn hạnh kiểm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Đánh giá hạnh kiểm
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["Tốt", "Khá", "Trung bình", "Yếu"].map((level) => (
                    <button
                      key={level}
                      onClick={() => setConduct(level)}
                      className={`py-2 px-1 rounded-lg text-sm font-medium border transition-all ${
                        conduct === level
                          ? "bg-primary text-white border-primary shadow-md"
                          : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nhập nhận xét */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nhận xét của giáo viên
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    isBulk 
                    ? "Nhập nhận xét chung cho các học sinh đã chọn..." 
                    : "Học sinh chăm chỉ, tích cực phát biểu..."
                  }
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition bg-white dark:bg-gray-900 resize-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Footer Modal */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition"
            >
              Hủy bỏ
            </button>
            <button 
              onClick={handleSubmit}
              className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition"
            >
              Lưu đánh giá
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// --- TRANG CHÍNH ---
export default function HomeroomTeacherPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // State quản lý danh sách ID học sinh đang được chọn (checkbox)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assessingStudentIds, setAssessingStudentIds] = useState<string[]>([]); // Danh sách ID đang được xử lý trong Modal

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

  // Nếu không có lớp chủ nhiệm
  if (!user.homeRoomClass) {
    return (
      <>
        <Header user={{ name: user.name, email: user.email, avatar: user.avatar, role: user.role as any }} onLogout={logout} />
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="container mx-auto px-4 py-6">
            <GlassCard padding="lg">
              <p className="text-center text-muted-foreground">Bạn không phải là giáo viên chủ nhiệm</p>
            </GlassCard>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const students = getStudentDetailsByClass(user.homeRoomClass);

  const conductColors: Record<string, string> = {
    Tốt: "bg-green-500/10 text-green-500 border-green-500/20",
    Khá: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "Trung bình": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Yếu: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  // --- LOGIC XỬ LÝ CHECKBOX ---
  const toggleSelectAll = () => {
    if (selectedIds.length === students.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(students.map((s) => s.studentId));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // --- LOGIC MỞ MODAL ---
  const handleOpenAssessOne = (studentId: string) => {
    setAssessingStudentIds([studentId]); // Set ID cho 1 người
    setIsModalOpen(true);
  };

  const handleOpenAssessBulk = () => {
    setAssessingStudentIds(selectedIds); // Set list ID đã chọn
    setIsModalOpen(true);
  };

  return (
    <>
      <Header user={{ name: user.name, email: user.email, avatar: user.avatar, role: user.role as any }} onLogout={logout} />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold">Lớp chủ nhiệm {user.homeRoomClass}</h1>
                  <p className="text-muted-foreground">Quản lý {students.length} học sinh</p>
                </div>
              </div>

              {/* Nút đánh giá hàng loạt */}
              {selectedIds.length > 0 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleOpenAssessBulk} // <-- Đã kết nối hàm mở modal
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-md hover:bg-primary/90 transition-colors"
                >
                  <PenSquare className="h-4 w-4" />
                  Nhập đánh giá ({selectedIds.length})
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Table section */}
          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="p-4 w-12 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedIds.length === students.length && students.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-4 font-semibold text-muted-foreground">Học sinh</th>
                    <th className="p-4 font-semibold text-muted-foreground">Liên hệ</th>
                    <th className="p-4 font-semibold text-muted-foreground text-center">Điểm TB</th>
                    <th className="p-4 font-semibold text-muted-foreground text-center">Hạnh kiểm</th>
                    <th className="p-4 font-semibold text-muted-foreground text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students.map((student) => (
                    <tr key={student.studentId} className={`group transition-colors hover:bg-muted/30 ${selectedIds.includes(student.studentId) ? "bg-primary/5" : ""}`}>
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                          checked={selectedIds.includes(student.studentId)}
                          onChange={() => toggleSelectOne(student.studentId)}
                        />
                      </td>
                      <td className="p-4">
                        <Link href={`/teacher/homeroom-teacher/${student.studentId}`} className="flex items-center gap-3 group-hover:text-primary transition-colors">
                          <Avatar className="h-10 w-10 border border-border">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.studentId}`} />
                            <AvatarFallback>{student.name.split(" ").slice(-1)[0].charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">{student.studentId}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="flex flex-col gap-1">
                          {student.phone && <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-3 w-3" /><span>{student.phone}</span></div>}
                          <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-3 w-3" /><span className="truncate max-w-[150px]">{student.email}</span></div>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {student.averageGrade ? <span className="font-bold text-primary">{student.averageGrade.toFixed(1)}</span> : <span className="text-muted-foreground text-sm">--</span>}
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant="outline" className={conductColors[student.conduct || "Trung bình"]}>{student.conduct || "Chưa đánh giá"}</Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenAssessOne(student.studentId)} // <-- Đã kết nối hàm mở modal
                            className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                            title="Viết đánh giá"
                          >
                            <PenSquare className="h-4 w-4" />
                          </button>
                          <Link href={`/teacher/homeroom-teacher/${student.studentId}`} className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors" title="Xem chi tiết">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {students.length === 0 && <div className="p-8 text-center text-muted-foreground">Chưa có học sinh nào trong lớp.</div>}
          </GlassCard>
        </div>
      </main>
      <Footer />

      {/* RENDER MODAL TẠI ĐÂY */}
      <AssessmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        studentIds={assessingStudentIds}
        allStudents={students}
      />
    </>
  );
}