import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { AppChrome } from "@/components/layout/AppChrome";

export const metadata: Metadata = {
  title: "Thư viện số Học thuật | Trường Đại học Trưng Vương",
  description: "Hệ thống thư viện số và diễn đàn học thuật tích hợp trợ lý AI thông minh, nhóm nghiên cứu và tra cứu tài liệu chuyên sâu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 flex flex-col dark:bg-slate-950 dark:text-white transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <AppChrome>
              {children}
            </AppChrome>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
