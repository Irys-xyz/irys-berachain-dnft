import { Uploader } from "@irys/upload";
import { Bera } from "@irys/upload-ethereum";

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
  const irysUploader = await Uploader(Bera).withWallet(process.env.PRIVATE_KEY);

  // Upload the new metadata to Irys
  const tags = [
    { name: "Content-Type", value: "application/json" },
    { name: "Root-TX", value: rootTx },
  ];
  const receipt = await irysUploader.upload(JSON.stringify(newMetadata), {
    tags,
  });

  return receipt;
}

export default uploadMetadata;
