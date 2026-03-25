import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "뜨다 아티클",
  description: "뜨다의 아티클과 인터뷰를 모아보는 페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-neutral-100 flex justify-center`}
      >
        <div className="relative flex min-h-screen w-full max-w-[430px] bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}
