"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Send,
  Search,
  User,
  Clock,
  CheckCheck,
  Paperclip,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isTeacher: boolean;
}

interface Conversation {
  id: string;
  parentId: string;
  parentName: string;
  parentAvatar?: string;
  studentName: string;
  studentClass: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}

// Hard-coded conversations data
const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    parentId: "parent-1",
    parentName: "Nguyễn Thị Lan",
    studentName: "Nguyễn Văn An",
    studentClass: "10A1",
    lastMessage: "Con em học có tiến bộ không ạ?",
    lastMessageTime: new Date(2025, 10, 26, 14, 30),
    unreadCount: 2,
    messages: [
      {
        id: "msg-1",
        senderId: "parent-1",
        senderName: "Nguyễn Thị Lan",
        content:
          "Chào cô, em là phụ huynh của em Nguyễn Văn An lớp 10A1. Con em học môn Toán có tiến bộ không ạ?",
        timestamp: new Date(2025, 10, 25, 10, 15),
        isRead: true,
        isTeacher: false,
      },
      {
        id: "msg-2",
        senderId: "teacher-1",
        senderName: "Giáo viên",
        content:
          "Chào phụ huynh, em An học rất tốt và có tiến bộ đáng kể. Em rất chăm chỉ và tích cực trong giờ học.",
        timestamp: new Date(2025, 10, 25, 14, 20),
        isRead: true,
        isTeacher: true,
      },
      {
        id: "msg-3",
        senderId: "parent-1",
        senderName: "Nguyễn Thị Lan",
        content:
          "Cảm ơn cô nhiều ạ! Em có cần học thêm gì không để theo kịp chương trình không ạ?",
        timestamp: new Date(2025, 10, 26, 9, 10),
        isRead: true,
        isTeacher: false,
      },
      {
        id: "msg-4",
        senderId: "parent-1",
        senderName: "Nguyễn Thị Lan",
        content: "Con em học có tiến bộ không ạ?",
        timestamp: new Date(2025, 10, 26, 14, 30),
        isRead: false,
        isTeacher: false,
      },
    ],
  },
  {
    id: "conv-2",
    parentId: "parent-2",
    parentName: "Trần Văn Bình",
    studentName: "Trần Thị Bích",
    studentClass: "10A2",
    lastMessage: "Em muốn hỏi về bài tập về nhà ạ",
    lastMessageTime: new Date(2025, 10, 26, 11, 45),
    unreadCount: 1,
    messages: [
      {
        id: "msg-5",
        senderId: "parent-2",
        senderName: "Trần Văn Bình",
        content:
          "Chào cô, con em Trần Thị Bích lớp 10A2. Em muốn hỏi về bài tập về nhà tuần này ạ.",
        timestamp: new Date(2025, 10, 26, 11, 45),
        isRead: false,
        isTeacher: false,
      },
    ],
  },
  {
    id: "conv-3",
    parentId: "parent-3",
    parentName: "Lê Thị Hoa",
    studentName: "Lê Văn Hoàng",
    studentClass: "10A1",
    lastMessage: "Cảm ơn cô đã quan tâm!",
    lastMessageTime: new Date(2025, 10, 25, 16, 20),
    unreadCount: 0,
    messages: [
      {
        id: "msg-6",
        senderId: "parent-3",
        senderName: "Lê Thị Hoa",
        content:
          "Chào cô, em là phụ huynh của em Lê Văn Hoàng. Con em có vấn đề gì về học tập không ạ?",
        timestamp: new Date(2025, 10, 25, 14, 10),
        isRead: true,
        isTeacher: false,
      },
      {
        id: "msg-7",
        senderId: "teacher-1",
        senderName: "Giáo viên",
        content:
          "Chào phụ huynh, em Hoàng học tập tốt, không có vấn đề gì đáng lo ngại. Tuy nhiên, em cần chú ý hơn trong các bài tập nhóm.",
        timestamp: new Date(2025, 10, 25, 15, 30),
        isRead: true,
        isTeacher: true,
      },
      {
        id: "msg-8",
        senderId: "parent-3",
        senderName: "Lê Thị Hoa",
        content:
          "Cảm ơn cô đã quan tâm! Nhà em sẽ nhắc nhở con thêm về điều này ạ.",
        timestamp: new Date(2025, 10, 25, 16, 20),
        isRead: true,
        isTeacher: false,
      },
    ],
  },
  {
    id: "conv-4",
    parentId: "parent-4",
    parentName: "Phạm Thị Mai",
    studentName: "Phạm Văn Minh",
    studentClass: "10A3",
    lastMessage: "Con em nghỉ học hôm qua do ốm",
    lastMessageTime: new Date(2025, 10, 26, 8, 15),
    unreadCount: 1,
    messages: [
      {
        id: "msg-9",
        senderId: "parent-4",
        senderName: "Phạm Thị Mai",
        content:
          "Chào cô, con em Phạm Văn Minh nghỉ học hôm qua do bị ốm. Em xin phép cô ạ.",
        timestamp: new Date(2025, 10, 26, 8, 15),
        isRead: false,
        isTeacher: false,
      },
    ],
  },
  {
    id: "conv-5",
    parentId: "parent-5",
    parentName: "Hoàng Văn Nam",
    studentName: "Hoàng Thị Nga",
    studentClass: "10A2",
    lastMessage: "Em sẽ cố gắng hơn nữa ạ",
    lastMessageTime: new Date(2025, 10, 24, 19, 40),
    unreadCount: 0,
    messages: [
      {
        id: "msg-10",
        senderId: "parent-5",
        senderName: "Hoàng Văn Nam",
        content:
          "Chào cô, con em Hoàng Thị Nga có điểm kiểm tra môn Toán hôm trước thấp. Em muốn hỏi cô về cách học để cải thiện ạ.",
        timestamp: new Date(2025, 10, 24, 18, 20),
        isRead: true,
        isTeacher: false,
      },
      {
        id: "msg-11",
        senderId: "teacher-1",
        senderName: "Giáo viên",
        content:
          "Chào phụ huynh, em Nga cần ôn tập thêm phần kiến thức cơ bản và làm nhiều bài tập hơn. Cô sẽ gửi thêm tài liệu cho em ạ.",
        timestamp: new Date(2025, 10, 24, 19, 15),
        isRead: true,
        isTeacher: true,
      },
      {
        id: "msg-12",
        senderId: "parent-5",
        senderName: "Hoàng Văn Nam",
        content: "Cảm ơn cô nhiều! Em sẽ cố gắng hơn nữa ạ.",
        timestamp: new Date(2025, 10, 24, 19, 40),
        isRead: true,
        isTeacher: false,
      },
    ],
  },
];

// All available parents for starting new conversations
const allParents = [
  {
    id: "parent-1",
    name: "Nguyễn Thị Lan",
    studentName: "Nguyễn Văn An",
    studentClass: "10A1",
  },
  {
    id: "parent-2",
    name: "Trần Văn Bình",
    studentName: "Trần Thị Bích",
    studentClass: "10A2",
  },
  {
    id: "parent-3",
    name: "Lê Thị Hoa",
    studentName: "Lê Văn Hoàng",
    studentClass: "10A1",
  },
  {
    id: "parent-4",
    name: "Phạm Thị Mai",
    studentName: "Phạm Văn Minh",
    studentClass: "10A3",
  },
  {
    id: "parent-5",
    name: "Hoàng Văn Nam",
    studentName: "Hoàng Thị Nga",
    studentClass: "10A2",
  },
  {
    id: "parent-6",
    name: "Đỗ Thị Thu",
    studentName: "Đỗ Văn Tuấn",
    studentClass: "10A1",
  },
  {
    id: "parent-7",
    name: "Vũ Văn Hùng",
    studentName: "Vũ Thị Hương",
    studentClass: "10A3",
  },
  {
    id: "parent-8",
    name: "Bùi Thị Linh",
    studentName: "Bùi Văn Long",
    studentClass: "10A2",
  },
];

export default function ParentMessagesPage() {
  const [conversations, setConversations] =
    React.useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] =
    React.useState<Conversation | null>(conversations[0]);
  const [newMessage, setNewMessage] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [newConversationDialogOpen, setNewConversationDialogOpen] =
    React.useState(false);
  const [parentSearchTerm, setParentSearchTerm] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Filter conversations based on search
  const filteredConversations = React.useMemo(() => {
    return conversations.filter(
      (conv) =>
        conv.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conv.studentClass.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [conversations, searchTerm]);

  // Filter parents for new conversation
  const filteredParents = React.useMemo(() => {
    return allParents.filter(
      (parent) =>
        !conversations.some((conv) => conv.parentId === parent.id) &&
        (parent.name.toLowerCase().includes(parentSearchTerm.toLowerCase()) ||
          parent.studentName
            .toLowerCase()
            .includes(parentSearchTerm.toLowerCase()) ||
          parent.studentClass
            .toLowerCase()
            .includes(parentSearchTerm.toLowerCase()))
    );
  }, [conversations, parentSearchTerm]);

  // Handle start new conversation
  const handleStartConversation = (parent: (typeof allParents)[0]) => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      parentId: parent.id,
      parentName: parent.name,
      studentName: parent.studentName,
      studentClass: parent.studentClass,
      lastMessage: "Chưa có tin nhắn",
      lastMessageTime: new Date(),
      unreadCount: 0,
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setSelectedConversation(newConv);
    setNewConversationDialogOpen(false);
    setParentSearchTerm("");
  };

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  // Mark messages as read when conversation is selected
  React.useEffect(() => {
    if (selectedConversation) {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                unreadCount: 0,
                messages: conv.messages.map((msg) => ({
                  ...msg,
                  isRead: true,
                })),
              }
            : conv
        )
      );
    }
  }, [selectedConversation?.id]);

  // Handle send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: "teacher-1",
      senderName: "Giáo viên",
      content: newMessage,
      timestamp: new Date(),
      isRead: true,
      isTeacher: true,
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              messages: [...conv.messages, newMsg],
              lastMessage: newMessage,
              lastMessageTime: new Date(),
            }
          : conv
      )
    );

    setSelectedConversation((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, newMsg],
            lastMessage: newMessage,
            lastMessageTime: new Date(),
          }
        : null
    );

    setNewMessage("");
  };

  // Handle enter key to send
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const totalUnread = conversations.reduce(
    (sum, conv) => sum + conv.unreadCount,
    0
  );

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      <div className="container mx-auto p-6 flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="h-8 w-8 text-primary" />
                Tin nhắn từ phụ huynh
              </h1>
              <p className="text-muted-foreground mt-1">
                Trả lời và trao đổi với phụ huynh học sinh
              </p>
            </div>
            <Badge
              variant="secondary"
              className="h-8 px-3 bg-primary/10 text-primary border-0"
            >
              {totalUnread} tin nhắn mới
            </Badge>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0"
        >
          {/* Conversations List */}
          <Card className="lg:col-span-1 flex flex-col">
            <div className="p-4 border-b space-y-3">
              <Button
                onClick={() => setNewConversationDialogOpen(true)}
                className="w-full gap-2"
                variant="outline"
              >
                <Plus className="h-4 w-4" />
                Tin nhắn mới
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm phụ huynh, học sinh..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {filteredConversations.map((conversation) => (
                  <motion.button
                    key={conversation.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedConversation(conversation)}
                    className={cn(
                      "w-full p-3 rounded-lg text-left transition-all",
                      selectedConversation?.id === conversation.id
                        ? "bg-primary/10 border-2 border-primary/20"
                        : "hover:bg-accent border-2 border-transparent"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                        <AvatarImage src={conversation.parentAvatar} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                          {conversation.parentName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {conversation.parentName}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge
                              variant="secondary"
                              className="h-5 min-w-[20px] px-1.5 bg-primary text-primary-foreground text-xs"
                            >
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          {conversation.studentName} -{" "}
                          {conversation.studentClass}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(
                            conversation.lastMessageTime,
                            "dd/MM/yyyy HH:mm",
                            { locale: vi }
                          )}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarImage src={selectedConversation.parentAvatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {selectedConversation.parentName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-base font-semibold text-foreground">
                      {selectedConversation.parentName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PH của {selectedConversation.studentName} -{" "}
                      {selectedConversation.studentClass}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "flex gap-2",
                          message.isTeacher ? "justify-end" : "justify-start"
                        )}
                      >
                        {!message.isTeacher && (
                          <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                            <AvatarFallback className="bg-muted text-xs">
                              {message.senderName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg px-4 py-2",
                            message.isTeacher
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          )}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          <div
                            className={cn(
                              "flex items-center gap-1 mt-1",
                              message.isTeacher
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            )}
                          >
                            <span className="text-xs">
                              {format(message.timestamp, "HH:mm", {
                                locale: vi,
                              })}
                            </span>
                            {message.isTeacher && message.isRead && (
                              <CheckCheck className="h-3 w-3" />
                            )}
                          </div>
                        </div>
                        {message.isTeacher && (
                          <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              GV
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Textarea
                      placeholder="Nhập tin nhắn... (Enter để gửi, Shift+Enter để xuống dòng)"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="min-h-[60px] max-h-[120px] resize-none"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="shrink-0"
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center space-y-2">
                  <MessageSquare className="h-12 w-12 mx-auto opacity-50" />
                  <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>

      {/* New Conversation Dialog */}
      <Dialog
        open={newConversationDialogOpen}
        onOpenChange={setNewConversationDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Bắt đầu tin nhắn mới</DialogTitle>
            <DialogDescription>
              Chọn phụ huynh để bắt đầu cuộc trò chuyện
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm phụ huynh, học sinh, lớp..."
                value={parentSearchTerm}
                onChange={(e) => setParentSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {filteredParents.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {parentSearchTerm
                      ? "Không tìm thấy phụ huynh nào"
                      : "Tất cả phụ huynh đã có cuộc trò chuyện"}
                  </div>
                ) : (
                  filteredParents.map((parent) => (
                    <motion.button
                      key={parent.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleStartConversation(parent)}
                      className="w-full p-3 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-accent transition-all text-left"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                            {parent.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            {parent.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PH của {parent.studentName} - {parent.studentClass}
                          </p>
                        </div>
                        <Plus className="h-5 w-5 text-primary" />
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
