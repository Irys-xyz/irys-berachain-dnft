"use client";

import { useState } from "react";
import { createPublicClient, createWalletClient, custom } from "viem";
import { berachainTestnetbArtio } from "wagmi/chains";
import Spinner from "@/components/spinner";
import IrysTheBeraNFTAbi from "@/app/contract/IrysTheBeraNFT-abi.json";
import { handleMint } from "./utils/custom-fetchs";

interface NftMinterProps {
  mintFunctionName: "mintCommunityNFT" | "mintMainNFT";
  manifestId: string;
}

const NftMinter: React.FC<NftMinterProps> = ({
  mintFunctionName,
  manifestId,
}) => {
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<any>(null);

  const nftNames = process.env.NEXT_PUBLIC_NFT_NAMES?.split(",") || [];
  const previewImageUrl = `${process.env.NEXT_PUBLIC_IRYS_GATEWAY}/${manifestId}/${nftNames[0]}`;

  // const handleMint = async () => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     // Create the wallet client using the injected provider (e.g., MetaMask)
  //     const walletClient = createWalletClient({
  //       chain: berachainTestnetbArtio,
  //       transport: custom(window.ethereum!), // Use the injected provider
  //     });

  //     // Request the user's account
  //     const [address] = await walletClient.getAddresses();

  //     // Send the transaction to mint the NFT
  //     const txHash = await walletClient.writeContract({
  //       address: process.env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
  //       abi: IrysTheBeraNFTAbi,
  //       functionName: mintFunctionName,
  //       account: address, // Use the connected wallet's address
  //     });
  //     console.log("Transaction hash:", txHash);
  //     setTxHash(txHash);

  //     // Create the public client to wait for the transaction receipt
  //     const publicClient = createPublicClient({
  //       chain: berachainTestnetbArtio,
  //       transport: custom(window.ethereum!),
  //     });
  //     console.log("Waiting for receipt");

  //     const receipt = await publicClient.waitForTransactionReceipt({
  //       hash: txHash,
  //       pollingInterval: 1000, // Poll every second
  //       timeout: 60_000, // Timeout after 60 seconds
  //     });

  //     setReceipt(receipt);

  //     console.log("Transaction receipt:", receipt);

  //     const tokenId = extractTokenIdFromReceipt(receipt);
  //     console.log("Token ID:", tokenId);

  //     // Call the API route to set initial metadata
  //     const response = await fetch("/api/initial-metadata", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ tokenId }),
  //     });

  //     const result = await response.json();
  //     if (result.error) {
  //       setError(result.error);
  //     }
  //   } catch (err) {
  //     setError("Minting failed. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const extractTokenIdFromReceipt = (receipt: any): number => {
    if (!receipt.logs || receipt.logs.length < 2) {
      throw new Error("No logs found in the transaction receipt.");
    }

    // Assuming the tokenId is in logs[1].data
    const data = receipt.logs[1].data;

    // Convert the hex string to a BigInt and then to a number
    const tokenId = Number(BigInt(data));

    console.log("Extracted tokenId:", tokenId);

    return tokenId;
  };

  return (
    <div className="flex flex-col justify-center items-center bg-slate-400 p-5 rounded-2xl">
      <img
        src={previewImageUrl}
        alt="NFT Preview"
        className="rounded-lg shadow-md mb-4"
      />

      <button
        className={`btn ${
          loading ? "loading" : ""
        } bg-yellow-500 w-full rounded-xl text-center`}
        onClick={handleMint}
        disabled={loading}
      >
        {loading ? <Spinner color="text-white" /> : "Mint"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {txHash && !error && (
        <p className="text-green-500 mt-2">
          Minting successful!{" "}
          <a
            href={`${process.env.NEXT_PUBLIC_EXPLORER}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View Transaction
          </a>
        </p>
      )}
    </div>
  );
};

export default NftMinter;
