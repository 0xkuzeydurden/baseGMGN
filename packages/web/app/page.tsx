"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { Toaster } from "sonner";
import { WagmiProvider } from "wagmi";
import { Connect } from "../components/Connect";
import { DeployERC20 } from "../components/DeployERC20";
import { GMGNCard } from "../components/GMGNCard";
import { base } from "../lib/chains";
import { wagmiConfig } from "../lib/wagmi";

export default function Page() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={darkTheme({
            accentColor: "#38bdf8",
            borderRadius: "large"
          })}
        >
          <Toaster richColors closeButton position="top-right" />
          <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-4 py-10 sm:py-16">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-white">Base GMGN dApp</h1>
                <p className="text-sm text-slate-300">
                  Interact with GM/GN and deploy mintable ERC20 tokens on Base mainnet.
                </p>
              </div>
              <Connect />
            </header>

            <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-100">
              You are on Base mainnet. Transactions will require gas.
            </div>

            <section className="grid gap-6 lg:grid-cols-2">
              <GMGNCard />
              <DeployERC20 />
            </section>
          </main>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
