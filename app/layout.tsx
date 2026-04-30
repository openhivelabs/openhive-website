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

const SITE_URL = "https://openhive.dev";
const SITE_TAGLINE = "Run a company of AI agents. Ship your own dashboard.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OpenHive — Build your AI company",
    template: "%s — OpenHive",
  },
  description: SITE_TAGLINE,
  applicationName: "OpenHive",
  keywords: [
    "OpenHive",
    "AI agents",
    "agent orchestration",
    "multi-agent",
    "open source",
    "local-first",
    "self-hosted",
    "AI dashboard",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "OpenHive — Build your AI company",
    description: SITE_TAGLINE,
    url: SITE_URL,
    siteName: "OpenHive",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenHive — Build your AI company",
    description: SITE_TAGLINE,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "OpenHive",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  sameAs: ["https://github.com/openhivelabs/openhive"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "OpenHive",
  url: SITE_URL,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
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
