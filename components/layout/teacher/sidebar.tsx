"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Calendar,
  Users,
  MessageSquare,
  Home,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Menu,
  X,
  BarChart3,
  UserCog,
  FileText,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/toggle.theme";

// Types
export type TeacherRole = "teacher" | "principal" | "academic-officer";

export interface TeacherUser {
  name: string;
  email: string;
  avatar?: string;
  role: TeacherRole;
  subject?: string;
  classes?: string[];
}

export interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  roles?: TeacherRole[];
  children?: SidebarItem[];
}

export interface TeacherSidebarProps {
  user: TeacherUser;
  onLogout?: () => void;
  className?: string;
}

// Sidebar navigation configuration
const getSidebarItems = (role: TeacherRole): SidebarItem[] => {
  // Teacher items
  const teacherItems: SidebarItem[] = [
    { label: "Tổng quan", href: "/teacher", icon: Home, roles: ["teacher", "academic-officer", "principal"] },
    { label: "Thời khóa biểu", href: "/teacher/schedule", icon: Calendar, roles: ["teacher", "academic-officer", "principal"] },
    { label: "Lớp chủ nhiệm", href: "/teacher/homeroom-teacher", icon: Users, roles: ["teacher", "academic-officer", "principal"] },
    { label: "Lớp giảng dạy", href: "/teacher/class", icon: BookOpen, roles: ["teacher", "academic-officer", "principal"] },
    { label: "Nhập hạnh kiểm", href: "/teacher/hanh-kiem", icon: FileText, roles: ["teacher", "academic-officer", "principal"] },
    { label: "Yêu cầu sửa điểm", href: "/teacher/yeu-cau-sua-diem", icon: Bell, roles: ["teacher", "academic-officer"] },
    { label: "Gửi thông báo", href: "/teacher/gui-thong-bao", icon: MessageSquare, roles: ["teacher", "academic-officer", "principal"] },
  ];

  // Principal exclusive items
  const principalItems: SidebarItem[] = [
    { label: "Quản lý giáo viên", href: "/teacher/principal/teacher", icon: UserCog, roles: ["principal"] },
    { label: "Thông báo toàn trường", href: "/teacher/principal/notification", icon: MessageSquare, roles: ["principal"] },
    { label: "Duyệt yêu cầu sửa điểm", href: "/teacher/principal/list-sua-diem", icon: FileText, roles: ["principal"] },
    { label: "Báo cáo thống kê", href: "/teacher/principal", icon: BarChart3, roles: ["principal"] },
  ];

  // Filter items based on role
  if (role === "principal") {
    return [...teacherItems.filter(item => item.roles?.includes(role)), ...principalItems];
  }

  if (role === "academic-officer") {
    return teacherItems.filter(item => item.roles?.includes(role));
  }

  // Default teacher role
  return teacherItems.filter(item => item.roles?.includes(role));
};

function SidebarNav({
  items,
  collapsed,
  mobileOpen,
  expandedItems,
  toggleExpanded,
  isActive,
}: {
  items: SidebarItem[];
  collapsed: boolean;
  mobileOpen: boolean;
  expandedItems: string[];
  toggleExpanded: (href: string) => void;
  isActive: (href: string) => boolean;
}) {
  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedItems.includes(item.href);
        const active = isActive(item.href);

        return (
          <div key={item.href}>
            {hasChildren ? (
              <>
                <button
                  onClick={() => toggleExpanded(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {(!collapsed || mobileOpen) && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="h-5 px-1.5 text-xs bg-primary text-primary-foreground"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isExpanded && "rotate-90"
                        )}
                      />
                    </>
                  )}
                </button>
                <AnimatePresence>
                  {isExpanded &&
                    (!collapsed || mobileOpen) &&
                    item.children && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 mt-1 space-y-1 overflow-hidden"
                      >
                        {item.children.map((child) => (
                          <Link key={child.href} href={child.href}>
                            <button
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                                isActive(child.href)
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
                              )}
                            >
                              <child.icon className="h-4 w-4 shrink-0" />
                              <span className="flex-1 text-left">
                                {child.label}
                              </span>
                            </button>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                </AnimatePresence>
              </>
            ) : (
              <Link href={item.href}>
                <button
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {(!collapsed || mobileOpen) && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="h-5 px-1.5 text-xs bg-primary text-primary-foreground"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </button>
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export function TeacherSidebar({
  user,
  onLogout,
  className,
}: TeacherSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const sidebarItems = getSidebarItems(user.role);

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    );
  };

  const isActive = (href: string) => {
    if (href === "/teacher") return pathname === "/teacher";
    return pathname.startsWith(href);
  };

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/40">
        <Link href="/teacher" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="h-10 w-10 rounded-lg bg-primary/10 p-2 ring-1 ring-primary/20"
          >
            <BookOpen className="h-full w-full text-primary" />
          </motion.div>
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">
                UTE Digital
              </span>
              <span className="text-xs text-muted-foreground">Quản lý</span>
            </div>
          )}
        </Link>
        {!mobileOpen && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hidden lg:flex"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          {(!collapsed || mobileOpen) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
              <Badge
                variant="secondary"
                className="mt-1 text-xs capitalize bg-primary/10 text-primary border-0"
              >
                {user.role === "principal"
                  ? "Hiệu trưởng"
                  : user.role === "academic-officer"
                  ? "GVCN"
                  : "Giáo viên"}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <SidebarNav
          items={sidebarItems}
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          expandedItems={expandedItems}
          toggleExpanded={toggleExpanded}
          isActive={isActive}
        />
      </ScrollArea>

      {/* Footer Actions */}
      <div className="p-3 border-t border-border/40 space-y-2">
        <Link href="/teacher/settings">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3",
              collapsed && !mobileOpen && "justify-center px-0"
            )}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {(!collapsed || mobileOpen) && <span>Cài đặt</span>}
          </Button>
        </Link>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10",
            collapsed && !mobileOpen && "justify-center px-0"
          )}
          onClick={onLogout}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {(!collapsed || mobileOpen) && <span>Đăng xuất</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "hidden lg:flex fixed left-0 top-0 h-screen flex-col bg-background/80 backdrop-blur-[6px] border-r border-border/40 z-40",
          className
        )}
      >
        {renderSidebarContent()}
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-0 top-0 h-screen w-[280px] bg-background border-r border-border/40 z-50 lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border/40">
                <Link href="/teacher" className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 p-2 ring-1 ring-primary/20">
                    <BookOpen className="h-full w-full text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">
                      UTE Digital
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Quản lý
                    </span>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {renderSidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-[6px] border-b border-border/40 z-40 flex items-center justify-between px-4">
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/teacher" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 p-1.5 ring-1 ring-primary/20">
            <BookOpen className="h-full w-full text-primary" />
          </div>
          <span className="text-sm font-bold text-foreground">UTE Digital</span>
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm text-muted-foreground">
                Không có thông báo mới
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
}
