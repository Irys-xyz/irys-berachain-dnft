// Imports
// ========================================================
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { config } from "dotenv";

// Config
// ========================================================
config();

// Module
// ========================================================
const BHoneyNFTModule = buildModule("BHoneyNFTModule", (m) => {
  // Deploy contract
  const contract = m.contract("BHoneyNFT", [`${process.env.CONTRACT_BASE_URL}`]);

  return { contract };
});

// Exports
// ========================================================
export default BHoneyNFTModule;
