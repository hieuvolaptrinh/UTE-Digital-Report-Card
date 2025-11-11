"use client";

import * as React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  Users,
  Shield,
  Sparkles,
  ArrowRight,
  GraduationCap,
  FileText,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-background to-background">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="container relative z-10 mx-auto px-4 sm:px-6 py-20 lg:py-32">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  <span>Hệ thống học bạ điện tử hiện đại</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  UTE Digital
                  <br />
                  <span className="text-primary">Report Card</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Nền tảng quản lý học bạ điện tử an toàn, tiện lợi dành cho học
                  sinh THPT. Theo dõi kết quả học tập, quản lý thông tin một
                  cách hiệu quả.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Link href="/login">
                  <Button
                    size="lg"
                    className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                  >
                    Đăng nhập ngay
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="gap-2">
                    Tìm hiểu thêm
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 lg:py-32 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-4"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Tính năng nổi bật
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Hệ thống được thiết kế đặc biệt để đáp ứng nhu cầu quản lý học
                  bạ hiện đại
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: Shield,
                    title: "Bảo mật cao",
                    description:
                      "Mã hóa dữ liệu, bảo vệ thông tin cá nhân tuyệt đối",
                    color: "text-blue-500",
                    bgColor: "bg-blue-500/10",
                  },
                  {
                    icon: Sparkles,
                    title: "Dễ sử dụng",
                    description:
                      "Giao diện thân thiện, dễ dàng thao tác cho mọi đối tượng",
                    color: "text-purple-500",
                    bgColor: "bg-purple-500/10",
                  },
                  {
                    icon: BookOpen,
                    title: "Đầy đủ tính năng",
                    description:
                      "Quản lý điểm, hạnh kiểm, thời khóa biểu đầy đủ",
                    color: "text-green-500",
                    bgColor: "bg-green-500/10",
                  },
                  {
                    icon: ArrowRight,
                    title: "Truy cập nhanh",
                    description:
                      "Xem thông tin mọi lúc, mọi nơi trên mọi thiết bị",
                    color: "text-orange-500",
                    bgColor: "bg-orange-500/10",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full border-border/40 hover:border-primary/20 transition-all hover:shadow-lg">
                      <CardHeader>
                        <div
                          className={`${feature.bgColor} ${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}
                        >
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-xl">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {feature.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* User Roles Section */}
        <section className="py-20 lg:py-32 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-4"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Dành cho mọi đối tượng
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Hệ thống hỗ trợ đầy đủ chức năng cho học sinh, giáo viên, phụ
                  huynh và quản lý
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: GraduationCap,
                    title: "Học sinh",
                    features: [
                      "Xem điểm số",
                      "Thời khóa biểu",
                      "Yêu cầu học bạ",
                      "Thông tin cá nhân",
                    ],
                    color: "text-blue-500",
                    bgColor: "bg-blue-500/10",
                  },
                  {
                    icon: Users,
                    title: "Giáo viên",
                    features: [
                      "Nhập điểm",
                      "Quản lý lớp",
                      "Nhập hạnh kiểm",
                      "Gửi thông báo",
                    ],
                    color: "text-green-500",
                    bgColor: "bg-green-500/10",
                  },
                  {
                    icon: FileText,
                    title: "Phụ huynh",
                    features: [
                      "Xem điểm con",
                      "Nhận thông báo",
                      "Theo dõi hạnh kiểm",
                      "Liên hệ giáo viên",
                    ],
                    color: "text-purple-500",
                    bgColor: "bg-purple-500/10",
                  },
                ].map((role, index) => (
                  <motion.div
                    key={role.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full border-border/40">
                      <CardHeader>
                        <div
                          className={`${role.bgColor} ${role.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}
                        >
                          <role.icon className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-2xl">{role.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {role.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-2 text-muted-foreground"
                            >
                              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 bg-background">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-background overflow-hidden">
                <CardContent className="p-8 md:p-12 text-center space-y-6">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                      Sẵn sàng bắt đầu?
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Đăng nhập ngay để trải nghiệm hệ thống quản lý học bạ điện
                      tử hiện đại
                    </p>
                  </div>
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                    >
                      Đăng nhập ngay
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
