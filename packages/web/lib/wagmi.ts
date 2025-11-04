import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { base } from "./chains";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "00000000000000000000000000000000";

if (process.env.NODE_ENV !== "production" && projectId === "00000000000000000000000000000000") {
  console.warn("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. WalletConnect may not function correctly.");
}

export const wagmiConfig = getDefaultConfig({
  appName: "Base GMGN dApp",
  projectId,
  chains: [base],
  ssr: true,
  transports: {
    [base.id]: http("https://mainnet.base.org")
  }
});
