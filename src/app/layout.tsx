import { Analytics } from "@vercel/analytics/next";
import { Geist, Geist_Mono, Jua } from "next/font/google";

import type { Metadata, Viewport } from "next";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jua = Jua({
  variable: "--font-jua",
  weight: "400",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteName = "Spill the Onion";
const siteDescription =
  "오늘 있었던 일을 양파에게 마구 쏟아내면 분노를 먹은 양파가 무럭무럭 자라는 감정 배출 서비스";

const ogImage = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: siteDescription,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteName,
  description: siteDescription,
  keywords: ["비난양파", "감정 해소", "스트레스 해소", "뒷담화", "칭찬양파", "웹토이"],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteUrl,
    siteName: siteName,
    locale: "ko_KR",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
    images: [ogImage.url],
  },
};

export const viewport: Viewport = {
  interactiveWidget: "resizes-content",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${jua.variable} h-full overflow-hidden antialiased`}
    >
      <body className="flex h-full flex-col overflow-hidden overscroll-none">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
