import type { Metadata } from "next";
import "./globals.css";
import "./trend.css";

export const metadata: Metadata = {
  title: "Artur Threads AI",
  description: "AI lead discovery, USA trend radar and Polish content engine for Threads.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pl"><body>{children}</body></html>;
}
