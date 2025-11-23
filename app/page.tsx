"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { useAuth } from "@/lib/auth";
import {
  BookOpen,
  Users,
  ArrowRight,
  GraduationCap,
  Award,
  TrendingUp,
  Target,
  Heart,
  Lightbulb,
} from "lucide-react";

export default function HomePage() {
  const { user, logout } = useAuth();

  const headerUser = user
    ? {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role as
          | "student"
          | "teacher"
          | "parent"
          | "principal"
          | "academic-officer"
          | "admin",
      }
    : undefined;

  const teachers = [
    {
      name: "Nguyễn Văn Giáo Viên",
      subject: "Toán học",
      image: "/UTE.png",
      description: "Giáo viên chủ nhiệm lớp 10A1, giảng dạy môn Toán",
    },
    {
      name: "Lê Thị Cán Bộ Học Vụ",
      subject: "Văn học",
      image: "/UTE.png",
      description: "Cán bộ học vụ, quản lý học tập và điểm số",
    },
    {
      name: "Trần Minh Hiệu Trưởng",
      subject: "Hiệu trưởng",
      image: "/UTE.png",
      description: "Hiệu trưởng nhà trường, lãnh đạo và quản lý",
    },
  ];

  const stats = [
    { icon: Users, label: "Học sinh", value: "1500+", color: "text-blue-600" },
    {
      icon: GraduationCap,
      label: "Giáo viên",
      value: "80+",
      color: "text-green-600",
    },
    {
      icon: Award,
      label: "Giải thưởng",
      value: "50+",
      color: "text-orange-600",
    },
    {
      icon: TrendingUp,
      label: "Tỷ lệ đỗ ĐH",
      value: "95%",
      color: "text-purple-600",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Sứ mệnh",
      description:
        "Đào tạo thế hệ trẻ có năng lực, phẩm chất và trách nhiệm với xã hội",
    },
    {
      icon: Heart,
      title: "Tình yêu thương",
      description:
        "Môi trường học tập thân thiện, yêu thương và hỗ trợ lẫn nhau",
    },
    {
      icon: Lightbulb,
      title: "Sáng tạo",
      description: "Khuyến khích tư duy sáng tạo và phát triển toàn diện",
    },
  ];

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
          </div>

          <div className="container relative z-10 mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <Badge className="mb-4">Trường THPT Sư phạm Kỹ thuật</Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Trường THPT
                  <br />
                  <span className="text-primary">Sư phạm Kỹ thuật Đà Nẵng</span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Ngôi trường với truyền thống giáo dục ưu việt, cơ sở vật chất
                  hiện đại và đội ngũ giáo viên tận tâm. Nơi hun đúc tri thức và
                  nhân cách cho thế hệ tương lai.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/login">
                    <Button size="lg" className="gap-2">
                      <BookOpen className="h-5 w-5" />
                      Đăng nhập hệ thống
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="#about">
                    <Button size="lg" variant="outline">
                      Tìm hiểu thêm
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/UTE.png"
                    alt="Trường THPT Sư phạm Kỹ thuật"
                    width={600}
                    height={400}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
            >
              {stats.map((stat, index) => (
                <GlassCard key={index} padding="lg" className="text-center">
                  <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Về trường chúng tôi
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Trường THPT Sư phạm Kỹ thuật - Đại học Sư phạm Kỹ thuật Đà Nẵng
                là một trong những ngôi trường uy tín hàng đầu tại Đà Nẵng
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <GlassCard padding="lg" className="h-full">
                    <div className="flex flex-col items-center text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <value.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                      <p className="text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Teachers Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Đội ngũ giáo viên
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Giáo viên tận tâm, giàu kinh nghiệm và luôn đồng hành cùng học
                sinh
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {teachers.map((teacher, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <GlassCard padding="lg" className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <Image
                        src={teacher.image}
                        alt={teacher.name}
                        width={128}
                        height={128}
                        className="rounded-full"
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{teacher.name}</h3>
                    <Badge variant="outline" className="mb-3">
                      {teacher.subject}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {teacher.description}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* School Gallery Section */}
        <section className="py-20 bg-white/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Hình ảnh trường học
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Cơ sở vật chất hiện đại, môi trường học tập lý tưởng
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { src: "/truong2.jpg", alt: "Cổng trường" },
                { src: "/truong3.jpg", alt: "Khuôn viên trường" },
                { src: "/truong4.jpg", alt: "Phòng học" },
                { src: "/truong5.jpg", alt: "Sân trường" },
                { src: "/truong6.jpg", alt: "Thư viện" },
                { src: "/cong-truong.jpg", alt: "Cổng chính" },
              ].map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="relative aspect-4/3">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-linear-to-r from-primary/10 via-orange-500/10 to-primary/10">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Sẵn sàng bắt đầu?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Đăng nhập vào hệ thống học bạ điện tử để theo dõi kết quả học
                tập và quản lý thông tin
              </p>
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  <BookOpen className="h-5 w-5" />
                  Đăng nhập ngay
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
