"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain } from "wagmi";
import { base } from "../lib/chains";

export function Connect() {
  const { chain, isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  const onWrongNetwork = isConnected && chain?.id !== base.id;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <ConnectButton
        label="Connect Wallet"
        chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
        accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
      />
      {onWrongNetwork ? (
        <button
          type="button"
          className="rounded-full border border-amber-400/50 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-400/20"
          onClick={() => switchChain({ chainId: base.id })}
          disabled={isPending}
        >
          {isPending ? "Switching…" : "Switch to Base"}
        </button>
      ) : null}
      {isConnected && !onWrongNetwork ? (
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
          On Base mainnet
        </span>
      ) : null}
    </div>
  );
}
