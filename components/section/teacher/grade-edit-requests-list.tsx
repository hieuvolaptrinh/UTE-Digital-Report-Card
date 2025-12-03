"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, DialogContent, DialogTitle, DialogClose 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Check, X, Send, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock Data
const MOCK_REQUESTS = [
  {
    id: "REQ001",
    studentName: "Nguyễn Văn A",
    studentId: "2024001",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    class: "10A1",
    subject: "Toán học",
    type: "Kiểm tra 15 phút",
    oldScore: 6.5,
    newScore: 8.5,
    reason: "Em bị nhập nhầm điểm cột 1 với bạn bên cạnh ạ",
    date: "2024-03-20",
  },
  {
    id: "REQ002",
    studentName: "Trần Thị B",
    studentId: "2024002",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    class: "10A1",
    subject: "Toán học",
    type: "Kiểm tra 1 tiết",
    oldScore: 7.0,
    newScore: 7.5,
    reason: "Thầy chấm sót câu trắc nghiệm cuối cùng",
    date: "2024-03-21",
  },
  {
    id: "REQ003",
    studentName: "Lê Văn C",
    studentId: "2024003",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
    class: "10A2",
    subject: "Vật lý",
    type: "Giữa kỳ",
    oldScore: 5.0,
    newScore: 8.0,
    reason: "Điểm trên web khác với bài thi em được trả",
    date: "2024-03-22",
  },
];

export function GradeEditRequestsList() {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // State cho Modal Duyệt
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<any>(null);
  const [formData, setFormData] = useState({ newScore: "", reason: "" });

  // --- LOGIC CHECKBOX ---
  const toggleSelectAll = () => {
    if (selectedIds.length === requests.length) setSelectedIds([]);
    else setSelectedIds(requests.map(r => r.id));
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  // --- LOGIC ACTIONS ---
  // Mở modal duyệt
  const handleOpenApprove = (req?: any) => {
    // Nếu bấm từ nút dòng -> lấy req đó. Nếu bấm từ thanh nổi -> lấy req đầu tiên trong danh sách chọn (demo)
    const targetReq = req || requests.find(r => r.id === selectedIds[0]);
    
    if (targetReq) {
      setCurrentRequest(targetReq);
      setFormData({ newScore: targetReq.newScore.toString(), reason: "" });
      setIsApproveModalOpen(true);
    }
  };

  const handleSubmitApprove = () => {
    // Giả lập API update
    alert(`Đã gửi yêu cầu duyệt cho ${currentRequest?.studentName}`);
    setIsApproveModalOpen(false);
    
    // Xóa khỏi danh sách sau khi duyệt
    if (currentRequest) {
        setRequests(prev => prev.filter(r => r.id !== currentRequest.id));
        setSelectedIds(prev => prev.filter(id => id !== currentRequest.id));
    }
  };

  const handleReject = (ids: string[]) => {
    if(confirm(`Bạn có chắc muốn từ chối ${ids.length} yêu cầu này?`)) {
        setRequests(prev => prev.filter(r => !ids.includes(r.id)));
        setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-4 relative pb-20">
      
      {/* THANH CÔNG CỤ NỔI (FLOATING BAR) */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-8 left-0 right-0 z-40 flex justify-center px-4"
            >
                <div className="bg-white shadow-2xl border border-gray-100 rounded-full pl-6 pr-2 py-2 flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-rose-100 p-1.5 rounded-full">
                            <Check className="h-4 w-4 text-[#F43F5E]" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Đã chọn</span>
                            <span className="text-sm font-bold text-gray-900">{selectedIds.length} yêu cầu</span>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-gray-200"></div>

                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            className="rounded-full border-gray-200 text-gray-600 hover:bg-gray-50 gap-2 h-9"
                            onClick={() => handleReject(selectedIds)}
                        >
                            <XCircle className="h-4 w-4" /> Từ chối
                        </Button>
                        <Button 
                            className="rounded-full bg-[#F43F5E] hover:bg-[#e11d48] text-white shadow-lg shadow-rose-200 gap-2 h-9"
                            onClick={() => handleOpenApprove()}
                        >
                            <Send className="h-4 w-4" /> Duyệt
                        </Button>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* BẢNG DANH SÁCH */}
      <GlassCard className="overflow-hidden p-0 border-t-4 border-t-[#F43F5E]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-[50px] text-center">
                    <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-[#F43F5E] focus:ring-[#F43F5E] cursor-pointer accent-[#F43F5E]"
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
                <TableRow key={req.id} className={selectedIds.includes(req.id) ? "bg-rose-50/30" : ""}>
                  <TableCell className="text-center">
                    <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-[#F43F5E] focus:ring-[#F43F5E] cursor-pointer accent-[#F43F5E]"
                        checked={selectedIds.includes(req.id)}
                        onChange={() => toggleSelectOne(req.id)}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={req.avatar} />
                            <AvatarFallback>{req.studentName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium text-gray-900">{req.studentName}</div>
                            <div className="text-xs text-muted-foreground">{req.studentId}</div>
                        </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-medium text-sm text-gray-800">{req.subject}</div>
                    <Badge variant="outline" className="text-xs font-normal bg-white text-gray-500 mt-1">{req.class}</Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="secondary" className="font-normal bg-gray-100 text-gray-700">{req.type}</Badge>
                    <div className="text-xs text-muted-foreground mt-1">{req.date}</div>
                  </TableCell>
                  
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm bg-white border border-gray-100 rounded-md py-1 px-2 w-fit mx-auto shadow-sm">
                        <span className="text-gray-400 line-through">{req.oldScore}</span>
                        <span className="text-gray-300">→</span>
                        <span className="font-bold text-green-600">{req.newScore}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <p className="text-sm text-gray-500 line-clamp-2 italic">"{req.reason}"</p>
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                        <Button 
                            variant="ghost" size="icon" 
                            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleReject([req.id])}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" size="icon" 
                            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleOpenApprove(req)}
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

      {/* MODAL FORM DUYỆT (POPUP) */}
      <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-white rounded-xl overflow-hidden border-0 shadow-2xl">
          {/* Header */}
          <div className="px-6 pt-6 pb-2 relative">
             <div className="flex items-center justify-between mb-1">
                <DialogTitle className="text-2xl font-bold text-gray-900">Yêu cầu sửa điểm</DialogTitle>
                <div className="bg-[#F43F5E] text-white text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm">
                   <Send className="h-3 w-3" /> Duyệt yêu cầu
                </div>
             </div>
             <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <span className="text-gray-900 font-bold">{currentRequest?.studentName}</span>
                <span className="text-gray-300">-</span>
                <span>{currentRequest?.subject}</span>
             </div>
             <DialogClose className="absolute right-4 top-4 opacity-70 hover:opacity-100">
                <X className="h-4 w-4" />
             </DialogClose>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-800">Chọn điểm cần sửa</Label>
              <Select defaultValue={currentRequest?.type} disabled>
                <SelectTrigger className="w-full h-11 bg-gray-50 text-gray-500"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value={currentRequest?.type || "1"}>{currentRequest?.type}</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-800">Điểm mới đề xuất</Label>
              <Input 
                value={formData.newScore} 
                onChange={e => setFormData({...formData, newScore: e.target.value})}
                className="h-11 font-medium" 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-800">Lý do / Ghi chú</Label>
              <Textarea 
                placeholder="Nhập ghi chú cho cán bộ đào tạo..." 
                className="min-h-[100px] p-3"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-2 flex items-center justify-end gap-3 pb-6">
            <Button variant="outline" onClick={() => setIsApproveModalOpen(false)} className="h-10 px-6">Hủy</Button>
            <Button onClick={handleSubmitApprove} className="h-10 px-6 bg-[#F43F5E] hover:bg-[#e11d48] text-white">Gửi yêu cầu</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}