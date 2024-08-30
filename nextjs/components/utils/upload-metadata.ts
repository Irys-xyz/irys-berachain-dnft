import Irys from "@irys-network/bundler-client";
import { env } from "./env";

export type NFTMetadata = {
  name: string;
  symbol: string;
  description: string;
  image: string;
  currentLevel: string;
};

/**
 * Uploads the new metadata to Irys
 * @param newMetadata The new metadata to upload
 * @param rootTx The root transaction hash of the current metadata
 * @returns The receipt of the metadata upload
 */
async function uploadMetadata({
  newMetadata,
  rootTx,
}: {
  newMetadata: NFTMetadata;
  rootTx: string;
}) {
  // Set up the Irys client
  const irys = new Irys({
    network: "testnet",
    token: "bera",
    key: process.env.PRIVATE_KEY as string,
    config: { providerUrl: env.NEXT_PUBLIC_BERA_RPC as string },
  });
  console.log(`Connected to Irys from ${irys.address}`);

  // Upload the new metadata to Irys
  const tags = [
    { name: "Content-Type", value: "application/json" },
    { name: "Root-TX", value: rootTx },
  ];
  const receipt = await irys.upload(JSON.stringify(newMetadata), { tags });

  return receipt;
}

export default uploadMetadata;
