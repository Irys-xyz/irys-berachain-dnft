import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26", 
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  //@ts-ignore
  etherscan: {
    apiKey: {
      bartio_testnet: "bartio_testnet", // apiKey is not required, just set a placeholder
    },
    customChains: [
      {
        network: "bartio_testnet",
        chainId: 80084,
        urls: {
          apiURL: "https://api.routescan.io/v2/network/testnet/evm/80084/etherscan",
          browserURL: "https://bartio.beratrail.io"
        }
      }
    ]
  },
  networks: {
    berachainTestnetbArtio: {
      url: 'https://bartio.rpc.berachain.com',
      accounts: [process.env.WALLET_PRIVATE_KEY!]
    },
  },
};

export default config;



// // Imports
// // ========================================================
// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox-viem";
// import "@nomicfoundation/hardhat-chai-matchers";
// import { berachainTestnetbArtio } from "viem/chains";
// import dotenv from "dotenv";

// // Config
// // ========================================================
// dotenv.config();

// // Hardhat Config
// // ========================================================
// const config: HardhatUserConfig = {
//   solidity: "0.8.24",
//   networks: {
//     hardhat: {
//       chainId: 1337,
//     },
//     berachainTestnetbArtio: {
//       chainId: parseInt(`${berachainTestnetbArtio.id}`),
//       url: `${berachainTestnetbArtio.rpcUrls.default.http[0] || ""}`,
//       accounts: process.env.WALLET_PRIVATE_KEY ? [`${process.env.WALLET_PRIVATE_KEY}`] : [],
//     },
//   },
//   // For Contract Verification
//   etherscan: {
//     apiKey: `${process.env.BLOCK_EXPLORER_API_KEY}`,
//     customChains: [
//       {
//         network: `${berachainTestnetbArtio.name || ""}`,
//         chainId: parseInt(`${berachainTestnetbArtio.id}`),
//         urls: {
//           apiURL: `${process.env.BLOCK_EXPLORER_API_URL}`,
//           browserURL: `${berachainTestnetbArtio.blockExplorers.default.url || ""}`,
//         },
//       },
//     ],
//   },
//   sourcify: {
//     enabled: false
//   }
// };

// // Export Default
// // ========================================================
// export default config;
