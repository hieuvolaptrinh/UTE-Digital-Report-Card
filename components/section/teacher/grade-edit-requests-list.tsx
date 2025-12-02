"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, CheckSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data
const MOCK_REQUESTS = [
  {
    id: "REQ001",
    studentName: "Nguyễn Văn A",
    studentId: "2024001",
    class: "10A1",
    subject: "Toán học",
    type: "Kiểm tra 15 phút",
    oldScore: 6.5,
    newScore: 8.5,
    reason: "Em bị nhập nhầm điểm cột 1 với bạn bên cạnh ạ",
    date: "2024-03-20",
    status: "PENDING"
  },
  {
    id: "REQ002",
    studentName: "Trần Thị B",
    studentId: "2024002",
    class: "10A1",
    subject: "Toán học",
    type: "Kiểm tra 1 tiết",
    oldScore: 7.0,
    newScore: 7.5,
    reason: "Thầy chấm sót câu trắc nghiệm cuối cùng",
    date: "2024-03-21",
    status: "PENDING"
  },
  {
    id: "REQ003",
    studentName: "Lê Văn C",
    studentId: "2024003",
    class: "10A2",
    subject: "Vật lý",
    type: "Giữa kỳ",
    oldScore: 5.0,
    newScore: 8.0,
    reason: "Điểm trên web khác với bài thi em được trả",
    date: "2024-03-22",
    status: "PENDING"
  },
];

export function GradeEditRequestsList() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // --- LOGIC CHECKBOX ---
  // Chọn tất cả / Bỏ chọn tất cả
  const toggleSelectAll = () => {
    if (selectedIds.length === requests.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(requests.map(r => r.id));
    }
  };

  // Chọn từng dòng
  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // --- LOGIC XỬ LÝ DUYỆT/TỪ CHỐI ---
  const handleAction = async (ids: string[], action: "APPROVE" | "REJECT") => {
    // Giả lập gọi API
    setProcessingId(ids.length === 1 ? ids[0] : "BULK"); // Đánh dấu đang xử lý
    
    setTimeout(() => {
        // Xóa các yêu cầu đã xử lý khỏi danh sách (Giả lập cập nhật trạng thái)
        setRequests(prev => prev.filter(r => !ids.includes(r.id)));
        setSelectedIds([]);
        setProcessingId(null);
        alert(`Đã ${action === "APPROVE" ? "duyệt" : "từ chối"} ${ids.length} yêu cầu thành công!`);
    }, 800);
  };

  if (requests.length === 0) {
    return (
        <GlassCard className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                <CheckSquare className="h-8 w-8 text-gray-400" />
            </div>
            <p>Hiện không có yêu cầu sửa điểm nào cần xử lý.</p>
        </GlassCard>
    );
  }

  return (
    <div className="space-y-4 relative">
      
      {/* THANH CÔNG CỤ HÀNG LOẠT (NỔI) - Chỉ hiện khi có chọn */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="sticky top-4 z-10 mx-auto w-full max-w-3xl"
            >
                <GlassCard className="p-3 shadow-xl border-primary/20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md flex items-center justify-between">
                    <div className="flex items-center gap-3 px-2">
                        <div className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md">
                            {selectedIds.length}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">yêu cầu đã chọn</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleAction(selectedIds, "REJECT")}
                            disabled={!!processingId}
                            className="h-8"
                        >
                            <X className="h-4 w-4 mr-1.5" /> Từ chối tất cả
                        </Button>
                        <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white h-8"
                            onClick={() => handleAction(selectedIds, "APPROVE")}
                            disabled={!!processingId}
                        >
                            <Check className="h-4 w-4 mr-1.5" /> Duyệt tất cả
                        </Button>
                    </div>
                </GlassCard>
            </motion.div>
        )}
      </AnimatePresence>

      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                {/* Checkbox Header */}
                <TableHead className="w-[50px] text-center">
                    <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                        checked={selectedIds.length === requests.length && requests.length > 0}
                        onChange={toggleSelectAll}
                    />
                </TableHead>
                <TableHead>Học sinh</TableHead>
                <TableHead>Môn học / Lớp</TableHead>
                <TableHead>Đầu điểm</TableHead>
                <TableHead className="text-center">Thay đổi</TableHead>
                <TableHead className="w-[300px]">Lý do</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id} className={selectedIds.includes(req.id) ? "bg-primary/5" : ""}>
                  {/* Checkbox Row */}
                  <TableCell className="text-center">
                    <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary"
                        checked={selectedIds.includes(req.id)}
                        onChange={() => toggleSelectOne(req.id)}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.studentId}`} />
                            <AvatarFallback>{req.studentName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium">{req.studentName}</div>
                            <div className="text-xs text-muted-foreground">{req.studentId}</div>
                        </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-medium text-sm">{req.subject}</div>
                    <Badge variant="outline" className="text-xs font-normal bg-white">Lớp {req.class}</Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">{req.type}</Badge>
                    <div className="text-xs text-muted-foreground mt-1">{req.date}</div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2 font-mono text-sm">
                        <span className="text-muted-foreground line-through decoration-red-400 decoration-2">{req.oldScore}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">{req.newScore}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <p className="text-sm text-muted-foreground line-clamp-2" title={req.reason}>
                        "{req.reason}"
                    </p>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleAction([req.id], "REJECT")}
                            disabled={!!processingId}
                            title="Từ chối"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleAction([req.id], "APPROVE")}
                            disabled={!!processingId}
                            title="Chấp nhận"
                        >
                            <Check className="h-4 w-4" />
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </GlassCard>
    </div>
  );
}