# UTE Digital Report Card - Component Documentation

## 📋 Tổng quan

Hệ thống giao diện được thiết kế theo phong cách **Glassmorphism nhẹ + Minimal + Soft UI** cho dự án quản lý học bạ điện tử THPT.

## 🎨 Design System

### Phong cách thiết kế

- **Glassmorphism nhẹ**: backdrop-blur tối đa 6px, opacity 0.12-0.18
- **Soft shadows**: box-shadow mờ thay vì glass effect nặng
- **Rounded corners**: sử dụng CSS variables (--radius)
- **Minimal spacing**: clean và thoáng
- **Accessibility**: contrast ratio ≥ 4.5:1

### Color System

Sử dụng CSS variables đã định nghĩa trong `globals.css`:

- `--background`: Màu nền chính
- `--foreground`: Màu chữ chính
- `--primary`: Màu chủ đạo
- `--muted`: Màu phụ
- `--border`: Màu viền

### Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 📦 Components đã tạo

### 1. Header (`components/layout/header.tsx`)

**Mục đích**: Header chung cho tất cả các trang (student, parent, guest)

**Props**:

```typescript
interface HeaderProps {
  user?: HeaderUser; // Thông tin người dùng
  onLogout?: () => void; // Callback khi đăng xuất
  className?: string;
}

interface HeaderUser {
  name: string;
  email: string;
  avatar?: string;
  role: UserRole; // "student" | "teacher" | "principal" | "academic-officer" | "parent" | "admin" | "guest"
}
```

**Features**:

- Logo + tên hệ thống với animation
- Menu điều hướng responsive
- Toggle theme (light/dark/system)
- Avatar dropdown với thông tin user
- Mobile menu với Sheet component
- Glassmorphism backdrop
- Sticky header với blur effect

**Cách dùng**:

```tsx
import { Header } from "@/components/layout/header";

const user = {
  name: "Nguyễn Văn A",
  email: "student@hcmute.edu.vn",
  role: "student",
};

<Header user={user} onLogout={() => console.log("Logout")} />;
```

---

### 2. Footer (`components/layout/footer.tsx`)

**Mục đích**: Footer chung với thông tin liên hệ và links

**Props**:

```typescript
interface FooterProps {
  className?: string;
}
```

**Features**:

- 4 columns: Brand, Quick Links, Support, Contact
- Social media links (Facebook, Youtube, Instagram)
- Responsive grid layout
- Motion animations on scroll
- Glassmorphism backdrop

**Cách dùng**:

```tsx
import { Footer } from "@/components/layout/footer";

<Footer />;
```

---

### 3. Teacher Sidebar (`components/layout/teacher/sidebar.tsx`)

**Mục đích**: Sidebar navigation cho teacher, principal, academic officer

**Props**:

```typescript
interface TeacherSidebarProps {
  user: TeacherUser;
  onLogout?: () => void;
  className?: string;
}

interface TeacherUser {
  name: string;
  email: string;
  avatar?: string;
  role: TeacherRole; // "teacher" | "principal" | "academic-officer"
  subject?: string;
  classes?: string[];
}
```

**Features**:

- Collapsible sidebar (desktop)
- Mobile drawer
- Role-based navigation (principal có thêm menu)
- Nested menu items với animation
- Badge cho notifications
- User profile section
- Mobile top bar

**Navigation Items**:

- **Common** (Teacher, Academic Officer, Principal):

  - Tổng quan
  - Thời khóa biểu
  - Quản lý lớp (với submenu)
  - Nhập điểm
  - Hạnh kiểm
  - Gửi thông báo

- **Principal only**:
  - Báo cáo thống kê
  - Quản lý giáo viên
  - Toàn trường

**Cách dùng**:

```tsx
import { TeacherSidebar } from "@/components/layout/teacher/sidebar";

const teacherUser = {
  name: "Nguyễn Văn B",
  email: "teacher@hcmute.edu.vn",
  role: "teacher",
  subject: "Toán học",
  classes: ["10A1", "11A2"],
};

<TeacherSidebar user={teacherUser} onLogout={() => {}} />;
```

---

## 📄 Pages đã tạo

### 1. Login Page (`app/(normal)/login/page.tsx`)

**Features**:

- Split layout: branding (left) + form (right)
- Email/password form
- Remember me checkbox
- Show/hide password
- Loading state
- Mobile responsive
- Glassmorphism effects

---

### 2. Student Page (`app/(normal)/student/page.tsx`)

**Features**:

- Hero section với greeting
- Quick stats cards (GPA, semester, subjects, conduct)
- Header + Footer layout

---

### 3. Parent Page (`app/(normal)/parent/page.tsx`)

**Features**:

- Header + Footer layout
- Placeholder content (để phát triển tiếp)

---

### 4. Teacher Dashboard (`app/(teacher)/teacher/page.tsx`)

**Features**:

- Stats cards (class, students, lessons, pending grades)
- Today's schedule
- Classes list với progress bars
- Quick actions sidebar
- Notifications feed
- Statistics charts

---

## 🎭 Layouts

### 1. Normal Layout (`app/(normal)/layout.tsx`)

Dùng cho: login, student, parent pages

- Không có sidebar
- Sử dụng Header + Footer

### 2. Teacher Layout (`app/(teacher)/layout.tsx`)

Dùng cho: teacher, principal, academic-officer pages

- Có sidebar navigation
- Auto-adjust margin cho desktop
- Mobile-friendly

---

## 🚀 Cách sử dụng

### 1. Cài đặt (đã có sẵn)

```bash
npm install
```

### 2. Chạy dev server

```bash
npm run dev
```

### 3. Truy cập các trang

- Login: http://localhost:3000/login
- Student: http://localhost:3000/student
- Parent: http://localhost:3000/parent
- Teacher: http://localhost:3000/teacher
- Principal: http://localhost:3000/principal (dùng chung teacher layout)

---

## 🎨 Theme Customization

### Toggle Theme

Đã tích hợp `next-themes` và `ModeToggle` component:

```tsx
import { ModeToggle } from "@/components/toggle.theme";

<ModeToggle />;
```

### CSS Variables

Chỉnh sửa trong `app/globals.css`:

```css
:root {
  --radius: 0.65rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.586 0.253 17.585);
  /* ... */
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.976 0.001 286.375);
  /* ... */
}
```

---

## 📝 Quy tắc thiết kế (Design Constraints)

### ✅ DO

1. **Blur**: Sử dụng `backdrop-blur-[6px]` tối đa
2. **Opacity**: Glass panels tối đa 0.18 (vd: `bg-background/80`)
3. **Shadows**: Soft shadows `shadow-[0_2px_12px_rgba(0,0,0,0.04)]`
4. **Radius**: Dùng CSS variables `rounded-lg`, `rounded-xl`
5. **Colors**: Dùng semantic colors `bg-background`, `text-foreground`
6. **Contrast**: Text contrast ≥ 4.5:1
7. **Focus states**: Rõ ràng với `focus:ring-2 focus:ring-primary/20`
8. **Motion**: Smooth transitions với `motion/react`

### ❌ DON'T

1. Không lạm dụng blur (max 6px)
2. Không opacity quá cao (max 0.18 cho glass)
3. Không dùng colors hard-coded (dùng CSS vars)
4. Không skip keyboard focus states
5. Không dùng `gradient-to-*` (dùng `linear-to-*` theo Tailwind v4)

---

## 🔧 Kỹ thuật sử dụng

### Animation với Motion

```tsx
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>;
```

### Responsive Classes

```tsx
// Mobile first
<div className="flex flex-col lg:flex-row gap-4">

// Spacing
<div className="p-4 sm:p-6 lg:p-8">

// Text size
<h1 className="text-2xl sm:text-3xl lg:text-4xl">
```

### Glassmorphism Pattern

```tsx
<div className="bg-background/80 backdrop-blur-[6px] border border-border/40">
  Content
</div>
```

---

## 📚 Shadcn/UI Components sử dụng

- Avatar, AvatarFallback, AvatarImage
- Badge
- Button
- Card, CardHeader, CardTitle, CardDescription, CardContent
- Checkbox
- Dialog
- DropdownMenu
- Input
- Label
- Progress
- ScrollArea
- Separator
- Sheet
- Tooltip

---

## 🎯 Next Steps

### Các trang cần phát triển tiếp:

**Student**:

- [ ] Xem bảng điểm chi tiết
- [ ] Gửi yêu cầu cấp phát học bạ
- [ ] Xem thời khóa biểu chi tiết
- [ ] Xem thông tin cá nhân
- [ ] Đổi mật khẩu

**Teacher**:

- [ ] Xem thời khóa biểu chi tiết
- [ ] Quản lý danh sách lớp
- [ ] Nhập điểm học sinh
- [ ] Nhập hạnh kiểm
- [ ] Gửi thông báo phụ huynh
- [ ] Xem hồ sơ học sinh

**Principal**:

- [ ] Báo cáo thống kê toàn trường
- [ ] Quản lý giáo viên
- [ ] Duyệt học bạ
- [ ] Xem báo cáo từ các giáo viên

**Parent**:

- [ ] Xem điểm con em
- [ ] Xem hạnh kiểm
- [ ] Nhận thông báo từ giáo viên
- [ ] Xem thời khóa biểu

---

## 📞 Support

**Trường Đại học Sư phạm Kỹ thuật TP.HCM**

- 📍 01 Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức, TP. HCM
- 📞 (028) 3897 2092
- 📧 dhspkt@hcmute.edu.vn

---

## 🎓 Actors trong hệ thống

1. **Guest** - Khách vãng lai
2. **Student** - Học sinh
3. **Parent** - Phụ huynh
4. **Teacher** - Giáo viên
5. **Academic Officer** - Giáo viên chủ nhiệm
6. **Principal** - Hiệu trưởng
7. **Admin** - Quản trị viên hệ thống

---

**Created with ❤️ using Next.js, TypeScript, Tailwind CSS, shadcn/ui, motion**
