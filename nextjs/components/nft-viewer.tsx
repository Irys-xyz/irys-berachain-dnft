"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useReadContract } from "wagmi";
import IrysTheBeraNFTAbi from "@/app/contract/IrysTheBeraNFT-abi.json";
import Spinner from "@/components/spinner";

interface NftViewerProps {
  tokenId: number;
}

const fetchMetadata = async (tokenURI: string) => {
  const metadataResponse = await fetch(tokenURI);
  if (!metadataResponse.ok) {
    throw new Error("Failed to fetch metadata");
  }
  return metadataResponse.json();
};

const updateMetadata = async (tokenId: number) => {
  const response = await fetch("/api/update-metadata", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tokenId }),
  });

  const result = await response.json();
  if (!result.status) {
    throw new Error(result.message || "Failed to update metadata");
  }
  return result;
};

const NftViewer: React.FC<NftViewerProps> = ({ tokenId }) => {
  const queryClient = useQueryClient();

  // Query to get tokenURI from the contract
  const { data: tokenURI, error: contractError } = useReadContract({
    abi: IrysTheBeraNFTAbi,
    address: process.env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
    functionName: "tokenURI",
    args: [BigInt(tokenId || 0)],
  });

  // Query to fetch NFT metadata
  const {
    data: nftData,
    error: fetchError,
    isLoading,
  } = useQuery({
    queryKey: ["nftData", tokenURI],
    queryFn: () => fetchMetadata(tokenURI as string),
    enabled: !!tokenURI, // Only fetch metadata if tokenURI is available
  });

  // Mutation to update metadata
  const mutation = useMutation({
    mutationFn: () => updateMetadata(tokenId),
    onSuccess: () => {
      // Invalidate and refetch the NFT data query
      queryClient.invalidateQueries({ queryKey: ["nftData", tokenURI] });
    },
    onError: (error: Error) => {
      console.error("Error updating metadata:", error.message);
    },
  });

  if (isLoading) {
    return <Spinner color="text-white" />;
  }

  if (contractError || fetchError) {
    return (
      <p className="text-red-500 mt-2">
        Error: {contractError?.message || fetchError?.message}
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center bg-slate-400 rounded-2xl">
      {nftData ? (
        <>
          <img
            src={nftData.image}
            alt={nftData.name}
            className="rounded-lg shadow-md mb-4"
          />
          <h2 className="text-xl font-bold mb-2">{nftData.name}</h2>
          <p className="text-gray-700 mb-4">{nftData.description}</p>
          <p className="text-sm text-gray-500 mb-4">
            Current Level: {nftData.currentLevel}
          </p>
          <button
            className="btn bg-yellow-500 w-full rounded-xl"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <Spinner color="text-white" />
            ) : (
              "Update Metadata"
            )}
          </button>
        </>
      ) : (
        <p>No NFT data found</p>
      )}
    </div>
  );
};

export default NftViewer;
