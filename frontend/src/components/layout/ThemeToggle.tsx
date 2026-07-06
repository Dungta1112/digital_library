"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button 
        className="relative inline-flex items-center justify-center w-9 h-9 p-0 rounded-full border-2 border-gray-200 opacity-50 cursor-default bg-white"
        aria-hidden="true"
      >
        <span className="sr-only">Đang tải theme</span>
      </button>
    );
  }

  return (
    <button
      className="relative inline-flex items-center justify-center w-9 h-9 p-0 rounded-full border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="Chuyển chế độ giao diện"
    >
      <Sun className="h-4 w-4 transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Chuyển chế độ giao diện</span>
    </button>
  );
}
