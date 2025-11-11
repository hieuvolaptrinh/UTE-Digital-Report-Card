// components/section/parent/leave-request-form.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { ParentUser } from "@/mork-data";

interface LeaveRequestFormProps {
  parent: ParentUser;
}

export function LeaveRequestForm({ parent }: LeaveRequestFormProps) {
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert("Đơn xin nghỉ đã được gửi thành công!");
    setIsSubmitting(false);

    // Reset form
    setSelectedChild("");
    setFromDate(undefined);
    setToDate(undefined);
    setReason("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard padding="md">
        <h3 className="text-lg font-semibold mb-4">Đơn xin nghỉ học</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="child">Chọn học sinh</Label>
            <Select
              value={selectedChild}
              onValueChange={setSelectedChild}
              required
            >
              <SelectTrigger id="child">
                <SelectValue placeholder="Chọn con em" />
              </SelectTrigger>
              <SelectContent>
                {parent.children.map((child) => (
                  <SelectItem key={child.studentId} value={child.studentId}>
                    {child.name} - Lớp {child.class}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Từ ngày</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? (
                      format(fromDate, "PPP", { locale: vi })
                    ) : (
                      <span>Chọn ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Đến ngày</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? (
                      format(toDate, "PPP", { locale: vi })
                    ) : (
                      <span>Chọn ngày</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                    disabled={(date) => (fromDate ? date < fromDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Lý do nghỉ học</Label>
            <Textarea
              id="reason"
              placeholder="Nhập lý do xin nghỉ học..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !selectedChild || !fromDate || !toDate}
            className="w-full gap-2"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full"
                />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Gửi đơn
              </>
            )}
          </Button>
        </form>
      </GlassCard>
    </motion.div>
  );
}
