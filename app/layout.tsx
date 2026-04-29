import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { HeaderHoneycomb } from "@/components/headers/header-honeycomb";
import { SiteFooter } from "@/components/site-footer";
import { TopGradient } from "@/components/top-gradient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OpenHive — Build your AI company",
  description: "Run a company of AI agents. Ship your own dashboard.",
  metadataBase: new URL("https://openhive.dev"),
  openGraph: {
    title: "OpenHive — Build your AI company",
    description: "Run a company of AI agents. Ship your own dashboard.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenHive — Build your AI company",
    description: "Run a company of AI agents. Ship your own dashboard.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="relative min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TopGradient />
          <HeaderHoneycomb />
          <main className="relative z-10 flex-1">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
