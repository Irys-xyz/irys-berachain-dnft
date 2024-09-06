// Imports
// ========================================================
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-chai-matchers";
import { berachainTestnetbArtio } from "viem/chains";
import dotenv from "dotenv";

// Config
// ========================================================
dotenv.config();

// Hardhat Config
// ========================================================
const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    berachainTestnetbArtio: {
      chainId: parseInt(`${berachainTestnetbArtio.id}`),
      url: `${berachainTestnetbArtio.rpcUrls.default.http[0] || ""}`,
      accounts: process.env.WALLET_PRIVATE_KEY ? [`${process.env.WALLET_PRIVATE_KEY}`] : [],
    },
  },
  // For Contract Verification
  etherscan: {
    apiKey: `${process.env.BLOCK_EXPLORER_API_KEY}`,
    customChains: [
      {
        network: `${berachainTestnetbArtio.name || ""}`,
        chainId: parseInt(`${berachainTestnetbArtio.id}`),
        urls: {
          apiURL: `${process.env.BLOCK_EXPLORER_API_URL}`,
          browserURL: `${berachainTestnetbArtio.blockExplorers.default.url || ""}`,
        },
      },
    ],
  },
  sourcify: {
    enabled: false
  }
};

// Export Default
// ========================================================
export default config;
