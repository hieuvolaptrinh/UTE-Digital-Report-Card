"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  Bell,
  BookOpen,
  Calendar,
  ChevronDown,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  User,
  Users,
  Settings,
  Lock,
  MessageSquare,
  ClipboardList,
} from "lucide-react";
import { ModeToggle } from "@/components/toggle.theme";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Types
export type UserRole =
  | "student"
  | "teacher"
  | "principal"
  | "academic-officer"
  | "parent"
  | "admin"
  | "guest";

export interface HeaderUser {
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
  children?: NavItem[];
}

export interface HeaderProps {
  user?: HeaderUser;
  onLogout?: () => void;
  className?: string;
}

// Navigation configuration
const navigationConfig: NavItem[] = [
  {
    label: "Trang chủ",
    href: "/",
    icon: Home,
    roles: [
      "student",
      "teacher",
      "principal",
      "academic-officer",
      "parent",
      "admin",
      "guest",
    ],
  },
  {
    label: "Thông báo",
    href: "/notifications",
    icon: Bell,
    roles: ["student", "teacher", "principal", "academic-officer", "parent"],
  },
  {
    label: "Kết quả học tập",
    href: "/student/grades",
    icon: BookOpen,
    roles: ["student"],
  },
  {
    label: "Thời khóa biểu",
    href: "/student/schedule",
    icon: Calendar,
    roles: ["student"],
  },
  {
    label: "Yêu cầu học bạ",
    href: "/student/transcript-request",
    icon: FileText,
    roles: ["student"],
  },
  {
    label: "Giáo viên",
    href: "/teacher",
    icon: LayoutDashboard,
    roles: ["teacher", "principal", "academic-officer"],
    children: [
      { label: "Thời khóa biểu", href: "/teacher/schedule", icon: Calendar },
      { label: "Quản lý lớp", href: "/teacher/classes", icon: Users },
      { label: "Nhập điểm", href: "/teacher/grades", icon: ClipboardList },
      { label: "Hạnh kiểm", href: "/teacher/conduct", icon: FileText },
      {
        label: "Gửi thông báo",
        href: "/teacher/notifications",
        icon: MessageSquare,
      },
    ],
  },
  {
    label: "Quản lý",
    href: "/admin",
    icon: Settings,
    roles: ["admin"],
  },
];

export function Header({ user, onLogout, className }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState<string | null>(null);

  // Filter nav items based on user role
  const filteredNav = user
    ? navigationConfig.filter((item) => item.roles?.includes(user.role))
    : navigationConfig.filter((item) => item.roles?.includes("guest"));

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-50 w-full",
        "bg-background/80 backdrop-blur-[6px]",
        "border-b border-border/40",
        "shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.05 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="relative h-10 w-10 rounded-lg bg-primary/10 p-1.5 ring-1 ring-primary/20"
            >
              <div className="h-full w-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </motion.div>
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                UTE Digital
              </span>
              <span className="text-xs text-muted-foreground">
                Học bạ điện tử
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {filteredNav.map((item) => {
              if (item.children && item.children.length > 0) {
                return (
                  <DropdownMenu
                    key={item.href}
                    open={dropdownOpen === item.href}
                    onOpenChange={(open) =>
                      setDropdownOpen(open ? item.href : null)
                    }
                  >
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "gap-1.5 font-medium text-sm",
                          isActive(item.href)
                            ? "text-primary bg-primary/8"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        )}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.label}
                        <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-48 bg-background/95 backdrop-blur-[6px] border-border/50"
                    >
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <Link
                            href={child.href}
                            className={cn(
                              "flex items-center gap-2 cursor-pointer",
                              isActive(child.href) &&
                                "text-primary bg-primary/8"
                            )}
                          >
                            {child.icon && <child.icon className="h-4 w-4" />}
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "gap-1.5 font-medium text-sm",
                      isActive(item.href)
                        ? "text-primary bg-primary/8"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ModeToggle />

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-background/95 backdrop-blur-[6px] border-border/50"
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="text-xs text-primary font-medium capitalize mt-1">
                        {user.role === "academic-officer"
                          ? "Giáo viên chủ nhiệm"
                          : user.role === "teacher"
                          ? "Giáo viên"
                          : user.role === "principal"
                          ? "Hiệu trưởng"
                          : user.role === "student"
                          ? "Học sinh"
                          : user.role === "parent"
                          ? "Phụ huynh"
                          : user.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Thông tin cá nhân
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile/change-password"
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Đổi mật khẩu
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Đăng nhập
                </Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] sm:w-[320px] bg-background/95 backdrop-blur-[6px]"
              >
                <SheetHeader>
                  <SheetTitle className="text-left">Menu điều hướng</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-2 mt-6">
                  {filteredNav.map((item) => {
                    if (item.children && item.children.length > 0) {
                      return (
                        <div key={item.href} className="space-y-1">
                          <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-foreground">
                            {item.icon && <item.icon className="h-4 w-4" />}
                            {item.label}
                          </div>
                          <div className="pl-4 space-y-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setMobileOpen(false)}
                              >
                                <Button
                                  variant="ghost"
                                  className={cn(
                                    "w-full justify-start gap-2 text-sm",
                                    isActive(child.href)
                                      ? "text-primary bg-primary/8"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {child.icon && (
                                    <child.icon className="h-4 w-4" />
                                  )}
                                  {child.label}
                                </Button>
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className={cn(
                            "w-full justify-start gap-2",
                            isActive(item.href)
                              ? "text-primary bg-primary/8"
                              : "text-muted-foreground"
                          )}
                        >
                          {item.icon && <item.icon className="h-4 w-4" />}
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
