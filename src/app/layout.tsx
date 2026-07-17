import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { GlobalSearchLoader } from "@/components/search/global-search-loader";
import { ThemeSync } from "@/components/providers/theme-sync";
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
  title: "Aster Journal — A private journal that feels like exhaling",
  description:
    "A calm, premium digital journal for unhurried reflection, quiet pattern-finding, and the kind of writing you want to keep returning to.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  applicationName: "Aster Journal",
  authors: [{ name: "Aster Journal" }],
  keywords: [
    "journal",
    "private reflection",
    "writing app",
    "notes",
    "memories",
    "collections",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Aster Journal",
    description:
      "A calm, premium digital journal for private reflection.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aster Journal",
    description:
      "A calm, premium digital journal for private reflection.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background">
        <AuthProvider>
          <ThemeSync />
          {children}
          <GlobalSearchLoader />
        </AuthProvider>
      </body>
    </html>
  );
}
