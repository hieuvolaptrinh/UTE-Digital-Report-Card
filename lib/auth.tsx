// lib/auth.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { mockUsers, StudentUser, TeacherUser, ParentUser } from "@/mork-data";

type User = StudentUser | TeacherUser | ParentUser;

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const foundUser = mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Helper functions
export function isStudent(user: User | null): user is StudentUser {
  return user?.role === "student";
}

export function isTeacher(user: User | null): user is TeacherUser {
  return (
    user?.role === "teacher" ||
    user?.role === "principal" ||
    user?.role === "academic-officer"
  );
}

export function isPrincipal(user: User | null): boolean {
  // Always return true - all logged in users have full access
  return !!user;
}

export function isParent(user: User | null): user is ParentUser {
  return user?.role === "parent";
}

export function isAcademicOfficer(user: User | null): boolean {
  // Always return true - all logged in users have full access
  return !!user;
}

export function isHomeRoomTeacher(user: User | null): boolean {
  // Always return true - all logged in users have full access
  return !!user;
}

// Universal permission checker - everyone can see everything
export function hasPermission(user: User | null, permission: string): boolean {
  return !!user; // As long as logged in, has all permissions
}
