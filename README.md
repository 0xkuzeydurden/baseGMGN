# Base GMGN dApp

A minimal, elegant Base mainnet dApp featuring:

- **GM / GN**: Interact with an existing GMGN contract, track live counts, and display transaction states.
- **Deploy ERC20**: Deploy a mintable ERC20 directly from your wallet and mint additional supply as the owner.
- **Wallet-first UX**: Wagmi v2, viem, and RainbowKit with a Base-only network guard and responsive Tailwind UI.

## Quick start

1. Install dependencies
   ```bash
   pnpm install
   ```
2. Start the dev server (compiles contracts and launches Next.js)
   ```bash
   pnpm dev
   ```
3. Set `NEXT_PUBLIC_GMGN_ADDRESS` in `packages/web/.env.local` (or paste it in the UI) to the GMGN contract you deployed on Base.
4. Connect your wallet on Base mainnet, send GM/GN transactions, and deploy your ERC20.

## Scripts

- `pnpm build` – compile contracts, copy ABIs, then build the Next.js app.
- `pnpm dev` – compile contracts once and run the Next.js development server.

## Packages

- `packages/contracts` – Hardhat project with GMGN and ERC20Mintable contracts plus ABI copy script.
- `packages/web` – Next.js app with RainbowKit, wagmi v2, viem, and TailwindCSS UI.

## Environment

The dApp only targets Base mainnet (`chainId 8453`). Ensure you have:

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` – WalletConnect Project ID (required for RainbowKit).
- `NEXT_PUBLIC_GMGN_ADDRESS` – Optional default GMGN contract address prefilled in the UI.

All transactions are sent from the connected wallet; no server-side keys are used.
