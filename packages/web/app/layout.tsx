import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Base GMGN dApp",
  description: "Interact with GM/GN and deploy ERC20 tokens on Base mainnet"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
