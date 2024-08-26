import { NextRequest, NextResponse } from "next/server";
import Irys from "@irys-network/bundler-client";
import { createPublicClient, createWalletClient, http } from "viem";
import { berachainTestnetbArtio } from "wagmi/chains";
import IrysTheBeraNFTAbi from "@/app/contract/IrysTheBeraNFT-abi.json";
import { privateKeyToAccount } from "viem/accounts";

async function uploadMetadata(newMetadata: object, rootTx: string) {
  // Set up the Irys client
  const irys = new Irys({
    network: "testnet",
    token: "bera",
    key: process.env.PRIVATE_KEY as string,
    config: { providerUrl: process.env.NEXT_PUBLIC_BERA_RPC as string },
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

export async function POST(req: NextRequest) {
  const { tokenId } = await req.json();

  if (tokenId === undefined || tokenId === null) {
    return NextResponse.json({ error: "tokenId is required" }, { status: 400 });
  }

  try {
    // Set up public client
    const publicClient = createPublicClient({
      chain: berachainTestnetbArtio,
      transport: http(process.env.NEXT_PUBLIC_BERA_RPC as string),
    });

    // Retrieve the current owner of the NFT
    const owner = await publicClient.readContract({
      address: process.env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
      abi: IrysTheBeraNFTAbi,
      functionName: "ownerOf",
      args: [BigInt(tokenId)],
    });
    console.log(`owner ${owner}`);

    // Get the base BGT amount at the time of minting
    const baseBGTAmount = (await publicClient.readContract({
      address: process.env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
      abi: IrysTheBeraNFTAbi,
      functionName: "getBgtAtMintAmount",
      args: [owner],
    })) as bigint;
    console.log(`baseBGTAmount ${baseBGTAmount.toString()}`);

    // Get the current BGT balance
    const currentBGTBalance = (await publicClient.readContract({
      address: process.env.NEXT_PUBLIC_BGT_CONTRACT_ADDRESS as `0x${string}`,
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
      args: [owner],
    })) as bigint;
    console.log(`currentBGTBalance ${currentBGTBalance.toString()}`);

    // Retrieve the current token URI
    const currentURI = (await publicClient.readContract({
      address: process.env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
      abi: IrysTheBeraNFTAbi,
      functionName: "tokenURI",
      args: [BigInt(tokenId)],
    })) as string;
    console.log(`currentURI ${currentURI}`);

    // Fetch the current metadata from Irys
    const metadataResponse = await fetch(currentURI);
    const metadata = await metadataResponse.json();
    console.log(metadata);

    const currentLevel = parseInt(metadata.currentLevel, 10);
    console.log(`currentLevel=${currentLevel}`);

    if (currentLevel >= 3) {
      return NextResponse.json({
        status: false,
        message: "you're already at the top, anon",
      });
    }

    let percentIncreaseRequired;
    if (currentLevel === 1) {
      percentIncreaseRequired = BigInt(
        parseInt(process.env.NEXT_PUBLIC_PERCENT_TO_LEVEL_2 as string, 10)
      );
    } else {
      percentIncreaseRequired = BigInt(
        parseInt(process.env.NEXT_PUBLIC_PERCENT_TO_LEVEL_3 as string, 10)
      );
    }
    console.log(`percentIncreaseRequired=${percentIncreaseRequired}`);

    // Calculate the required BGT balance using bigint arithmetic
    const requiredBGTBalance =
      baseBGTAmount === 0n
        ? percentIncreaseRequired
        : baseBGTAmount + (baseBGTAmount * percentIncreaseRequired) / 100n;
    console.log(`requiredBGTBalance=${requiredBGTBalance}`);

    // WILLIAM when testing you can comment this out to just let the update happen.
    // if (BigInt(currentBGTBalance) < requiredBGTBalance) {
    //   console.log(`balance too low, not updating`);
    //   return NextResponse.json({ status: false, message: "no updates until you earn more bgt, anon" });
    // }

    // Generate new metadata
    const nftNames = process.env.NEXT_PUBLIC_NFT_NAMES?.split(",") || [];
    const nextLevel = currentLevel + 1;
    const previewImageUrl = `${process.env.NEXT_PUBLIC_IRYS_GATEWAY}/${
      process.env.NEXT_PUBLIC_BASE_NFT_MANIFEST_ID
    }/${nftNames[nextLevel - 1]}`;

    const newMetadata = {
      name: `NFT #${tokenId}`,
      symbol: "IBERA",
      description: `There's a new Bera in town and her name is Irys`,
      image: previewImageUrl,
      currentLevel: nextLevel.toString(),
    };

    const receipt = await uploadMetadata(
      newMetadata,
      currentURI.split("/").pop() as string
    );

    return NextResponse.json({ status: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error: " + error.message },
      { status: 500 }
    );
  }
}
