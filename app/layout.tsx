import "./globals.css";
import type React from "react";
import { Toaster } from "sonner";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ui/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Feduro - Distribución Exclusiva de Productos Masivos",
  description:
    "Distribución de alimentos, bebidas, lubricantes, perfumería y cosméticos. Presencia en Costa Rica y franquicia exclusiva de Heladerías Häagen Dazs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/feduro-logo.png" type="image/jpeg" />
      </head>
      <body className={`${geistSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster
            position="top-center"
            closeButton
            theme="system"
            richColors
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
