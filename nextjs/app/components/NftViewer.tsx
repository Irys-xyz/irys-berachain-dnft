"use client";

import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import IrysTheBeraNFTAbi from "@/app/contract/IrysTheBeraNFT-abi.json";
import Spinner from "@/app/components/Spinner";

interface NftViewerProps {
  tokenId: number;
}

const NftViewer: React.FC<NftViewerProps> = ({ tokenId }) => {
  const [nftData, setNftData] = useState({
    image: "",
    name: "",
    description: "",
    currentLevel: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Using useReadContract to read the tokenURI from the contract
  const { data: tokenURI } = useReadContract({
    abi: IrysTheBeraNFTAbi,
    address: process.env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
    functionName: "tokenURI",
    args: [BigInt(tokenId)],
  });

  const fetchMetadata = async () => {
    try {
      const metadataResponse = await fetch(tokenURI as string);
      // const metadataResponse = await fetch(`${process.env.NEXT_PUBLIC_IRYS_GATEWAY}/mutable/${tokenURI}`);
      const metadata = await metadataResponse.json();
      setNftData({
        image: metadata.image,
        name: metadata.name,
        description: metadata.description,
        currentLevel: metadata.currentLevel,
      });
      setError(null);
    } catch (err) {
      setError("Failed to load NFT metadata");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenURI) {
      console.log({tokenURI})
      fetchMetadata();
    }
  }, [tokenURI]);

  const handleUpdateMetadata = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/updateMetadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenId }),
      });

      const result = await response.json();
      if (result.status === true) {
        fetchMetadata(); // Re-fetch the metadata to update the displayed data
      } else {
        setError(result.message || "Failed to update metadata");
      }
    } catch (err) {
      setError("Error while updating metadata");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-slate-400 p-5 rounded-2xl">
      {loading ? (
        <Spinner color="text-white" />
      ) : error ? (
        <p className="text-red-500 mt-2">{error}</p>
      ) : (
        <>
          <img src={nftData.image} alt={nftData.name} className="rounded-lg shadow-md mb-4" />
          <h2 className="text-xl font-bold mb-2">{nftData.name}</h2>
          <p className="text-gray-700 mb-4">{nftData.description}</p>
          <p className="text-sm text-gray-500 mb-4">Current Level: {nftData.currentLevel}</p>
          <button
            className="btn bg-yellow-500 w-full rounded-xl"
            onClick={handleUpdateMetadata}
            disabled={loading}
          >
            {loading ? <Spinner color="text-white" /> : "Update Metadata"}
          </button>
        </>
      )}
    </div>
  );
};

export default NftViewer;
