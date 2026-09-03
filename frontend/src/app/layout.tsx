import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { MSWProvider } from "@/mocks/MSWProvider";
import { AppChrome } from "@/components/layout/AppChrome";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

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
      <body className={`${inter.className} ${inter.variable} ${playfair.variable} min-h-screen bg-white text-gray-900 flex flex-col dark:bg-slate-950 dark:text-white transition-colors duration-300`}>
        <MSWProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
              <AppChrome>
                {children}
              </AppChrome>
            </AuthProvider>
          </ThemeProvider>
        </MSWProvider>
      </body>
    </html>
  );
}
