import { NextRequest, NextResponse } from "next/server";
import Irys from "@irys-network/bundler-client";
import { createPublicClient, createWalletClient, http } from "viem";
import { berachainTestnetbArtio } from "wagmi/chains";
import IrysTheBeraNFTAbi from "@/app/contract/IrysTheBeraNFT-abi.json";
import { privateKeyToAccount } from "viem/accounts";

export async function POST(req: NextRequest) {
  const { tokenId } = await req.json();
  console.log("tokenId=",tokenId);

  if (tokenId === undefined || tokenId === null) {
    return NextResponse.json({ error: "tokenId is required" }, { status: 400 });
  }

  try {
    // Set up the Irys client
    const irys = new Irys({
      network: "testnet",
      token: "bera",
      key: process.env.PRIVATE_KEY as string,
      config: { providerUrl: process.env.NEXT_PUBLIC_BERA_RPC as string },
    });
    console.log(`Connected to Irys from ${irys.address}`);

    // Check if the token is new by calling tokenURI
    const publicClient = createPublicClient({
      chain: berachainTestnetbArtio,
      transport: http(process.env.NEXT_PUBLIC_BERA_RPC as string),
    });

    const existingURI = await publicClient.readContract({
      address: process.env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
      abi: IrysTheBeraNFTAbi,
      functionName: "tokenURI",
      args: [BigInt(tokenId)],
    }) as string;
    console.log("existingURI=",existingURI);

    if (!existingURI.endsWith("NOT_SET")) {
      return NextResponse.json({ error: "NFT not new" }, { status: 400 });
    }

    // Generate the initial metadata
    const nftNames = process.env.NEXT_PUBLIC_NFT_NAMES?.split(",") || [];
    const previewImageUrl = `${process.env.NEXT_PUBLIC_IRYS_GATEWAY}/${process.env.NEXT_PUBLIC_BASE_NFT_MANIFEST_ID}/${nftNames[0]}`;

    const metadata = {
      name: `NFT #${tokenId}`,
      symbol: "IBERA",
      description: `There's a new Bera in town and her name is Irys`,
      image: previewImageUrl,
      currentLevel: "1",
    };

    // Upload the metadata to Irys
    const tags = [{ name: "Content-Type", value: "application/json" }];
    const receipt = await irys.upload(JSON.stringify(metadata), {tags});
    console.log(`Metadata uploaded ${process.env.NEXT_PUBLIC_IRYS_GATEWAY}/mutable/${receipt.id}`);

    // Update the tokenURI on the contract
    const walletClient = createWalletClient({
      chain: berachainTestnetbArtio,
      transport: http(process.env.NEXT_PUBLIC_BERA_RPC as string),
    });
    // console.log(walletClient);

    // const [address] = await walletClient.getAddresses();

    console.log("Updating smart contract");
    const tx = await walletClient.writeContract({
      address: process.env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
      abi: IrysTheBeraNFTAbi,
      functionName: "updateTokenURI",
      account: privateKeyToAccount(`${process.env.PRIVATE_KEY}` as `0x${string}`),
      args: [BigInt(tokenId), receipt.id],
    });
    console.log("Smart contract updated:", tx);

    return NextResponse.json({ status: "Success" });
  } catch (error) {
    return NextResponse.json({ error: "Error: " + error.message }, { status: 500 });
  }
}
