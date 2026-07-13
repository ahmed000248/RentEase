import { Space_Grotesk, Inter } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${spaceGrotesk.variable} ${inter.variable} font-dashboard`}>{children}</div>;
}
