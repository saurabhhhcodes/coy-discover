import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Coy",
  description: "Find out if your crush likes you back. If they don't, nobody ever knows.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#ffffff] text-[#15121d]">
        {children}
      </body>
    </html>
  );
}
