import { createWalletClient, custom } from "viem";
import IrysTheBeraNFTAbi from "@/app/contract/IrysTheBeraNFT-abi.json";
import { berachainTestnetbArtio } from "viem/chains";
import {} from "viem/chains";
import { env } from "./env";
import publicClient from "./public-client";
import { COMMUNITIES } from "./constants";

/**
 * Fetches the metadata for a given tokenId.
 * @param {string} tokenId - The tokenId to fetch metadata for.
 * @returns {Promise<object>} - The metadata for the given tokenId.
 * @throws {Error} - If the metadata fetch fails.
 * @example
 * fetchMetadata("1");
 * fetchMetadata("2");
 */
const fetchMetadata = async (tokenId: number) => {
  // Fetch Base BGT Balance at Mint
  const result = (await publicClient.readContract({
    address: env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
    abi: IrysTheBeraNFTAbi,
    functionName: "tokenURI",
    args: [tokenId],
  })) as bigint;

  const metadataResponse = await fetch(result.toString());
  if (!metadataResponse.ok) {
    throw new Error("Failed to fetch metadata");
  }
  return metadataResponse.json();
};

/**
 * Updates the metadata for a given tokenId.
 * @param {number} tokenId - The tokenId to update metadata for.
 * @throws {Error} - If the metadata update fails.
 * @example
 * updateMetadata(1);
 * updateMetadata(2);
 */
const updateMetadata = async (tokenId: number) => {
  const response = await fetch("/api/update-metadata", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tokenId }),
  });

  const result = await response.json();
  if (!result.status) {
    throw new Error(result.message || "Failed to update metadata");
  }
  return result;
};

/**
 * Fetches the stats for a given address.
 * @param {string} address - The address to fetch stats for.
 * @returns {Promise<UploadStats>} - The stats for the given address.
 * @example
 * fetchStats("0x1234...");
 */
const fetchStats = async (address: string) => {
  const baseBGTBalance = (await publicClient.readContract({
    address: env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
    abi: IrysTheBeraNFTAbi,
    functionName: "getBgtAtMintAmount",
    args: [address],
  })) as bigint;

  const baseBGTBalanceNumber = Number(baseBGTBalance);

  // Calculate thresholds for level 2 and level 3
  const level2Percent = Number(env.NEXT_PUBLIC_PERCENT_TO_LEVEL_2);
  const level3Percent = Number(env.NEXT_PUBLIC_PERCENT_TO_LEVEL_3);

  const level2Threshold =
    baseBGTBalanceNumber === 0
      ? level2Percent / 100
      : baseBGTBalanceNumber + (baseBGTBalanceNumber * level2Percent) / 100;

  const level3Threshold =
    baseBGTBalanceNumber === 0
      ? level3Percent / 100
      : baseBGTBalanceNumber + (baseBGTBalanceNumber * level3Percent) / 100;

  const currentBGTBalance = (await publicClient.readContract({
    address: env.NEXT_PUBLIC_BGT_CONTRACT_ADDRESS as `0x${string}`,
    abi: [
      {
        constant: true,
        inputs: [{ name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "", type: "uint256" }],
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: [address],
  })) as bigint;

  const tokens = (await publicClient.readContract({
    address: env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
    abi: IrysTheBeraNFTAbi,
    functionName: "getTokensOwnedBy",
    args: [address],
  })) as bigint[];

  return {
    baseBGTBalance: baseBGTBalanceNumber,
    currentBGTBalance: Number(currentBGTBalance),
    level2Threshold,
    level3Threshold,
    tokenIds: tokens.map((id) => Number(id)),
  };
};

/**
 * Handles minting of a new NFT.
 * @param {string} mintFunctionName - The name of the mint function to call.
 * @returns Object - The result of the minting operation.
 * @throws {Error} - If the minting fails.
 * @example
 * handleMint({ mintFunctionName: "mintCommunityNFT" });
 * handleMint({ mintFunctionName: "mintMainNFT" });
 */
const handleMint = async ({
  mintFunctionName,
  communityId,
}: {
  mintFunctionName: "mintCommunityNFT" | "mintMainNFT";
  communityId?: (typeof COMMUNITIES)[number]["value"];
}) => {
  try {
    const walletClient = createWalletClient({
      chain: berachainTestnetbArtio,
      transport: custom(window.ethereum),
    });

    const [account] = await walletClient.getAddresses();

    const { request } = await publicClient.simulateContract({
      address: env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
      abi: IrysTheBeraNFTAbi,
      functionName: mintFunctionName,
      account,
    });

    const tx = await walletClient.writeContract(request);

    // extract tokenId from the transaction hash string
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: tx,
    });

    const tokenId = extractTokenId(receipt);

    console.info(`🎉 Congratulations! Minted NFT with tokenId: ${tokenId}.`);

    // Call the API route to set initial metadata
    const response = await fetch("/api/initialize-metadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokenId,
        communityId,
      }),
    });

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error minting NFT:", error);
    return {
      ok: false,
      error: (error as any)?.message || "Failed to mint NFT",
    };
  }
};

/**
 * Extracts tokenId from a transaction receipt.
 *
 * @param {Object} receipt - The transaction receipt object.
 * @returns {string|null} - The extracted tokenId or null if not found.
 */
function extractTokenId(receipt: any): number | null {
  // Check if the receipt has logs
  if (!receipt || !receipt.logs) {
    return null;
  }

  return parseInt(
    receipt.logs[0].topics[receipt.logs[0].topics.length - 1],
    16
  );
}

export { fetchMetadata, updateMetadata, fetchStats, handleMint };