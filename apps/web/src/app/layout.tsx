import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";

import "../styles/globals.css";
import "../styles/calendar.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "march",
  description: "engineered for makers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
