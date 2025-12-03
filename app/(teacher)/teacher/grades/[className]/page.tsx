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
import { ArrowLeft, Save, Upload, RotateCcw, FileSpreadsheet, Lock, CalendarClock, CheckSquare, X, ChevronsDown, CornerDownLeft, Info } from "lucide-react";
import Link from "next/link";
import { getStudentDetailsByClass, getGradesByClassAndSubject } from "@/mork-data";
import { cn } from "@/lib/utils";

export default function EnterGradesPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const params = useParams();
  const className = decodeURIComponent(params.className as string);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkInputRef = useRef<HTMLInputElement>(null);

  const students = getStudentDetailsByClass(className);
  const subjectName = "Toán học";

  const [gradesData, setGradesData] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // --- STATE SELECTION ---
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [bulkValue, setBulkValue] = useState("");
  
  const getCellId = (studentId: string, field: string, index: number | null) => {
    return `${studentId}|${field}|${index !== null ? index : 'main'}`;
  };

  const [gradingPeriod, setGradingPeriod] = useState<"MIDTERM" | "FINAL">("MIDTERM");

  useEffect(() => {
    if (user && isTeacher(user)) {
        const initialGrades = getGradesByClassAndSubject(className, subjectName);
        setGradesData(JSON.parse(JSON.stringify(initialGrades)));
    }
  }, [user, className]);

  useEffect(() => {
    if (!isLoading && (!user || !isTeacher(user))) router.push("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  // --- LOGIC BẮT PHÍM TẮT THÔNG MINH ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (selectedCells.size > 0 && !e.ctrlKey && !e.altKey && !e.metaKey) {
            if (/^[0-9.]$/.test(e.key)) {
                if (document.activeElement !== bulkInputRef.current) {
                    bulkInputRef.current?.focus();
                }
            }
        }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCells]);


  if (isLoading || !user || !isTeacher(user)) return null;

  const headerUser = {
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role as any,
  };

  const isMidtermDisabled = gradingPeriod === "FINAL"; 
  const isFinalDisabled = gradingPeriod === "MIDTERM";  

  // --- LOGIC SELECTION ---
  const handleMouseDown = (cellId: string, e: React.MouseEvent) => {
    if (!e.ctrlKey && selectedCells.size <= 1 && selectedCells.has(cellId)) return;
    setIsDragging(true);
    if (e.ctrlKey) {
        const newSet = new Set(selectedCells);
        if (newSet.has(cellId)) newSet.delete(cellId);
        else newSet.add(cellId);
        setSelectedCells(newSet);
    } else {
        setSelectedCells(new Set([cellId]));
    }
  };

  const handleMouseEnter = (cellId: string) => {
    if (isDragging) {
        const newSet = new Set(selectedCells);
        newSet.add(cellId);
        setSelectedCells(newSet);
    }
  };

  const handleSelectColumn = (field: string, index: number | null) => {
      const columnIds = students.map(s => getCellId(s.studentId, field, index));
      const newSet = new Set(selectedCells);
      const isAllSelected = columnIds.every(id => newSet.has(id));

      if (isAllSelected) columnIds.forEach(id => newSet.delete(id));
      else columnIds.forEach(id => newSet.add(id));
      setSelectedCells(newSet);
      
      setBulkValue("");
      setTimeout(() => bulkInputRef.current?.focus(), 50);
  };

  const isColumnSelected = (field: string, index: number | null) => {
      if (students.length === 0) return false;
      const firstId = getCellId(students[0].studentId, field, index);
      return selectedCells.has(firstId); 
  };

  const applyBulkGrade = () => {
    const numVal = parseFloat(bulkValue);
    if (bulkValue !== "" && (isNaN(numVal) || numVal < 0 || numVal > 10)) return;

    setGradesData(prev => prev.map(g => {
        let newGrade = { ...g };
        let isModified = false;
        selectedCells.forEach(cellId => {
            const [sId, field, idxStr] = cellId.split('|');
            if (sId === g.studentId) {
                isModified = true;
                const index = idxStr === 'main' ? null : parseInt(idxStr);
                const valToSet = bulkValue === "" ? null : numVal;

                if (index !== null && Array.isArray(newGrade[field])) {
                    const newArr = [...newGrade[field]];
                    newArr[index] = valToSet;
                    newGrade[field] = newArr;
                } else {
                    newGrade[field] = valToSet;
                }
            }
        });
        return isModified ? newGrade : g;
    }));
  };

  const clearSelection = () => {
    setSelectedCells(new Set());
    setBulkValue("");
  }

  // --- LOGIC TÍNH TOÁN ---
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
        alert(`Đã lưu bảng điểm thành công!`);
    }, 1000);
  };

  // --- COMPONENTS ---
  const GradeCell = ({ studentId, field, index, value, disabled, classNameInput }: any) => {
    const cellId = getCellId(studentId, field, index);
    const isSelected = selectedCells.has(cellId);
    return (
        <div 
            className={cn(
                "relative p-0.5 rounded-md transition-all duration-150",
                isSelected ? 'bg-orange-100 ring-2 ring-orange-400 z-10 shadow-sm' : ''
            )}
            onMouseDown={(e) => !disabled && handleMouseDown(cellId, e)}
            onMouseEnter={() => !disabled && handleMouseEnter(cellId)}
        >
            <Input 
                className={cn(
                    "p-0 text-center text-sm disabled:opacity-50 transition-all duration-150", 
                    classNameInput,
                    isSelected ? "border-orange-400 bg-white text-orange-700 font-bold" : ""
                )}
                value={value ?? ""}
                onChange={(e) => handleGradeChange(studentId, field, index, e.target.value)}
                placeholder={disabled ? "" : "-"}
                disabled={disabled}
                style={{ userSelect: 'none' }} 
            />
            {isDragging && !disabled && <div className="absolute inset-0 z-20 cursor-crosshair" />}
        </div>
    )
  }

  const ColumnSelector = ({ field, indices, disabled }: any) => {
    if (disabled) return null;
    return (
        <div className="flex gap-1 justify-center w-full mb-1">
            {indices.map((i: number) => {
               const active = isColumnSelected(field, i);
               return (
                <div key={i} className="w-10 flex justify-center">
                    <button
                        onClick={() => handleSelectColumn(field, i)}
                        className={cn(
                            "w-6 h-6 rounded hover:bg-black/5 flex items-center justify-center transition-all active:scale-95",
                            active ? "text-orange-600 bg-orange-100" : "text-gray-300 hover:text-gray-500"
                        )}
                        title="Chọn cả cột"
                    >
                        <ChevronsDown className="w-4 h-4" />
                    </button>
                </div>
               )
            })}
        </div>
    )
  }

  const SingleColumnSelector = ({ field, disabled }: any) => {
    if (disabled) return null;
    const active = isColumnSelected(field, null);
    return (
        <div className="flex justify-center w-full mb-1">
             <button
                onClick={() => handleSelectColumn(field, null)}
                className={cn(
                    "w-6 h-6 rounded hover:bg-black/5 flex items-center justify-center transition-all active:scale-95",
                    active ? "text-orange-600 bg-orange-100" : "text-gray-300 hover:text-gray-500"
                )}
                title="Chọn cả cột"
            >
                <ChevronsDown className="w-4 h-4" />
            </button>
        </div>
    )
  }

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 pb-28">
        <div className="container mx-auto px-4 py-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
             <div className="flex items-center gap-4">
               <Link href={`/teacher/class/${className}`}>
                 <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
                   <ArrowLeft className="h-5 w-5" />
                 </Button>
               </Link>
               <div>
                 <h1 className="text-2xl font-bold flex items-center gap-2">Nhập điểm: Lớp {className}</h1>
                 <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-white gap-1 font-normal"><FileSpreadsheet className="h-3 w-3" /> {subjectName}</Badge>
                    <Badge className={`${gradingPeriod === 'MIDTERM' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'} border-0 gap-1`}>
                        <CalendarClock className="h-3 w-3" />
                        Giai đoạn: {gradingPeriod === 'MIDTERM' ? 'Sau Giữa Kỳ' : 'Sau Cuối Kỳ'}
                    </Badge>
                 </div>
               </div>
             </div>
             
             <div className="flex flex-wrap gap-2 items-center">
                <Select value={gradingPeriod} onValueChange={(v: any) => setGradingPeriod(v)}>
                    <SelectTrigger className="w-[180px] h-9 bg-white"><SelectValue placeholder="Chọn giai đoạn" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="MIDTERM">Giai đoạn Giữa kỳ</SelectItem>
                        <SelectItem value="FINAL">Giai đoạn Cuối kỳ</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2 bg-white" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" /> Import</Button>
                <Button className="gap-2 min-w-[120px] bg-primary hover:bg-primary/90 text-white" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu điểm
                </Button>
             </div>
          </div>

          {/* --- NOTE HƯỚNG DẪN MỚI --- */}
          <div className="flex items-center justify-end mb-2 px-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-1.5 bg-white/50 backdrop-blur px-3 py-1 rounded-full border border-white/40 shadow-sm">
                  <Info className="h-3.5 w-3.5 text-blue-500" /> 
                  <span>Mẹo: Giữ phím <kbd className="font-sans font-semibold border border-gray-300 bg-gray-50 rounded px-1 text-xs text-gray-700">Ctrl</kbd> để chọn nhiều ô rời rạc, hoặc kéo chuột để chọn vùng.</span>
              </p>
          </div>

          <GlassCard className="overflow-hidden min-h-[500px] mb-10 select-none shadow-xl border-t border-white/50"> 
            <div className="overflow-x-auto pb-4">
              <Table>
                <TableHeader className="bg-muted/30 sticky top-0 z-20 shadow-sm backdrop-blur-xl">
                  <TableRow>
                    <TableHead className="w-[50px] text-center bg-gray-50/90 backdrop-blur">STT</TableHead>
                    <TableHead className="w-[200px] min-w-[180px] bg-gray-50/90 backdrop-blur">Họ và tên</TableHead>
                    
                    <TableHead className={`text-center min-w-[140px] bg-gray-50/90 backdrop-blur p-2 ${isMidtermDisabled ? 'opacity-50' : ''}`}>
                        <div className="flex flex-col items-center gap-1">
                            <span className="font-semibold text-gray-700">Miệng (HS1)</span>
                            {isMidtermDisabled ? <Lock className="h-3 w-3" /> : <ColumnSelector field="oral" indices={[0, 1, 2]} />}
                        </div>
                    </TableHead>

                    <TableHead className={`text-center min-w-[140px] bg-gray-50/90 backdrop-blur p-2 ${isMidtermDisabled ? 'opacity-50' : ''}`}>
                        <div className="flex flex-col items-center gap-1">
                            <span className="font-semibold text-gray-700">15 Phút (HS1)</span>
                            {isMidtermDisabled ? <Lock className="h-3 w-3" /> : <ColumnSelector field="test15min" indices={[0, 1, 2]} />}
                        </div>
                    </TableHead>

                    <TableHead className={`text-center min-w-[140px] bg-gray-50/90 backdrop-blur p-2 ${isMidtermDisabled ? 'opacity-50' : ''}`}>
                        <div className="flex flex-col items-center gap-1">
                            <span className="font-semibold text-gray-700">1 Tiết (HS2)</span>
                            {isMidtermDisabled ? <Lock className="h-3 w-3" /> : <ColumnSelector field="test45min" indices={[0, 1]} />}
                        </div>
                    </TableHead>

                    <TableHead className={`text-center w-[100px] bg-gray-50/90 backdrop-blur text-orange-700 font-semibold p-2 ${isMidtermDisabled ? 'opacity-50' : ''}`}>
                        <div className="flex flex-col items-center gap-1">
                            <span>Giữa kỳ</span>
                            {isMidtermDisabled ? <Lock className="h-3 w-3" /> : <SingleColumnSelector field="midterm" />}
                        </div>
                    </TableHead>
                    
                    <TableHead className={`text-center w-[100px] bg-gray-50/90 backdrop-blur text-red-700 font-semibold p-2 ${isFinalDisabled ? 'opacity-50' : ''}`}>
                        <div className="flex flex-col items-center gap-1">
                            <span>Cuối kỳ</span>
                            {isFinalDisabled ? <Lock className="h-3 w-3" /> : <SingleColumnSelector field="final" />}
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
                        
                        <TableCell>
                            <div className="flex gap-1 justify-center">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-10">
                                        <GradeCell studentId={student.studentId} field="oral" index={i} value={grade.oral[i]} disabled={isMidtermDisabled} classNameInput="h-9 focus-visible:ring-1 focus-visible:border-primary" />
                                    </div>
                                ))}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-1 justify-center">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-10">
                                        <GradeCell studentId={student.studentId} field="test15min" index={i} value={grade.test15min[i]} disabled={isMidtermDisabled} classNameInput="h-9 border-blue-200 focus-visible:ring-blue-500 bg-blue-50/30 focus:bg-white" />
                                    </div>
                                ))}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-1 justify-center">
                                {[0, 1].map(i => (
                                    <div key={i} className="w-10">
                                        <GradeCell studentId={student.studentId} field="test45min" index={i} value={grade.test45min[i]} disabled={isMidtermDisabled} classNameInput="h-9 border-purple-200 focus-visible:ring-purple-500 bg-purple-50/30 focus:bg-white" />
                                    </div>
                                ))}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex justify-center w-14 mx-auto">
                                <GradeCell studentId={student.studentId} field="midterm" index={null} value={grade.midterm} disabled={isMidtermDisabled} classNameInput="h-10 font-bold text-orange-600 border-orange-200 focus-visible:ring-orange-500 bg-orange-50/30 focus:bg-white" />
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex justify-center w-14 mx-auto">
                                <GradeCell studentId={student.studentId} field="final" index={null} value={grade.final} disabled={isFinalDisabled} classNameInput="h-10 font-bold text-red-600 border-red-200 focus-visible:ring-red-500 bg-red-50/30 focus:bg-white" />
                            </div>
                        </TableCell>
                        <TableCell className="text-center font-bold text-primary text-base">{avg}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </GlassCard>
        </div>
      </main>

      {/* --- SMART INPUT BAR --- */}
      {selectedCells.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <GlassCard className="px-1.5 py-1.5 flex items-center gap-2 rounded-full shadow-2xl border-white/60 ring-1 ring-black/5 bg-white/90 backdrop-blur-md">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
                    <CheckSquare className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">{selectedCells.size} <span className="font-normal text-muted-foreground">ô</span></span>
                </div>
                
                <div className="relative group">
                    <Input 
                        ref={bulkInputRef}
                        autoFocus
                        className="w-20 h-9 text-lg font-bold text-center border-transparent bg-transparent focus-visible:ring-0 focus:bg-gray-50 rounded-md transition-all placeholder:font-normal placeholder:text-gray-300" 
                        placeholder="..." 
                        value={bulkValue}
                        onChange={(e) => setBulkValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') applyBulkGrade();
                            if (e.key === 'Escape') clearSelection();
                        }}
                    />
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] py-1 px-2 rounded opacity-0 group-focus-within:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        Nhập số & Enter
                    </div>
                </div>

                <Button size="icon" className="h-9 w-9 rounded-full bg-primary text-white hover:bg-primary/90 shadow-sm" onClick={applyBulkGrade} disabled={!bulkValue}>
                    <CornerDownLeft className="h-4 w-4" />
                </Button>

                <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full hover:bg-gray-100 text-gray-400" onClick={clearSelection}>
                    <X className="h-4 w-4" />
                </Button>
            </GlassCard>
        </div>
      )}

      <Footer />
    </>
  );
}