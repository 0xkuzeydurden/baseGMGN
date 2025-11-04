import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-viem";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-verify";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.30",
    settings: {
      evmVersion: "shanghai",
      optimizer: {
        enabled: false,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache",
    tests: "./test"
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6"
  },
  networks: {
    base: {
      url: process.env.BASE_RPC_URL || "https://mainnet.base.org",
      chainId: 8453,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : undefined
    }
  },
  etherscan: {
    apiKey: {
      base: process.env.BASESCAN_API_KEY || ""
    }
  }
};

export default config;
