# 🚀 Quick Start Guide - UTE Digital Report Card

## 📦 Installation

Project đã cài đặt sẵn tất cả dependencies. Nếu cần cài lại:

```bash
npm install
```

## 🏃 Run Development Server

```bash
npm run dev
```

Server sẽ chạy tại: **http://localhost:3000**

## 🌐 Available Pages

### Public Pages

- **Home**: http://localhost:3000
- **Login**: http://localhost:3000/login

### Student Portal

- **Dashboard**: http://localhost:3000/student

### Parent Portal

- **Dashboard**: http://localhost:3000/parent

### Teacher/Principal Portal

- **Dashboard**: http://localhost:3000/teacher
- **Principal**: http://localhost:3000/principal (dùng chung layout với teacher)

## 🎨 Toggle Theme

Click icon **Sun/Moon** ở góc phải header để chuyển theme:

- ☀️ Light Mode
- 🌙 Dark Mode
- 💻 System (theo OS)

## 📱 Test Responsive

### Desktop (≥1024px)

- Sidebar đầy đủ (teacher layout)
- 4 columns grid

### Tablet (768px - 1023px)

- 2 columns grid
- Mobile menu

### Mobile (<768px)

- 1 column grid
- Hamburger menu
- Bottom navigation (có thể thêm)

## 🧪 Test User Roles

### Mock Users trong code:

**Student** (`app/(normal)/student/page.tsx`):

```typescript
{
  name: "Nguyễn Văn A",
  email: "nguyenvana@student.hcmute.edu.vn",
  role: "student"
}
```

**Teacher** (`app/(teacher)/layout.tsx`):

```typescript
{
  name: "Nguyễn Văn B",
  email: "nguyenvanb@hcmute.edu.vn",
  role: "teacher",
  subject: "Toán học",
  classes: ["10A1", "11A2"]
}
```

**Principal** - Thay đổi role trong layout:

```typescript
role: "principal"; // Thêm menu: Reports, Teachers, School
```

**Parent** (`app/(normal)/parent/page.tsx`):

```typescript
{
  name: "Trần Thị C",
  email: "tranthic@parent.hcmute.edu.vn",
  role: "parent"
}
```

## 🎯 Navigation Structure

### Header (Student/Parent/Guest)

```
Logo | Trang chủ | Thông báo | Kết quả | Thời khóa biểu | Avatar
```

### Sidebar (Teacher/Principal)

```
├── Tổng quan
├── Thời khóa biểu
├── Quản lý lớp
│   ├── Danh sách lớp
│   └── Học sinh
├── Nhập điểm
├── Hạnh kiểm
└── Gửi thông báo

Principal only:
├── Báo cáo thống kê
├── Quản lý giáo viên
└── Toàn trường
```

## 🎨 Customize Theme

### Edit Colors (`app/globals.css`)

```css
:root {
  --radius: 0.65rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.586 0.253 17.585);
  /* ... change values here ... */
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  /* ... change values here ... */
}
```

### Change Primary Color

Tìm tất cả `--primary` trong `globals.css` và thay đổi giá trị OKLCH.

**Tool**: https://oklch.com

## 📦 Add New Page

### 1. Create page file

**Student page example**:

```tsx
// app/(normal)/my-page/page.tsx
"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function MyPage() {
  return (
    <>
      <Header user={mockUser} onLogout={() => {}} />
      <main>{/* Your content */}</main>
      <Footer />
    </>
  );
}
```

**Teacher page example**:

```tsx
// app/(teacher)/my-page/page.tsx
export default function MyPage() {
  return <div className="p-6 lg:p-8">{/* Content auto có sidebar */}</div>;
}
```

### 2. Add to navigation

**For Header** (`components/layout/header.tsx`):

```typescript
const navigationConfig: NavItem[] = [
  // ... existing items
  {
    label: "My Page",
    href: "/my-page",
    icon: MyIcon,
    roles: ["student"],
  },
];
```

**For Sidebar** (`components/layout/teacher/sidebar.tsx`):

```typescript
const commonItems: SidebarItem[] = [
  // ... existing items
  {
    label: "My Page",
    href: "/teacher/my-page",
    icon: MyIcon,
  },
];
```

## 🛠️ Useful Commands

```bash
# Development
npm run dev

# Build production
npm run build

# Start production
npm start

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

## 🔍 Debug Tips

### 1. Check Console

Mở DevTools (F12) → Console để xem logs

### 2. Check Network

DevTools → Network → xem API calls (khi có backend)

### 3. React DevTools

Install extension: React Developer Tools

### 4. Check Tailwind Classes

Inspect element (Right click → Inspect) để xem classes được apply

## 📝 Common Issues

### Issue: Sidebar không hiện trên teacher pages

**Fix**: Đảm bảo layout.tsx trong `(teacher)` folder có:

```tsx
<TeacherSidebar user={mockUser} onLogout={() => {}} />
<main className="flex-1 lg:ml-[280px] pt-16 lg:pt-0">
```

### Issue: Theme toggle không hoạt động

**Fix**: Đảm bảo `ThemeProvider` wrap toàn bộ app trong root layout:

```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
</ThemeProvider>
```

### Issue: Icons không hiện

**Fix**: Import từ lucide-react:

```tsx
import { IconName } from "lucide-react";
```

### Issue: CSS variables không work

**Fix**: Đảm bảo Tailwind config map đúng colors:

```js
// tailwind.config.js (nếu có)
colors: {
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  // ...
}
```

## 🎓 Learning Resources

### Next.js 16

- Docs: https://nextjs.org/docs
- App Router: https://nextjs.org/docs/app

### Tailwind CSS 4

- Docs: https://tailwindcss.com/docs
- v4 Changes: https://tailwindcss.com/blog/tailwindcss-v4-alpha

### Shadcn/UI

- Docs: https://ui.shadcn.com
- Components: https://ui.shadcn.com/docs/components

### Motion (Framer Motion)

- Docs: https://motion.dev
- Examples: https://motion.dev/docs/examples

### TypeScript

- Handbook: https://www.typescriptlang.org/docs/handbook

## 📞 Support

**UTE - Trường ĐH Sư phạm Kỹ thuật TP.HCM**

- 📍 01 Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức
- 📞 (028) 3897 2092
- 📧 dhspkt@hcmute.edu.vn

---

**Happy coding! 🚀**
