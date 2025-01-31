import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProviders from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Sora",
    default: "Sora - Plans for Good Days", // a default is required when creating a template
  },
  description: "Plans for Good Days",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen")}>
        <QueryProviders>
          <NuqsAdapter>
            <Toaster />
            {children}
          </NuqsAdapter>
        </QueryProviders>
      </body>
    </html>
  );
}
