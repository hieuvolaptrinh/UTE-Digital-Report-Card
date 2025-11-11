"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { UserRole } from "@/components/layout/header";

// Mock parent user - replace with actual authentication
const mockParentUser = {
  name: "Trần Thị C",
  email: "tranthic@parent.hcmute.edu.vn",
  avatar: "",
  role: "parent" as UserRole,
};

export default function ParentPage() {
  const handleLogout = () => {
    console.log("Logout");
  };

  return (
    <>
      <Header user={mockParentUser} onLogout={handleLogout} />
      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 sm:px-6 py-8"
        >
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 via-background to-background border border-border/40 p-8 md:p-12">
              <div className="relative z-10 space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Trang phụ huynh
                </h1>
                <p className="text-muted-foreground text-lg">
                  Theo dõi kết quả học tập của con em
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl bg-background/80 backdrop-blur-sm border border-border/40 p-8 text-center"
            >
              <p className="text-muted-foreground">
                Nội dung trang phụ huynh sẽ được phát triển tiếp...
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
