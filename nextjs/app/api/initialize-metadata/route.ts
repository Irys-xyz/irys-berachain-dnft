import { NextRequest, NextResponse } from "next/server";
import { Uploader } from "@irys/upload";
import { Bera } from "@irys/upload-ethereum";
import { createWalletClient, http } from "viem";
import { berachainTestnetbArtio } from "wagmi/chains";
import IrysTheBeraNFTAbi from "@/app/contract/irys-the-bera-nft-abi.json";
import { privateKeyToAccount } from "viem/accounts";
import { env } from "@/utils/env";
import publicClient from "@/lib/public-client";
import { initializeMetadataSchema } from "@/utils/route-params-validators";
import { COMMUNITIES } from "@/utils/constants";

/**
 * POST /api/initialize-metadata
 * BODY { "tokenId": 0, "communityId": 0 }
 * Creates the initial metadata for a given tokenId.
 */
export async function POST(req: NextRequest) {
  const { tokenId, communityId } = await req.json();

  // Validate the request body
  try {
    initializeMetadataSchema.parse({ tokenId, communityId });
  } catch (error: any) {
    return NextResponse.json({ error: error.errors }, { status: 400 });
  }

  try {
    const irysUploader = await Uploader(Bera).withWallet(
      process.env.PRIVATE_KEY as string
    );

    // 1. Check if the metadata already exists
    const existingURI = (await publicClient.readContract({
      address: env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
      abi: IrysTheBeraNFTAbi,
      functionName: "tokenURI",
      args: [BigInt(tokenId)],
    })) as string;

    if (!existingURI.endsWith("NOT_SET")) {
      return NextResponse.json(
        { ok: false, message: "Metadata already exists" },
        { status: 400 }
      );
    }

    const nftNames = env.NEXT_PUBLIC_NFT_NAMES?.split(",") || [];

    // 2. Generate the initial metadata
    const baseManifestId = communityId
      ? COMMUNITIES.find((c) => c.value === communityId)?.manifest
      : env.NEXT_PUBLIC_BASE_NFT_MANIFEST_ID;

    const previewImageUrl = `${env.NEXT_PUBLIC_IRYS_GATEWAY}/${baseManifestId}/${nftNames[0]}`;

    const metadata = {
      name: communityId ? `Community NFT #${tokenId}` : `NFT #${tokenId}`,
      symbol: "IBERA",
      description: `There's a new Bera in town and her name is Irys`,
      image: previewImageUrl,
      currentLevel: "1",
      ...(communityId && { communityId }), // Include communityId only if it exists
    };

    // 3. Upload the metadata to Irys
    const tags = [{ name: "Content-Type", value: "application/json" }];
    const receipt = await irysUploader.upload(JSON.stringify(metadata), {
      tags,
    });

    // 4. Connect to the NFT smart contract
    const walletClient = createWalletClient({
      chain: berachainTestnetbArtio,
      transport: http(env.NEXT_PUBLIC_BERA_RPC as string),
    });

    // 5. Update the tokenURI on the contract
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
