import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/assets/css/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CookiesProvider } from "next-client-cookies/server";
import AuthProvider from "./providers/AuthContext";
import { getAccessToken } from "./lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Easycob",
  description: "CRM Yuan Soluções",
  icons: {
    icon: "/apple-icon.png",
    shortcut: "/apple-icon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let token = getAccessToken();

  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-100`}>
        <CookiesProvider>
          <AuthProvider token={token}>
            {children}
            <Toaster />
          </AuthProvider>
        </CookiesProvider>
      </body>
    </html>
  );
}
