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
  const contract = m.contract("IrysTheBeraNFT", [`${process.env.CONTRACT_BASE_URL}`]);

  return { contract };
});

// Exports
// ========================================================
export default IrysTheBeraNFTModule;
