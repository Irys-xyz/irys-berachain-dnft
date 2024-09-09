import { createWalletClient, custom } from "viem";
import IrysTheBeraNFTAbi from "@/app/contract/irys-the-bera-nft-abi.json";
import { berachainTestnetbArtio } from "viem/chains";
import { env } from "@/utils/env";
import publicClient from "@/lib/public-client";
import { COMMUNITIES } from "@/utils/constants";

/**
 * Fetches the metadata for a given tokenId.
 * @param {string} tokenId - The tokenId to fetch metadata for.
 * @returns {Promise<object>} - The metadata for the given tokenId.
 * @throws {Error} - If the metadata fetch fails.
 * @example
 * fetchMetadata(1);
 * fetchMetadata(2);
 */
const fetchMetadata = async (tokenId: number) => {
  // Fetch Base BGT Balance at Mint
  const result = (await publicClient.readContract({
    address: env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
    abi: IrysTheBeraNFTAbi,
    functionName: "tokenURI",
    args: [tokenId],
  })) as bigint;

  if (result.toString() === `${env.NEXT_PUBLIC_IRYS_GATEWAY}/mutable/NOT_SET`) {
    await fetch("/api/initialize-metadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tokenId,
      }),
    });

    return fetchMetadata(tokenId);
  }
  const metadataResponse = await fetch(result.toString());
  if (!metadataResponse.ok) {
    throw new Error("Failed to fetch metadata");
  }
  return metadataResponse.json();
};

/**
 * Updates the metadatas for a given wallet Address.
 * @param {string} walletAddress - The wallet address to update metadata for.
 * @throws {Error} - If the metadata update fails.
 * @example
 * updateMetadata({ walletAddress: "0x0..."});
 */
const updateMetadata = async ({ walletAddress }: { walletAddress: string }) => {
  const response = await fetch("/api/update-metadata", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ walletAddress }),
  });

  const result = await response.json();
  if (!result.status) {
    throw new Error(result.message || "Failed to update metadata");
  }
  return result;
};

/**
 * Converts a value from atomic units to standard units.
 * @param {bigint} atomicValue - The value in atomic units (e.g., wei).
 * @param {number} decimals - The number of decimals for the token, typically 18 for most ERC-20 tokens.
 * @returns {number} - The value in standard units.
 */
const atomicToStandardUnits = (
  atomicValue: bigint,
  decimals: number = 18
): number => {
  const factor = BigInt(10 ** decimals);
  return Number(atomicValue) / Number(factor);
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

  // const baseBGTBalanceNumber = Number(baseBGTBalance);
  const baseBGTBalanceNumber = atomicToStandardUnits(baseBGTBalance);

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

  const currentBGTBalanceStandardUnits =
    atomicToStandardUnits(currentBGTBalance);

  const tokens = (await publicClient.readContract({
    address: env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
    abi: IrysTheBeraNFTAbi,
    functionName: "getTokensOwnedBy",
    args: [address],
  })) as bigint[];

  const tokensWithNoDuplicates = Array.from(new Set(tokens)).map((token) =>
    Number(token)
  );

  return {
    baseBGTBalance: baseBGTBalanceNumber,
    currentBGTBalance: currentBGTBalanceStandardUnits,
    level2Threshold,
    level3Threshold,
    tokenIds: tokensWithNoDuplicates,
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

    console.log(
      walletClient.chain.id !== berachainTestnetbArtio.id,
      walletClient.chain.id,
      berachainTestnetbArtio.id
    );

    await walletClient.switchChain(berachainTestnetbArtio);

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
