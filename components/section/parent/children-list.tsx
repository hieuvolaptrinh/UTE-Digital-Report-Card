// components/section/parent/children-list.tsx
"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ParentUser } from "@/mork-data";
import { GraduationCap, ChevronRight } from "lucide-react";
import Link from "next/link";

interface ChildrenListProps {
  parent: ParentUser;
}

export function ChildrenList({ parent }: ChildrenListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Danh sách con em</h3>
      {parent.children.map((child, index) => (
        <motion.div
          key={child.studentId}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <GlassCard hover padding="md">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {child.name.split(" ").pop()?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{child.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    <GraduationCap className="h-3 w-3 mr-1" />
                    Lớp {child.class}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    MSSV: {child.studentId}
                  </span>
                </div>
              </div>
              <Link href="/parent/child">
                <Button variant="ghost" size="sm" className="gap-2">
                  Xem chi tiết
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
