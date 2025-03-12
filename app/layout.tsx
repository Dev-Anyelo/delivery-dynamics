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
  title: "Delivery Dynamics",
  description: "Mantén tu negocio en movimiento con Delivery Dynamics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/jpeg" />
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
