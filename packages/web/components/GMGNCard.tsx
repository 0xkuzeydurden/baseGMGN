"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAccount, usePublicClient, useReadContract, useWatchContractEvent, useWriteContract } from "wagmi";
import type { Abi, Address, Hex } from "viem";
import gmgnArtifact from "../lib/abis/GMGN.json";
import { base } from "../lib/chains";
import { Card } from "./Card";

const GMGN_ADDRESS: Address = "0xb397541b944c3B25939Cb64cC88e8F7510dB2995";
const gmgnAbi = gmgnArtifact.abi as Abi;

type TxPhase = "Idle" | "Preparing" | "Submitted" | "Confirming" | "Success" | "Error";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unexpected error";
}

export function GMGNCard() {
  const { isConnected } = useAccount();
  const publicClient = usePublicClient({ chainId: base.id });
  const { writeContractAsync, isPending } = useWriteContract();

  const [txPhase, setTxPhase] = useState<TxPhase>("Idle");
  const [lastTxHash, setLastTxHash] = useState<Hex | null>(null);

  const contractAddress = GMGN_ADDRESS;

  const gmQuery = useReadContract({
    address: contractAddress,
    abi: gmgnAbi,
    functionName: "gmCount",
    chainId: base.id,
    query: { enabled: true }
  });

  const gnQuery = useReadContract({
    address: contractAddress,
    abi: gmgnAbi,
    functionName: "gnCount",
    chainId: base.id,
    query: { enabled: true }
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: gmgnAbi,
    eventName: "GM",
    chainId: base.id,
    onLogs: () => {
      void gmQuery.refetch();
    }
  });

  useWatchContractEvent({
    address: contractAddress,
    abi: gmgnAbi,
    eventName: "GN",
    chainId: base.id,
    onLogs: () => {
      void gnQuery.refetch();
    }
  });

  const handleInteraction = async (fn: "gm" | "gn") => {
    if (!isConnected) {
      toast.error("Connect your wallet first");
      return;
    }
    if (!publicClient) {
      toast.error("Unable to access public client");
      return;
    }

    const actionLabel = fn === "gm" ? "Good Morning" : "Good Night";
    setTxPhase("Preparing");
    const toastId = toast.loading(`${actionLabel}: preparing transaction…`);

    try {
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: gmgnAbi,
        functionName: fn,
        chainId: base.id
      });

      setTxPhase("Submitted");
      toast.message(`${actionLabel}: transaction submitted`, { id: toastId });
      setLastTxHash(hash as Hex);
      setTxPhase("Confirming");

      await publicClient.waitForTransactionReceipt({ hash: hash as Hex });

      setTxPhase("Success");
      toast.success(`${actionLabel}: confirmed`, { id: toastId });
      void gmQuery.refetch();
      void gnQuery.refetch();
    } catch (error) {
      setTxPhase("Error");
      toast.error(`${actionLabel}: ${getErrorMessage(error)}`, { id: toastId });
    }
  };

  const gmCount = gmQuery.data ? Number(gmQuery.data) : 0;
  const gnCount = gnQuery.data ? Number(gnQuery.data) : 0;

  return (
    <Card
      title="GM / GN"
      description="Interact with the live GMGN contract on Base mainnet."
      footer={
        lastTxHash ? (
          <span className="break-all text-xs text-slate-400">
            Last transaction: {lastTxHash}
          </span>
        ) : undefined
      }
    >
      <div className="grid grid-cols-2 gap-4 rounded-xl border border-white/5 bg-black/30 p-4 text-center">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">GM Count</p>
          <p className="text-2xl font-semibold text-white">{gmQuery.isLoading ? "…" : gmCount}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">GN Count</p>
          <p className="text-2xl font-semibold text-white">{gnQuery.isLoading ? "…" : gnCount}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => void handleInteraction("gm")}
          className="flex-1 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:bg-emerald-600/60"
          disabled={!isConnected || isPending}
        >
          Good Morning
        </button>
        <button
          type="button"
          onClick={() => void handleInteraction("gn")}
          className="flex-1 rounded-lg bg-indigo-500 px-4 py-3 text-sm font-semibold text-indigo-950 transition hover:bg-indigo-400 disabled:bg-indigo-600/60"
          disabled={!isConnected || isPending}
        >
          Good Night
        </button>
      </div>

      <p className="text-xs text-slate-400">Transaction status: {txPhase}</p>
    </Card>
  );
}
