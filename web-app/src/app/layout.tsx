import type { Metadata } from "next";
import { Inter, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Codiner - Next-Generation AI App Builder",
  description: "Build unlimited AI-powered applications with 1000+ features. Local, open-source, enterprise-ready.",
  keywords: "AI app builder, low-code development, full-stack apps, Supabase integration, AI coding assistant",
  authors: [{ name: "Codiner Team" }],
  creator: "Codiner",
  publisher: "Codiner",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://codiner.online",
    title: "Codiner - Next-Generation AI App Builder",
    description: "Build unlimited AI-powered applications with 1000+ features",
    siteName: "Codiner",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codiner - Next-Generation AI App Builder",
    description: "Build unlimited AI-powered applications with 1000+ features",
    creator: "@codiner",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceCodePro.variable}`}>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden">
        <Providers>
          <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto">
                <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
