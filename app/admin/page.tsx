"use client";

import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { mockUsers } from "@/mork-data/users";
import { Users, Edit, Trash2, Search, UserPlus, Shield } from "lucide-react";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    role: "student",
    phone: "",
  });

  const filteredUsers = mockUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      student: "Học sinh",
      teacher: "Giáo viên",
      principal: "Hiệu trưởng",
      "academic-officer": "Cán bộ học vụ",
      parent: "Phụ huynh",
      admin: "Quản trị viên",
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colorMap: Record<string, string> = {
      student: "bg-blue-500/10 text-blue-600",
      teacher: "bg-green-500/10 text-green-600",
      principal: "bg-purple-500/10 text-purple-600",
      "academic-officer": "bg-orange-500/10 text-orange-600",
      parent: "bg-pink-500/10 text-pink-600",
      admin: "bg-red-500/10 text-red-600",
    };
    return colorMap[role] || "bg-gray-500/10 text-gray-600";
  };

  const handleAddUser = () => {
    console.log("Adding user:", newUser);
    setIsAddDialogOpen(false);
    setNewUser({
      username: "",
      password: "",
      email: "",
      name: "",
      role: "student",
      phone: "",
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      console.log("Deleting user:", userId);
    }
  };

  const headerUser = {
    name: user?.name || "Admin",
    email: user?.email || "admin@ute.udn.vn",
    avatar: user?.avatar || "",
    role: "admin" as const,
  };

  const userStats = {
    total: mockUsers.length,
    students: mockUsers.filter((u) => u.role === "student").length,
    teachers: mockUsers.filter((u) => u.role === "teacher").length,
    principals: mockUsers.filter((u) => u.role === "principal").length,
    academicOfficers: mockUsers.filter((u) => u.role === "academic-officer")
      .length,
    parents: mockUsers.filter((u) => u.role === "parent").length,
  };

  return (
    <>
      <Header user={headerUser} onLogout={logout} />
      <main className="min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-red-500/10">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">
                  Quản trị hệ thống
                </h1>
                <p className="text-muted-foreground mt-1">
                  Quản lý tài khoản người dùng
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <GlassCard padding="md">
                <div className="text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{userStats.total}</div>
                  <div className="text-xs text-muted-foreground">Tổng số</div>
                </div>
              </GlassCard>
              <GlassCard padding="md">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {userStats.students}
                  </div>
                  <div className="text-xs text-muted-foreground">Học sinh</div>
                </div>
              </GlassCard>
              <GlassCard padding="md">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {userStats.teachers}
                  </div>
                  <div className="text-xs text-muted-foreground">Giáo viên</div>
                </div>
              </GlassCard>
              <GlassCard padding="md">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {userStats.principals}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Hiệu trưởng
                  </div>
                </div>
              </GlassCard>
              <GlassCard padding="md">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {userStats.academicOfficers}
                  </div>
                  <div className="text-xs text-muted-foreground">CBHV</div>
                </div>
              </GlassCard>
              <GlassCard padding="md">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">
                    {userStats.parents}
                  </div>
                  <div className="text-xs text-muted-foreground">Phụ huynh</div>
                </div>
              </GlassCard>
            </div>
          </motion.div>

          {/* Filters and Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard padding="md" className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên, username, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả vai trò</SelectItem>
                    <SelectItem value="student">Học sinh</SelectItem>
                    <SelectItem value="teacher">Giáo viên</SelectItem>
                    <SelectItem value="principal">Hiệu trưởng</SelectItem>
                    <SelectItem value="academic-officer">CBHV</SelectItem>
                    <SelectItem value="parent">Phụ huynh</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Thêm tài khoản
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Thêm tài khoản mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Họ và tên</Label>
                        <Input
                          value={newUser.name}
                          onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                          }
                          placeholder="Nguyễn Văn A"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Username</Label>
                        <Input
                          value={newUser.username}
                          onChange={(e) =>
                            setNewUser({ ...newUser, username: e.target.value })
                          }
                          placeholder="nguyenvana"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                          type="email"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                          placeholder="email@ute.udn.vn"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Mật khẩu</Label>
                        <Input
                          type="password"
                          value={newUser.password}
                          onChange={(e) =>
                            setNewUser({ ...newUser, password: e.target.value })
                          }
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Vai trò</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(value) =>
                            setNewUser({ ...newUser, role: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Học sinh</SelectItem>
                            <SelectItem value="teacher">Giáo viên</SelectItem>
                            <SelectItem value="principal">
                              Hiệu trưởng
                            </SelectItem>
                            <SelectItem value="academic-officer">
                              Cán bộ học vụ
                            </SelectItem>
                            <SelectItem value="parent">Phụ huynh</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Số điện thoại</Label>
                        <Input
                          value={newUser.phone}
                          onChange={(e) =>
                            setNewUser({ ...newUser, phone: e.target.value })
                          }
                          placeholder="0901234567"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddDialogOpen(false)}
                      >
                        Hủy
                      </Button>
                      <Button onClick={handleAddUser}>Thêm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </GlassCard>

            {/* Users Table */}
            <GlassCard padding="none">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>SĐT</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.username}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getRoleBadgeColor(u.role)}
                          >
                            {getRoleLabel(u.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>{u.phone || "—"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => console.log("Edit user:", u.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
