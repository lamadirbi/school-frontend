import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { AssignmentsProvider } from "@/context/AssignmentsContext";
import { AuthProvider } from "@/context/AuthContext";
import { SchoolProvider } from "@/context/SchoolContext";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "مدرسة غزتنا النموذجية الخاصة | Ghazatna Private Model School",
  description:
    "منصة تعليمية رقمية لمدرسة غزتنا — تعليم متميز، أخبار، برامج أكاديمية، وتسجيل إلكتروني.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full`}>
      <body className="min-h-full antialiased">
        <AuthProvider>
          <SchoolProvider>
            <AssignmentsProvider>{children}</AssignmentsProvider>
          </SchoolProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
