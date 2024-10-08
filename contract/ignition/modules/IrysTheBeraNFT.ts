// Imports
// ========================================================
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { config } from "dotenv";

// Config
// ========================================================
config();

// Module
// ========================================================
const IrysTheBeraNFTModule = buildModule("IrysTheBeraNFTModule", (m) => {
  // Deploy contract
  const contract = m.contract("IrysTheBeraNFT", [`${process.env.BGT_CONTRACT_ADDRESS}`]);

  return { contract };
});

// Exports
// ========================================================
export default IrysTheBeraNFTModule;
