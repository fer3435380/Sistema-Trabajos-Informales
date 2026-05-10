import type { Metadata } from "next";
import { PwaRegister } from "./ui/PwaRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sistema de Trabajos Informales",
  description: "Frontend para publicar trabajos y gestionar postulaciones.",
  manifest: "/manifest.webmanifest",
  applicationName: "Sistema de Trabajos Informales",
  appleWebApp: {
    capable: true,
    title: "STI",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/helmet-svgrepo-com.svg",
    apple: "/helmet-svgrepo-com.svg",
  },
};

export const viewport = {
  themeColor: "#2f6ee8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
