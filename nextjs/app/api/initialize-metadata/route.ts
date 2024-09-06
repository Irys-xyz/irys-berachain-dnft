import { NextRequest, NextResponse } from "next/server";
import { Uploader } from "@irys/upload";
import { Bera } from "@irys/upload-ethereum";
import { createWalletClient, http } from "viem";
import { berachainTestnetbArtio } from "wagmi/chains";
import IrysTheBeraNFTAbi from "@/app/contract/IrysTheBeraNFT-abi.json";
import { privateKeyToAccount } from "viem/accounts";
import { env } from "@/components/utils/env";
import publicClient from "@/components/utils/public-client";
import { requestBodySchema } from "@/components/utils/request-body-schema";
import { COMMUNITIES } from "@/components/utils/constants";

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
    const irysUploader = await Uploader(Bera).withWallet(
      process.env.PRIVATE_KEY as string
    );

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

    const nftNames = env.NEXT_PUBLIC_NFT_NAMES?.split(",") || [];

    // Generate the initial metadata
    let metadata;
    let previewImageUrl;
    if (communityId) {
      previewImageUrl = `${env.NEXT_PUBLIC_IRYS_GATEWAY}/${
        COMMUNITIES.find((c) => c.value === communityId)?.manifest
      }/${nftNames[0]}`;
      metadata = {
        name: `Community NFT #${tokenId}`,
        symbol: "IBERA",
        description: `There's a new Bera in town and her name is Irys`,
        image: previewImageUrl,
        currentLevel: "1",
        communityId: communityId,
      };
    } else {
      previewImageUrl = `${env.NEXT_PUBLIC_IRYS_GATEWAY}/${env.NEXT_PUBLIC_BASE_NFT_MANIFEST_ID}/${nftNames[0]}`;
      metadata = {
        name: `NFT #${tokenId}`,
        symbol: "IBERA",
        description: `There's a new Bera in town and her name is Irys`,
        image: previewImageUrl,
        currentLevel: "1",
      };
    }

    // Upload the metadata to Irys
    const tags = [{ name: "Content-Type", value: "application/json" }];
    const receipt = await irysUploader.upload(JSON.stringify(metadata), {
      tags,
    });

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
