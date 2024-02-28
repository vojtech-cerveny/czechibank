import UserButton from "@/components/auth/user-button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/theme/toggle-button";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CzechiBank",
  description: "Best bank for YOU!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " min-h-screen w-full min-w-full px-4 py-4 pb-10 sm:px-6 md:max-w-2xl"}>
        <ThemeProvider attribute="class" defaultTheme="system">
          <div className="flex flex-row items-center justify-between">
            <Link href={"/"} className="flex flex-row items-center space-x-2">
              <Image src={`/logo.png`} alt={"Logo"} width="30" height="30" />
              <span className="text-2xl font-bold">CzechiBank</span>
            </Link>
            <div className="flex flex-1 items-center justify-end space-x-2 p-2">
              <Link href={"/register"}>
                <Button>Register</Button>
              </Link>
              <ModeToggle />
              <UserButton />
            </div>
          </div>
          <div className="mx-auto max-w-2xl">{children}</div>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
