"use client";

import * as React from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ModeToggle } from "@/components/toggle.theme";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin, user } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
    remember: false,
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      switch (user.role) {
        case "student":
          router.push("/student");
          break;
        case "teacher":
          router.push("/teacher");
          break;
        case "academic-officer":
          router.push("/academic-officer/list-lop");
          break;
        case "parent":
          router.push("/parent");
          break;
        case "principal":
          router.push("/teacher/principal");
          break;
        default:
          router.push("/");
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await authLogin(formData.username, formData.password);

      if (!success) {
        setError("Tên đăng nhập hoặc mật khẩu không chính xác");
        setIsLoading(false);
        return;
      }

      // Auth context will handle user storage and the useEffect will redirect
      setIsLoading(false);
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại");
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary/10 via-primary/5 to-background p-12 items-center justify-center overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 p-3 ring-2 ring-primary/20">
              <BookOpen className="h-full w-full text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                UTE Digital
              </h1>
              <p className="text-sm text-muted-foreground">Học bạ điện tử</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-foreground leading-tight">
              Hệ thống quản lý
              <br />
              <span className="text-primary">học bạ điện tử</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nền tảng hiện đại, an toàn và tiện lợi giúp quản lý thông tin học
              sinh, theo dõi kết quả học tập một cách hiệu quả.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, label: "Bảo mật cao" },
              { icon: Sparkles, label: "Dễ sử dụng" },
              { icon: BookOpen, label: "Đầy đủ tính năng" },
              { icon: ArrowRight, label: "Truy cập nhanh" },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3 rounded-lg bg-background/50 backdrop-blur-sm border border-border/40 p-4"
              >
                <feature.icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {feature.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Header */}
          <div className="space-y-4">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center gap-3 justify-center mb-8">
              <div className="h-12 w-12 rounded-xl bg-primary/10 p-2 ring-1 ring-primary/20">
                <BookOpen className="h-full w-full text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  UTE Digital
                </h1>
                <p className="text-xs text-muted-foreground">Học bạ điện tử</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Đăng nhập
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Chào mừng bạn quay trở lại
                </p>
              </div>
              <ModeToggle />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <Alert
                variant="destructive"
                className="backdrop-blur-sm bg-destructive/10"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Tên đăng nhập
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="HS001"
                    value={formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    className="pl-10 h-11 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="pl-10 pr-10 h-11 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) =>
                    handleChange("remember", checked as boolean)
                  }
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full gap-2 font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-4 w-4 border-2 border-background/30 border-t-background rounded-full"
                  />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                Đăng ký ngay
              </Link>
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Chính sách bảo mật
              </Link>
              <span>•</span>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
