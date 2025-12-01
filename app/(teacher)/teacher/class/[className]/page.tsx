"use client";

import { useAuth, isTeacher } from "@/lib/auth";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowLeft, Eye, Download, User, BookOpen } from "lucide-react";
import Link from "next/link";
import { getStudentDetailsByClass, getGradesByClassAndSubject, StudentSubjectGrade } from "@/mork-data";

export default function ClassDetailsPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const className = decodeURIComponent(params.className as string);

  const students = getStudentDetailsByClass(className);
  const subjectName = "Toán học"; 
  const grades = getGradesByClassAndSubject(className, subjectName);

  const [selectedStudent, setSelectedStudent] = useState<{
    student: any;
    grade: StudentSubjectGrade | undefined;
    avg: string | null;
  } | null>(null);

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

  const getAverage = (studentId: string) => {
    const g = grades.find((item) => item.studentId === studentId);
    if (!g) return null;
    
    let total = 0;
    let weight = 0;
    
    if (g.oral.length) { total += g.oral.reduce((a, b) => a + b, 0); weight += g.oral.length; }
    if (g.test15min.length) { total += g.test15min.reduce((a, b) => a + b, 0); weight += g.test15min.length; }
    if (g.test45min.length) { total += g.test45min.reduce((a, b) => a + b, 0) * 2; weight += g.test45min.length * 2; }
    if (g.midterm) { total += g.midterm * 2; weight += 2; }
    if (g.final) { total += g.final * 3; weight += 3; }
    
    return weight > 0 ? (total / weight).toFixed(1) : null;
  };

  const handleExportExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
        + "STT,MaHS,HoTen,DiemMieng,15Phut,1Tiet,GiuaKy,CuoiKy,TBM\n"
        + students.map((s, i) => {
            const g = grades.find(x => x.studentId === s.studentId);
            const avg = getAverage(s.studentId) || "";
            const oral = g?.oral.join(' - ') || '';
            const t15 = g?.test15min.join(' - ') || '';
            const t45 = g?.test45min.join(' - ') || '';
            return `${i+1},${s.studentId},${s.name},"${oral}","${t15}","${t45}",${g?.midterm || ''},${g?.final || ''},${avg}`;
        }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bang_Diem_${className}_${subjectName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-6">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <Link href="/teacher/classes">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Lớp {className}</h1>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                   <Badge variant="outline" className="gap-1 bg-white">
                      <BookOpen className="h-3 w-3" /> {subjectName}
                   </Badge>
                   <span>• {students.length} học sinh</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
                <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white shadow-sm" onClick={handleExportExcel}>
                  <Download className="h-4 w-4" /> Xuất Excel
                </Button>
            </div>
          </motion.div>

          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[50px] text-center">STT</TableHead>
                    <TableHead className="w-[250px]">Họ và tên</TableHead>
                    <TableHead className="text-center">Miệng</TableHead>
                    <TableHead className="text-center">15 phút</TableHead>
                    <TableHead className="text-center">1 tiết</TableHead>
                    <TableHead className="text-center w-[80px]">Giữa kỳ</TableHead>
                    <TableHead className="text-center w-[80px]">Cuối kỳ</TableHead>
                    <TableHead className="text-center w-[80px] font-bold text-primary">TBM</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student, index) => {
                    const studentGrade = grades.find(g => g.studentId === student.studentId);
                    const avg = getAverage(student.studentId);

                    return (
                      <TableRow key={student.studentId} className="hover:bg-muted/20 transition-colors">
                        <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                             <Avatar className="h-8 w-8 border border-border">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.studentId}`} />
                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <div className="flex flex-col">
                                <span className="font-medium">{student.name}</span>
                                <span className="text-xs text-muted-foreground">{student.studentId}</span>
                             </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-center">
                           <div className="flex justify-center gap-1 flex-wrap max-w-[120px] mx-auto">
                             {studentGrade?.oral.length ? studentGrade.oral.map((s, i) => (
                               <Badge key={i} variant="secondary" className="px-1.5 py-0 text-xs font-normal border border-border bg-gray-50">{s}</Badge>
                             )) : <span className="text-muted-foreground text-sm">-</span>}
                           </div>
                        </TableCell>
                        <TableCell className="text-center">
                           <div className="flex justify-center gap-1 flex-wrap max-w-[120px] mx-auto">
                             {studentGrade?.test15min.length ? studentGrade.test15min.map((s, i) => (
                               <Badge key={i} variant="secondary" className="px-1.5 py-0 text-xs font-normal border border-blue-200 bg-blue-50 text-blue-700">{s}</Badge>
                             )) : <span className="text-muted-foreground text-sm">-</span>}
                           </div>
                        </TableCell>
                         <TableCell className="text-center">
                           <div className="flex justify-center gap-1 flex-wrap max-w-[120px] mx-auto">
                             {studentGrade?.test45min.length ? studentGrade.test45min.map((s, i) => (
                               <Badge key={i} variant="secondary" className="px-1.5 py-0 text-xs font-normal border border-purple-200 bg-purple-50 text-purple-700">{s}</Badge>
                             )) : <span className="text-muted-foreground text-sm">-</span>}
                           </div>
                        </TableCell>
                        <TableCell className="text-center font-medium text-orange-600">
                           {studentGrade?.midterm ?? "-"}
                        </TableCell>
                        <TableCell className="text-center font-medium text-red-600">
                           {studentGrade?.final ?? "-"}
                        </TableCell>
                        <TableCell className="text-center font-bold text-primary text-base">
                           {avg ?? "-"}
                        </TableCell>
                        <TableCell className="text-right">
                           <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10"
                              onClick={() => setSelectedStudent({ student, grade: studentGrade, avg })}
                           >
                              <Eye className="h-4 w-4" /> Chi tiết
                           </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </GlassCard>
        </div>

        <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
          <DialogContent className="max-w-md bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                 <User className="h-5 w-5 text-primary" />
                 Bảng điểm chi tiết
              </DialogTitle>
              <DialogDescription>
                Môn học: {subjectName}
              </DialogDescription>
            </DialogHeader>

            {selectedStudent && (
              <div className="space-y-6 pt-2">
                <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg border border-border">
                   <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudent.student.studentId}`} />
                      <AvatarFallback>{selectedStudent.student.name.charAt(0)}</AvatarFallback>
                   </Avatar>
                   <div>
                      <h3 className="font-bold text-lg">{selectedStudent.student.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedStudent.student.studentId} • Lớp {className}</p>
                      <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/20 border-0">
                        TB Môn: {selectedStudent.avg || "Chưa có"}
                      </Badge>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="grid grid-cols-3 gap-2 pb-2 border-b text-sm font-semibold text-muted-foreground">
                      <div>Loại điểm</div>
                      <div className="text-center">Hệ số</div>
                      <div className="text-right">Điểm số</div>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-2 items-center text-sm">
                      <div>Điểm Miệng</div>
                      <div className="text-center text-muted-foreground">1</div>
                      <div className="text-right flex justify-end gap-1 flex-wrap">
                        {selectedStudent.grade?.oral.length ? selectedStudent.grade.oral.map((s,i) => (
                           <Badge key={i} variant="outline" className="font-mono bg-gray-50">{s}</Badge>
                        )) : <span className="text-muted-foreground">-</span>}
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-2 items-center text-sm">
                      <div>15 Phút</div>
                      <div className="text-center text-muted-foreground">1</div>
                      <div className="text-right flex justify-end gap-1 flex-wrap">
                        {selectedStudent.grade?.test15min.length ? selectedStudent.grade.test15min.map((s,i) => (
                           <Badge key={i} variant="outline" className="font-mono border-blue-200 text-blue-700 bg-blue-50">{s}</Badge>
                        )) : <span className="text-muted-foreground">-</span>}
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-2 items-center text-sm">
                      <div>1 Tiết</div>
                      <div className="text-center text-muted-foreground">2</div>
                      <div className="text-right flex justify-end gap-1 flex-wrap">
                        {selectedStudent.grade?.test45min.length ? selectedStudent.grade.test45min.map((s,i) => (
                           <Badge key={i} variant="outline" className="font-mono border-purple-200 text-purple-700 bg-purple-50">{s}</Badge>
                        )) : <span className="text-muted-foreground">-</span>}
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-2 items-center text-sm">
                      <div>Giữa kỳ</div>
                      <div className="text-center text-muted-foreground">2</div>
                      <div className="text-right font-bold text-orange-600 text-base">
                        {selectedStudent.grade?.midterm ?? "-"}
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-2 items-center text-sm">
                      <div>Cuối kỳ</div>
                      <div className="text-center text-muted-foreground">3</div>
                      <div className="text-right font-bold text-red-600 text-base">
                        {selectedStudent.grade?.final ?? "-"}
                      </div>
                   </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </main>
      <Footer />
    </>
  );
}