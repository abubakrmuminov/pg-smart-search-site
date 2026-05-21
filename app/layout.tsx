import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["600", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "pg-smart-search | Documentation Portal",
  description: "Elite Documentation Portal for high-performance PostgreSQL fuzzy search",
};

import { SearchProvider } from "../context/SearchContext";
import { I18nProvider } from "../context/I18nContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${jetbrains.variable}`}>
      <body>
        <I18nProvider>
          <SearchProvider>
            {children}
          </SearchProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
