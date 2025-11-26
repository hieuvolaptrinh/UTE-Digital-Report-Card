"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface FooterProps {
  className?: string;
}

const footerLinks = {
  quickLinks: [
    { label: "Về trường", href: "/about" },
    { label: "Thông báo", href: "/notifications" },
    { label: "Liên hệ", href: "/contact" },
    { label: "Câu hỏi thường gặp", href: "/faq" },
  ],
  support: [
    { label: "Hướng dẫn sử dụng", href: "/guide" },
    { label: "Điều khoản sử dụng", href: "/terms" },
    { label: "Chính sách bảo mật", href: "/privacy" },
    { label: "Hỗ trợ kỹ thuật", href: "/support" },
  ],
  contact: {
    address: "01 Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh",
    phone: "(028) 3897 2092",
    email: "dhspkt@ute.udn.vn",
  },
  social: [
    { label: "Facebook", icon: Facebook, href: "https://facebook.com/dhspkt" },
    { label: "Youtube", icon: Youtube, href: "https://youtube.com/@HCMUTE" },
    {
      label: "Instagram",
      icon: Instagram,
      href: "https://instagram.com/hcmute",
    },
  ],
};

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={cn(
        "relative w-full border-t border-border/40",
        "bg-background/80 backdrop-blur-[6px]",
        "mt-auto",
        className
      )}
    >
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 rounded-xl bg-primary/10 p-2 ring-1 ring-primary/20 transition-all group-hover:ring-primary/40">
                <BookOpen className="h-full w-full text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-foreground">
                  UTE Digital
                </span>
                <span className="text-xs text-muted-foreground">
                  Học bạ điện tử
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Hệ thống quản lý học bạ điện tử hiện đại, an toàn và tiện lợi dành
              cho học sinh THPT.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2">
              {footerLinks.social.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <social.icon className="h-4 w-4" />
                  <span className="sr-only">{social.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold text-foreground">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {link.label}
                    </span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold text-foreground">Hỗ trợ</h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {link.label}
                    </span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold text-foreground">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground leading-relaxed">
                  {footerLinks.contact.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a
                  href={`tel:${footerLinks.contact.phone.replace(/\s/g, "")}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {footerLinks.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a
                  href={`mailto:${footerLinks.contact.email}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {footerLinks.contact.email}
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center sm:text-left"
          >
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-foreground">
              Trường Đại học Sư phạm Kỹ thuật
            </span>
            . All rights reserved.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center gap-4"
          >
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <span className="text-border">•</span>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <span className="text-border">•</span>
            <Link
              href="/cookies"
              className="hover:text-foreground transition-colors"
            >
              Cookies
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Decorative Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/20 to-transparent" />
    </footer>
  );
}
