import "./globals.css";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ToastProvider } from "@/components/providers/ToastProvider";

// Initialize DM Sans - a clean, modern sans-serif
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "SmartAdvice",
  description: "Encuentra el seguro perfecto para tu PYME o startup",
  icons: {
    icon: [
      {
        rel: "icon",
        url: "/favicon.png",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={dmSans.variable}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="font-dm-sans">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
