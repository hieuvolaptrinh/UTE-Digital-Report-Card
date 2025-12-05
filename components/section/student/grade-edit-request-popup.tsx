"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, X, FileImage, AlertCircle, CheckCircle } from "lucide-react";
import Image from "next/image";

export type ScoreItem = {
  id: string;
  type: "oral" | "test15min" | "test45min" | "midterm" | "final";
  label: string;
  value: number;
  index?: number;
  subjectId?: string;
  subjectName?: string;
};

interface GradeEditRequestPopupProps {
  isOpen: boolean;
  onClose: () => void;
  selectedScores: ScoreItem[];
  onRemoveScore: (score: ScoreItem) => void;
  subjectName?: string;
  teacherName?: string;
}

export function GradeEditRequestPopup({
  isOpen,
  onClose,
  selectedScores,
  onRemoveScore,
  subjectName,
  teacherName,
}: GradeEditRequestPopupProps) {
  const [proposedScores, setProposedScores] = useState<{
    [key: string]: string;
  }>({});
  const [reasons, setReasons] = useState<{ [key: string]: string }>({});
  const [evidenceFiles, setEvidenceFiles] = useState<{
    [key: string]: File | null;
  }>({});
  const [evidencePreviews, setEvidencePreviews] = useState<{
    [key: string]: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileChange = (
    scoreId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Kích thước file không được vượt quá 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("Chỉ chấp nhận file hình ảnh");
        return;
      }
      setEvidenceFiles((prev) => ({ ...prev, [scoreId]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidencePreviews((prev) => ({
          ...prev,
          [scoreId]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = (scoreId: string) => {
    setEvidenceFiles((prev) => ({ ...prev, [scoreId]: null }));
    setEvidencePreviews((prev) => ({ ...prev, [scoreId]: "" }));
  };

  const handleProposedScoreChange = (scoreId: string, value: string) => {
    setProposedScores((prev) => ({
      ...prev,
      [scoreId]: value,
    }));
  };

  const handleReasonChange = (scoreId: string, value: string) => {
    setReasons((prev) => ({
      ...prev,
      [scoreId]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setShowSuccess(true);
    setIsSubmitting(false);

    // Reset form after 2 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setProposedScores({});
      setReasons({});
      setEvidenceFiles({});
      setEvidencePreviews({});
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setProposedScores({});
      setReasons({});
      setEvidenceFiles({});
      setEvidencePreviews({});
      onClose();
    }
  };

  if (showSuccess) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Gửi yêu cầu thành công!
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Yêu cầu sửa điểm của bạn đã được gửi đến giáo viên. Vui lòng
                    chờ phản hồi từ giáo viên.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Yêu cầu sửa điểm</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {(subjectName || teacherName) && (
                <p className="text-sm text-muted-foreground mt-1">
                  {subjectName && <span>{subjectName}</span>}
                  {subjectName && teacherName && <span> - </span>}
                  {teacherName && <span>{teacherName}</span>}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Selected Scores */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Các điểm đã chọn ({selectedScores.length})
                </Label>
                <div className="space-y-4">
                  {selectedScores.map((score, index) => (
                    <div
                      key={score.id}
                      className="p-5 rounded-lg bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4 pb-3 border-b border-gray-300 dark:border-gray-600">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                            {score.subjectName && (
                              <Badge className="text-xs bg-primary">
                                {score.subjectName}
                              </Badge>
                            )}
                          </div>
                          <div className="font-semibold text-base">
                            {score.label}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Điểm hiện tại:{" "}
                            <Badge variant="outline" className="font-bold">
                              {score.value}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveScore(score)}
                          className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Proposed Score */}
                      <div className="space-y-2 mb-4">
                        <Label htmlFor={`proposed-${score.id}`}>
                          Điểm đề xuất *
                        </Label>
                        <Input
                          id={`proposed-${score.id}`}
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          placeholder="Nhập điểm đề xuất (0-10)"
                          value={proposedScores[score.id] || ""}
                          onChange={(e) =>
                            handleProposedScoreChange(score.id, e.target.value)
                          }
                          required
                          className="font-semibold"
                        />
                      </div>

                      {/* Reason */}
                      <div className="space-y-2 mb-4">
                        <Label htmlFor={`reason-${score.id}`}>
                          Lý do yêu cầu sửa điểm *
                        </Label>
                        <Textarea
                          id={`reason-${score.id}`}
                          placeholder="Vui lòng mô tả rõ lý do bạn cho rằng điểm này cần được xem xét lại..."
                          value={reasons[score.id] || ""}
                          onChange={(e) =>
                            handleReasonChange(score.id, e.target.value)
                          }
                          rows={3}
                          required
                        />
                      </div>

                      {/* Evidence Upload */}
                      <div className="space-y-2">
                        <Label htmlFor={`evidence-${score.id}`}>
                          Hình ảnh minh chứng
                        </Label>
                        {!evidenceFiles[score.id] ? (
                          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer bg-white dark:bg-gray-800">
                            <Input
                              id={`evidence-${score.id}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange(score.id, e)}
                              className="hidden"
                            />
                            <label
                              htmlFor={`evidence-${score.id}`}
                              className="cursor-pointer"
                            >
                              <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">
                                Nhấn để tải lên hình ảnh
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                PNG, JPG, JPEG (Tối đa 5MB)
                              </p>
                            </label>
                          </div>
                        ) : (
                          <div className="relative border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(score.id)}
                              className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <div className="flex items-start gap-3">
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
                                <Image
                                  src={evidencePreviews[score.id] || ""}
                                  alt="Preview"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <FileImage className="h-3 w-3 text-primary shrink-0" />
                                  <span className="text-xs font-medium truncate">
                                    {evidenceFiles[score.id]?.name}
                                  </span>
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                  {(
                                    (evidenceFiles[score.id]?.size || 0) /
                                    1024 /
                                    1024
                                  ).toFixed(2)}{" "}
                                  MB
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Important Notes */}
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <div className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                    <p className="font-semibold">Lưu ý quan trọng:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>
                        Yêu cầu sửa điểm chỉ được chấp nhận trong vòng 7 ngày kể
                        từ khi công bố điểm
                      </li>
                      <li>
                        Giáo viên sẽ xem xét và phản hồi trong vòng 3-5 ngày làm
                        việc
                      </li>
                      <li>
                        Kết quả xem xét của giáo viên là quyết định cuối cùng
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    selectedScores.length === 0 ||
                    !selectedScores.every(
                      (s) => proposedScores[s.id] && reasons[s.id]
                    )
                  }
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi yêu cầu"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
