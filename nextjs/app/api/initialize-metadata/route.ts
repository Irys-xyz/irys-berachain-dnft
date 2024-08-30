import { NextRequest, NextResponse } from "next/server";
import Irys from "@irys-network/bundler-client";
import { createWalletClient, http } from "viem";
import { berachainTestnetbArtio } from "wagmi/chains";
import IrysTheBeraNFTAbi from "@/app/contract/IrysTheBeraNFT-abi.json";
import { privateKeyToAccount } from "viem/accounts";
import { env } from "@/components/utils/env";
import publicClient from "@/components/utils/public-client";
import { z } from "zod";
import { COMMUNITIES } from "@/components/utils/constants";

// Define the request body schema validator
export const requestBodySchema = z.object({
  tokenId: z
    .number({
      message: "tokenId must be a number",
    })
    .nonnegative("tokenId must be a non-negative number")
    .int("tokenId must be an integer")
    .min(0, "tokenId must be greater than or equal to 0"),
  communityId: z
    .custom<string>((value) => COMMUNITIES.some((c) => c.value === value), {
      message: `communityId must be a valid community. Valid communities are: ${COMMUNITIES.map(
        (c) => c.value
      ).join(", ")}.`,
    })
    .optional(),
});

/**
 * POST /api/initialize-metadata
 * Creates the initial metadata for a given tokenId.
 */
export async function POST(req: NextRequest) {
  const { tokenId, communityId } = await req.json();

  // Validate the request body
  try {
    requestBodySchema.parse({ tokenId, communityId });
  } catch (error: any) {
    return NextResponse.json({ error: error.errors }, { status: 400 });
  }

  try {
    const irys = new Irys({
      network: "testnet",
      token: "bera",
      key: process.env.PRIVATE_KEY as string,
      config: { providerUrl: env.NEXT_PUBLIC_BERA_RPC as string },
    });

    // Check if the metadata already exists
    const existingURI = (await publicClient.readContract({
      address: env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
      abi: IrysTheBeraNFTAbi,
      functionName: "tokenURI",
      args: [BigInt(tokenId)],
    })) as string;

    if (!existingURI.endsWith("NOT_SET")) {
      return NextResponse.json(
        { error: "Metadata already exists." },
        { status: 400 }
      );
    }

    // Generate the initial metadata

    const nftNames = env.NEXT_PUBLIC_NFT_NAMES?.split(",") || [];
    const previewImageUrl = `${env.NEXT_PUBLIC_IRYS_GATEWAY}/${env.NEXT_PUBLIC_BASE_NFT_MANIFEST_ID}/${nftNames[0]}`;

    // TODO: Include the communityId in the metadata if it's provided
    const metadata = {
      name: `NFT #${tokenId}`,
      symbol: "IBERA",
      description: `There's a new Bera in town and her name is Irys`,
      image: previewImageUrl,
      currentLevel: "1",
    };

    // Upload the metadata to Irys
    const tags = [{ name: "Content-Type", value: "application/json" }];
    const receipt = await irys.upload(JSON.stringify(metadata), { tags });

    // Update the tokenURI on the contract
    const walletClient = createWalletClient({
      chain: berachainTestnetbArtio,
      transport: http(env.NEXT_PUBLIC_BERA_RPC as string),
    });

    // Update the tokenURI on the contract
    const tx = await walletClient.writeContract({
      address: env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
      abi: IrysTheBeraNFTAbi,
      functionName: "updateTokenURI",
      account: privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`),
      args: [BigInt(tokenId), receipt.id],
    });

    return NextResponse.json({ ok: true, irys: receipt, berachain: tx });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error: " + error.message },
      { status: 500 }
    );
  }
}