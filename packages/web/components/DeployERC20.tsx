"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import type { Abi, Hex } from "viem";
import { parseUnits } from "viem";
import erc20Artifact from "../lib/abis/ERC20Mintable.json";
import { base } from "../lib/chains";
import { Card } from "./Card";

const erc20Abi = erc20Artifact.abi as Abi;
const erc20Bytecode = erc20Artifact.bytecode as Hex;

type TxPhase = "Idle" | "Preparing" | "Submitted" | "Confirming" | "Success" | "Error";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unexpected error";
}

export function DeployERC20() {
  const { address: accountAddress, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient({ chainId: base.id });
  const publicClient = usePublicClient({ chainId: base.id });

  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState("0");
  const [deployPhase, setDeployPhase] = useState<TxPhase>("Idle");

  const handleDeploy = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isConnected || !walletClient || !accountAddress) {
      toast.error("Connect your wallet on Base before deploying");
      return;
    }

    if (!publicClient) {
      toast.error("Unable to access public client");
      return;
    }

    if (!name.trim() || !symbol.trim()) {
      toast.error("Name and symbol are required");
      return;
    }

    let initialSupplyParsed: bigint;
    try {
      initialSupplyParsed = parseUnits(initialSupply || "0", 18);
    } catch (error) {
      toast.error("Enter a valid initial supply");
      return;
    }

    setDeployPhase("Preparing");
    const toastId = toast.loading("Deploying ERC20: preparing transaction…");

    try {
      const hash = await walletClient.deployContract({
        abi: erc20Abi,
        bytecode: erc20Bytecode,
        account: walletClient.account ?? accountAddress,
        chain: base,
        args: [name.trim(), symbol.trim(), initialSupplyParsed]
      });

      setDeployPhase("Submitted");
      toast.message("Deployment transaction submitted", { id: toastId });
      setDeployPhase("Confirming");

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (!receipt.contractAddress) {
        throw new Error("Deployment failed: missing contract address");
      }

      setDeployPhase("Success");
      toast.success(`ERC20 deployed: ${receipt.contractAddress}`, { id: toastId });
      setName("");
      setSymbol("");
      setInitialSupply("0");
    } catch (error) {
      setDeployPhase("Error");
      toast.error(`Deployment failed: ${getErrorMessage(error)}`, { id: toastId });
    }
  };

  return (
    <Card
      title="Deploy ERC20"
      description="Deploy a new ERC20 contract from your connected wallet."
    >
      <form className="flex flex-col gap-4" onSubmit={handleDeploy}>
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm text-slate-200">
            Name
            <input
              className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="My Token"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-200">
            Symbol
            <input
              className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
              value={symbol}
              onChange={(event) => setSymbol(event.target.value.toUpperCase())}
              placeholder="MTK"
              minLength={1}
              maxLength={11}
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-slate-200">
            Initial Supply
            <input
              className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
              value={initialSupply}
              onChange={(event) => setInitialSupply(event.target.value)}
              placeholder="1,000"
            />
            <span className="text-xs text-slate-400">Human units (18 decimals)</span>
          </label>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:bg-sky-600/60"
          disabled={
            !isConnected ||
            !walletClient ||
            deployPhase === "Preparing" ||
            deployPhase === "Submitted" ||
            deployPhase === "Confirming"
          }
        >
          Deploy ERC20
        </button>
        <p className="text-xs text-slate-400">Deployment status: {deployPhase}</p>
      </form>
    </Card>
  );
}
