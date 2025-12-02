"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Calendar, FileText, Home } from "lucide-react";

const navigation = [
  {
    name: "Bảng điểm",
    href: "/student",
    icon: Home,
    description: "Xem tổng quan điểm số",
  },
  {
    name: "Thời khóa biểu",
    href: "/student/schedule",
    icon: Calendar,
    description: "Lịch học trong tuần",
  },
  {
    name: "Yêu cầu học bạ",
    href: "/student/transcript-request",
    icon: FileText,
    description: "Gửi yêu cầu cấp học bạ",
  },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Show navigation on main student pages
  const showNavigation =
    pathname === "/student" ||
    pathname === "/student/schedule" ||
    pathname === "/student/transcript-request";

  return (
    <div className="flex min-h-screen flex-col">
      {showNavigation && (
        <nav className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg border-b border-white/10 sticky top-16 z-10">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide scroll-smooth" style={{ scrollBehavior: 'smooth' }}>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
      {children}
    </div>
  );
}
