"use client";



import { useAuth, isTeacher } from "@/lib/auth";

import { useRouter, useParams } from "next/navigation";

import { useEffect, useState, useRef } from "react";

import { Header } from "@/components/layout/header";

import { Footer } from "@/components/layout/footer";

import { GlassCard } from "@/components/ui/glass-card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";

import {

  Select,

  SelectContent,

  SelectItem,

  SelectTrigger,

  SelectValue,

} from "@/components/ui/select";

import {

  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,

} from "@/components/ui/table";

import { ArrowLeft, Save, Download, Upload, RotateCcw, FileSpreadsheet, Lock, CalendarClock } from "lucide-react";

import Link from "next/link";

import { getStudentDetailsByClass, getGradesByClassAndSubject } from "@/mork-data";



export default function EnterGradesPage() {

  const { user, isLoading, logout } = useAuth();

  const router = useRouter();

  const params = useParams();

  const className = decodeURIComponent(params.className as string);

  const fileInputRef = useRef<HTMLInputElement>(null);



  const students = getStudentDetailsByClass(className);

  const subjectName = "Toán học"; 

  

  // State quản lý dữ liệu điểm

  const [gradesData, setGradesData] = useState<any[]>([]);

  const [isSaving, setIsSaving] = useState(false);



  // --- STATE GIẢ LẬP GIAI ĐOẠN NHẬP ĐIỂM ---

  // Trong thực tế, biến này sẽ được lấy từ API cấu hình hệ thống

  const [gradingPeriod, setGradingPeriod] = useState<"MIDTERM" | "FINAL">("MIDTERM");



  useEffect(() => {

    if (user && isTeacher(user)) {

        const initialGrades = getGradesByClassAndSubject(className, subjectName);

        setGradesData(JSON.parse(JSON.stringify(initialGrades))); 

    }

  }, [user, className]);



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



  // --- LOGIC TÍNH ĐIỂM TB (Client Side) ---

  const calculateTempAverage = (grade: any) => {

    let total = 0;

    let weight = 0;



    const sumArray = (arr: any[], coeff: number) => {

        arr.forEach(s => {

            if (s !== null && s !== undefined && s !== "") {

                total += parseFloat(s) * coeff;

                weight += coeff;

            }

        });

    };



    if (grade.oral) sumArray(grade.oral, 1);

    if (grade.test15min) sumArray(grade.test15min, 1);

    if (grade.test45min) sumArray(grade.test45min, 2);

    

    if (grade.midterm !== null && grade.midterm !== "") {

        total += parseFloat(grade.midterm) * 2;

        weight += 2;

    }

    if (grade.final !== null && grade.final !== "") {

        total += parseFloat(grade.final) * 3;

        weight += 3;

    }



    return weight > 0 ? (total / weight).toFixed(1) : "-";

  };



  const handleGradeChange = (studentId: string, field: string, index: number | null, value: string) => {

    const numVal = parseFloat(value);

    if (value !== "" && (isNaN(numVal) || numVal < 0 || numVal > 10)) return;



    setGradesData(prev => prev.map(g => {

        if (g.studentId !== studentId) return g;

        

        const newGrade = { ...g };

        if (index !== null && Array.isArray(newGrade[field])) {

            const newArr = [...newGrade[field]];

            newArr[index] = value === "" ? null : numVal;

            newGrade[field] = newArr;

        } else {

            newGrade[field] = value === "" ? null : numVal;

        }

        return newGrade;

    }));

  };



  const handleSave = () => {

    setIsSaving(true);

    setTimeout(() => {

        setIsSaving(false);

        alert(`Đã lưu bảng điểm (${gradingPeriod === 'MIDTERM' ? 'Giữa kỳ' : 'Cuối kỳ'}) thành công!`);

    }, 1000);

  };



  const handleExportExcel = () => {

    // ... Logic export giữ nguyên ...

    alert("Đang xuất file Excel...");

  };



  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    if (e.target.files?.[0]) {

        alert("Đã nhận file " + e.target.files[0].name);

        e.target.value = ""; 

    }

  };



  // --- LOGIC KIỂM TRA QUYỀN NHẬP ---

  // MIDTERM: Cho phép nhập Miệng, 15p, 1 Tiết, Giữa kỳ. KHÓA Cuối kỳ.

  // FINAL: Cho phép nhập Cuối kỳ. KHÓA các điểm trước đó (để tránh sửa đổi lịch sử).

  const isMidtermDisabled = gradingPeriod === "FINAL"; // Khóa cột giữa kỳ khi đang ở kỳ Final

  const isFinalDisabled = gradingPeriod === "MIDTERM";   // Khóa cột cuối kỳ khi đang ở kỳ Midterm



  return (

    <>

      <Header user={headerUser} onLogout={logout} />

      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">

        <div className="container mx-auto px-4 py-6">

          

          {/* Header & Controls */}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

             <div className="flex items-center gap-4">

               <Link href={`/teacher/class/${className}`}>

                 <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">

                   <ArrowLeft className="h-5 w-5" />

                 </Button>

               </Link>

               <div>

                 <h1 className="text-2xl font-bold flex items-center gap-2">

                    Nhập điểm: Lớp {className}

                 </h1>

                 <div className="flex items-center gap-2 mt-1">

                    <Badge variant="outline" className="bg-white gap-1 font-normal">

                        <FileSpreadsheet className="h-3 w-3" /> {subjectName}

                    </Badge>

                    

                    {/* Badge hiển thị trạng thái */}

                    <Badge className={`${gradingPeriod === 'MIDTERM' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'} border-0 gap-1`}>

                        <CalendarClock className="h-3 w-3" />

                        Giai đoạn: {gradingPeriod === 'MIDTERM' ? 'Sau Giữa Kỳ' : 'Sau Cuối Kỳ'}

                    </Badge>

                 </div>

               </div>

             </div>

             

             <div className="flex flex-wrap gap-2 items-center">

                {/* Selector giả lập giai đoạn (Để Demo) */}

                <div className="mr-2">

                    <Select value={gradingPeriod} onValueChange={(v: any) => setGradingPeriod(v)}>

                        <SelectTrigger className="w-[180px] h-9 bg-white">

                            <SelectValue placeholder="Chọn giai đoạn" />

                        </SelectTrigger>

                        <SelectContent>

                            <SelectItem value="MIDTERM">Giai đoạn Giữa kỳ</SelectItem>

                            <SelectItem value="FINAL">Giai đoạn Cuối kỳ</SelectItem>

                        </SelectContent>

                    </Select>

                </div>



                <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx" onChange={handleFileChange} />

                <Button variant="outline" className="gap-2 bg-white" onClick={handleImportClick}><Upload className="h-4 w-4" /> Nhập Excel</Button>

                <Button variant="outline" className="gap-2 bg-white" onClick={handleExportExcel}><Download className="h-4 w-4" /> Xuất Excel</Button>

                <Button className="gap-2 min-w-[120px] bg-primary hover:bg-primary/90 text-white" onClick={handleSave} disabled={isSaving}>

                    {isSaving ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}

                    Lưu điểm

                </Button>

             </div>

          </div>



          {/* Table */}

          <GlassCard className="overflow-hidden min-h-[500px]">

            <div className="overflow-x-auto pb-4">

              <Table>

                <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">

                  <TableRow>

                    <TableHead className="w-[50px] text-center bg-gray-50/90 backdrop-blur">STT</TableHead>

                    <TableHead className="w-[200px] min-w-[180px] bg-gray-50/90 backdrop-blur">Họ và tên</TableHead>

                    

                    {/* Header Columns với chỉ báo khóa */}

                    <TableHead className={`text-center min-w-[140px] bg-gray-50/90 backdrop-blur ${isMidtermDisabled ? 'opacity-50' : ''}`}>

                        <div className="flex flex-col items-center">

                            <span>Miệng (HS1)</span>

                            {isMidtermDisabled && <Lock className="h-3 w-3 mt-1" />}

                        </div>

                    </TableHead>

                    <TableHead className={`text-center min-w-[140px] bg-gray-50/90 backdrop-blur ${isMidtermDisabled ? 'opacity-50' : ''}`}>

                        <div className="flex flex-col items-center">

                            <span>15 Phút (HS1)</span>

                            {isMidtermDisabled && <Lock className="h-3 w-3 mt-1" />}

                        </div>

                    </TableHead>

                    <TableHead className={`text-center min-w-[140px] bg-gray-50/90 backdrop-blur ${isMidtermDisabled ? 'opacity-50' : ''}`}>

                        <div className="flex flex-col items-center">

                            <span>1 Tiết (HS2)</span>

                            {isMidtermDisabled && <Lock className="h-3 w-3 mt-1" />}

                        </div>

                    </TableHead>

                    <TableHead className={`text-center w-[100px] bg-gray-50/90 backdrop-blur text-orange-700 font-semibold ${isMidtermDisabled ? 'opacity-50' : ''}`}>

                        <div className="flex flex-col items-center">

                            <span>Giữa kỳ</span>

                            {isMidtermDisabled && <Lock className="h-3 w-3 mt-1" />}

                        </div>

                    </TableHead>

                    

                    <TableHead className={`text-center w-[100px] bg-gray-50/90 backdrop-blur text-red-700 font-semibold ${isFinalDisabled ? 'opacity-50' : ''}`}>

                        <div className="flex flex-col items-center">

                            <span>Cuối kỳ</span>

                            {isFinalDisabled && <Lock className="h-3 w-3 mt-1" />}

                        </div>

                    </TableHead>

                    

                    <TableHead className="text-center w-[80px] bg-gray-50/90 backdrop-blur text-primary font-bold">TBM</TableHead>

                  </TableRow>

                </TableHeader>

                <TableBody>

                  {students.map((student, index) => {

                    const grade = gradesData.find(g => g.studentId === student.studentId) || { oral: [], test15min: [], test45min: [], midterm: null, final: null };

                    const avg = calculateTempAverage(grade);



                    return (

                      <TableRow key={student.studentId} className="hover:bg-muted/10 group">

                        <TableCell className="text-center text-muted-foreground font-medium">{index + 1}</TableCell>

                        <TableCell>

                            <div className="font-medium text-gray-900 dark:text-gray-100">{student.name}</div>

                            <div className="text-xs text-muted-foreground">{student.studentId}</div>

                        </TableCell>

                        

                        {/* INPUTS: Disable based on period */}

                        

                        {/* Miệng */}

                        <TableCell>

                            <div className="flex gap-1.5 justify-center">

                                {[0, 1, 2].map(i => (

                                    <Input 

                                        key={i} 

                                        className="w-10 h-9 p-0 text-center text-sm focus-visible:ring-1 focus-visible:border-primary disabled:bg-gray-100 disabled:opacity-50" 

                                        value={grade.oral[i] ?? ""}

                                        onChange={(e) => handleGradeChange(student.studentId, "oral", i, e.target.value)}

                                        placeholder="-"

                                        disabled={isMidtermDisabled} // Khóa nếu đang nhập cuối kỳ

                                    />

                                ))}

                            </div>

                        </TableCell>



                        {/* 15 Phút */}

                        <TableCell>

                            <div className="flex gap-1.5 justify-center">

                                {[0, 1, 2].map(i => (

                                    <Input 

                                        key={i} 

                                        className="w-10 h-9 p-0 text-center text-sm border-blue-200 focus-visible:ring-blue-500 bg-blue-50/30 focus:bg-white disabled:bg-gray-100 disabled:border-gray-200 disabled:opacity-50" 

                                        value={grade.test15min[i] ?? ""}

                                        onChange={(e) => handleGradeChange(student.studentId, "test15min", i, e.target.value)}

                                        placeholder="-"

                                        disabled={isMidtermDisabled}

                                    />

                                ))}

                            </div>

                        </TableCell>



                        {/* 1 Tiết */}

                        <TableCell>

                            <div className="flex gap-1.5 justify-center">

                                {[0, 1].map(i => (

                                    <Input 

                                        key={i} 

                                        className="w-10 h-9 p-0 text-center text-sm border-purple-200 focus-visible:ring-purple-500 bg-purple-50/30 focus:bg-white disabled:bg-gray-100 disabled:border-gray-200 disabled:opacity-50" 

                                        value={grade.test45min[i] ?? ""}

                                        onChange={(e) => handleGradeChange(student.studentId, "test45min", i, e.target.value)}

                                        placeholder="-"

                                        disabled={isMidtermDisabled}

                                    />

                                ))}

                            </div>

                        </TableCell>



                        {/* Giữa kỳ */}

                        <TableCell>

                            <div className="flex justify-center">

                                <Input 

                                    className="w-14 h-10 p-0 text-center font-bold text-orange-600 border-orange-200 focus-visible:ring-orange-500 bg-orange-50/30 focus:bg-white disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 disabled:opacity-50" 

                                    value={grade.midterm ?? ""}

                                    onChange={(e) => handleGradeChange(student.studentId, "midterm", null, e.target.value)}

                                    placeholder="--"

                                    disabled={isMidtermDisabled}

                                />

                            </div>

                        </TableCell>



                        {/* Cuối kỳ - Chỉ mở khi ở giai đoạn FINAL */}

                        <TableCell>

                            <div className="flex justify-center">

                                <Input 

                                    className="w-14 h-10 p-0 text-center font-bold text-red-600 border-red-200 focus-visible:ring-red-500 bg-red-50/30 focus:bg-white disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-400 disabled:opacity-50" 

                                    value={grade.final ?? ""}

                                    onChange={(e) => handleGradeChange(student.studentId, "final", null, e.target.value)}

                                    placeholder="--"

                                    disabled={isFinalDisabled}

                                />

                            </div>

                        </TableCell>



                        <TableCell className="text-center font-bold text-primary text-base">

                            {avg}

                        </TableCell>

                      </TableRow>

                    );

                  })}

                </TableBody>

              </Table>

            </div>

          </GlassCard>

        </div>

      </main>

      <Footer />

    </>

  );

}