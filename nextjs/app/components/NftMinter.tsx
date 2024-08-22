"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import Spinner from "@/app/components/Spinner";
import IrysTheBeraNFTAbi from "@/app/contract/IrysTheBeraNFT-abi.json";

interface NftMinterProps {
  mintFunctionName: "mintCommunityNFT" | "mintMainNFT";
  manifestId: string;
}

const NftMinter: React.FC<NftMinterProps> = ({ mintFunctionName, manifestId }) => {
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const nftNames = process.env.NEXT_PUBLIC_NFT_NAMES?.split(",") || [];
  const previewImageUrl = `${process.env.NEXT_PUBLIC_IRYS_GATEWAY}/${manifestId}/${nftNames[0]}`;

  const { writeContract, isPending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  const handleMint = async () => {
    setLoading(true);
    try {
      const tx = await writeContract({
        address: process.env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
        abi: IrysTheBeraNFTAbi,
        functionName: mintFunctionName,
      });
      // @ts-ignore
      if (tx && tx.hash) {
        // @ts-ignore
        setTxHash(tx.hash);
        setError(null);

        // Extract tokenId from the transaction receipt
        const tokenId = extractTokenIdFromReceipt("");
        console.log("calling api route with tokenId=",tokenId);
        // Call the API route to set initial metadata
        const response = await fetch("/api/setInitialMetadata", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tokenId }),
        });

        const result = await response.json();
        if (result.error) {
          setError(result.error);
        }
      }
    } catch (err) {
      setError("Minting failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const extractTokenIdFromReceipt = (tx: any): number => {
    // Implement logic to extract tokenId from the transaction receipt
    // This is just a placeholder; you'll need to replace this with the actual extraction logic
    return 0;
  };

  return (
    <div className="flex flex-col items-center bg-slate-400 p-5 rounded-2xl">
      <img src={previewImageUrl} alt="NFT Preview" className="rounded-lg shadow-md mb-4" />
      <button
        className={`btn ${isPending || isConfirming ? "loading" : ""} bg-yellow-500 w-full rounded-xl`}
        onClick={handleMint}
        disabled={isPending || isConfirming || loading}
      >
        {loading ? <Spinner color="text-white" /> : isPending || isConfirming ? "Minting..." : "Mint"}
      </button>
      {writeError && <p className="text-red-500 mt-2">{writeError.message}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {isConfirmed && !error && (
        <p className="text-green-500 mt-2">
          Minting successful!{" "}
          <a href={`${process.env.NEXT_PUBLIC_EXPLORER}/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
            View Transaction
          </a>
        </p>
      )}
      {isConfirming && <p className="text-yellow-500 mt-2">Waiting for confirmation...</p>}
    </div>
  );
};

export default NftMinter;
