import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script, Outfit, Jost } from "next/font/google";
import "./globals.css";
import SplashGate from "@/components/SplashGate";
import { AuthProvider } from "@/lib/auth/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["700"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RentEase - Find Your Perfect Rental Property",
  description: "High-performance property discovery and rental management platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} ${dancingScript.variable} ${jost.variable} antialiased scroll-smooth`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (sessionStorage.getItem('hasSeenIntro')) {
                  document.documentElement.classList.add('skip-intro');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-[#050505] text-white selection:bg-[#00C853] selection:text-black font-sans min-h-screen">
        <AuthProvider>
          <SplashGate>{children}</SplashGate>
        </AuthProvider>
      </body>
    </html>
  );
}
