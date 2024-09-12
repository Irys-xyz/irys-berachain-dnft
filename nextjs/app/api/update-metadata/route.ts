import { cookies } from "next/headers";

import { NextRequest, NextResponse } from "next/server";
import IrysTheBeraNFTAbi from "@/app/contract/irys-the-bera-nft-abi.json";
import { env } from "@/utils/env";
import publicClient from "@/lib/public-client";
import uploadMetadata, { NFTMetadata } from "@/lib/upload-metadata";
import {
  COMMUNITIES,
  ERROR_UPDATE_METADATA_24H,
  LEVEL_PERCENT_MAP,
} from "@/utils/constants";
import { aesGcmDecrypt, aesGcmEncrypt } from "@/utils/encrypt-decrypt";
import { updateMetadataSchema } from "@/utils/route-params-validators";

/**
 * POST /api/update-metadata
 * BODY { "walletAddress": "0x..." }
 * Updates the metadata of an NFT
 */
export async function POST(req: NextRequest) {
  const cookieStore = cookies();
  const { walletAddress } = await req.json();

  // 1. Validate the request body
  try {
    updateMetadataSchema.parse({ walletAddress });
  } catch (error: any) {
    return NextResponse.json({ error: error.errors }, { status: 400 });
  }

  // 2. We've added a requirement that users can only update once every 24 hours
  // It's checked here. 
  const updatedAt = cookieStore.get("ua");
  if (updatedAt && updatedAt.value) {
    try {
      const decryptedDate = await aesGcmDecrypt(
        updatedAt.value,
        process.env.COOKIE_ENCRYPT_KEY as string
      );
      const updatedAtDate = new Date(decryptedDate);
      const now = new Date();
      const diff = now.getTime() - updatedAtDate.getTime();
      const diffHours = diff / (1000 * 60 * 60);
      if (diffHours < 24) {
        return NextResponse.json(
          {
            ok: false,
            message: ERROR_UPDATE_METADATA_24H,
          },
          { status: 400 }
        );
      }
    } catch (error) {
      const encryptedDate = await aesGcmEncrypt(
        new Date().toISOString(),
        process.env.COOKIE_ENCRYPT_KEY as string
      );
      cookieStore.set("ua", encryptedDate, {
        // 24 hours
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
      return NextResponse.json(
        {
          ok: false,
          message: "Error decrypting cookie. Did you tried to change it?",
        },
        { status: 400 }
      );
    }
  }

  // 3. Get all tokens IDs owned by the user
  try {
    const userOwnedTokens = (await publicClient.readContract({
      address: env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
      abi: IrysTheBeraNFTAbi,
      functionName: "getTokensOwnedBy",
      args: [walletAddress],
    })) as bigint[];

    const tokens = Array.from(new Set(userOwnedTokens)).map((token) =>
      Number(token)
    );

    // 4. Get the base BGT amount at the time of minting
    const baseBGTAmount = (await publicClient.readContract({
      address: env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
      abi: IrysTheBeraNFTAbi,
      functionName: "getBgtAtMintAmount",
      args: [walletAddress],
    })) as bigint;

    // 5. Get the users's current BGT balance
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
      args: [walletAddress],
    })) as bigint;

    // 6. Iterate over the token IDs and update if it's time to update
    for (let tokenId of tokens) {
      // 7. Retrieve the current token URI
      const currentURI = (await publicClient.readContract({
        address: env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
        abi: IrysTheBeraNFTAbi,
        functionName: "tokenURI",
        args: [BigInt(tokenId)],
      })) as string;

      // 8. Fetch the current metadata from Irys
      const metadataResponse = await fetch(currentURI);
      const currentMetadata = await metadataResponse.json();

      const currentLevel = parseInt(currentMetadata.currentLevel, 10);

      // 9. If they're at level 3, nothing else to do
      if (currentLevel >= 3) {
        const otherTokensLevels = await Promise.all(
          tokens
            .filter((id) => id !== tokenId)
            .map(async (id) => {
              const uri = (await publicClient.readContract({
                address: env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
                abi: IrysTheBeraNFTAbi,
                functionName: "tokenURI",
                args: [BigInt(id)],
              })) as string;

              const response = await fetch(uri);
              const metadata = await response.json();
              return parseInt(metadata.currentLevel, 10);
            })
        );

        if (otherTokensLevels.some((level) => level < 3)) {
          continue; // Skip to the next token
        }

        return NextResponse.json(
          {
            ok: false,
            message:
              "You've reached the final level! Your NFT is now fully evolved.",
          },
          {
            status: 400,
          }
        );
      }

      let percentIncreaseRequired =
        LEVEL_PERCENT_MAP[currentLevel] ?? BigInt(0);

      // 10. Calculate the required BGT balance using bigint arithmetic
      const requiredBGTBalance =
        baseBGTAmount === 0n
          ? percentIncreaseRequired
          : baseBGTAmount + (baseBGTAmount * percentIncreaseRequired) / 100n;
      console.log(`requiredBGTBalance=${requiredBGTBalance}`);

      if (BigInt(currentBGTBalance) < requiredBGTBalance) {
        console.log(`balance too low, not updating`);
        return NextResponse.json({
          ok: false,
          message: "You need to earn more $BGT before you can update your NFT.",
        });
      }

      // 11. Generate new metadata
      const nftNames = env.NEXT_PUBLIC_NFT_NAMES?.split(",") || [];
      const nextLevel = currentLevel + 1;

      const baseUrl = env.NEXT_PUBLIC_IRYS_GATEWAY;
      const manifestId = currentMetadata.communityId
        ? COMMUNITIES.find((c) => c.value === currentMetadata.communityId)
            ?.manifest
        : env.NEXT_PUBLIC_BASE_NFT_MANIFEST_ID;

      const previewImageUrl = `${baseUrl}/${manifestId}/${
        nftNames[nextLevel - 1]
      }`;

      const newMetadata: NFTMetadata = {
        ...currentMetadata,
        image: previewImageUrl,
        currentLevel: nextLevel.toString(),
      };

      // 12. Finally upload the new metadata, tagging it with the ID of the original
      // If you're forking the repo to create something new, this is the one
      // piece of the route you need to keep. The custom update logic above can be replaced.
      await uploadMetadata({
        newMetadata,
        rootTx: currentURI.split("/").pop() as string,
      });
    }

    // 13. Update the cookie used to track our 24 hour rule
    const encryptedDate = await aesGcmEncrypt(
      new Date().toISOString(),
      process.env.COOKIE_ENCRYPT_KEY as string
    );

    cookieStore.set("ua", encryptedDate, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    return NextResponse.json({ status: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error: " + error.message },
      { status: 500 }
    );
  }
}
