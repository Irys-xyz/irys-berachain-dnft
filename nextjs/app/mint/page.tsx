"use client";

import { useAccount } from "wagmi";
import NftMinter from "@/components/nft-viewer";
import { handleMint } from "../../components/utils/custom-fetchs";

const Upload = () => {
  const { isConnected } = useAccount();

  return (
    <main className="flex flex-col items-center justify-center py-16">
      <div className="w-full md:w-1/3">
        <button
          className="text-white text-xl"
          onClick={() =>
            handleMint({
              mintFunctionName: "mintMainNFT",
            })
          }
        >
          MINTAAAAAA
        </button>
        {/* {isConnected ? (
          <NftMinter
            mintFunctionName="mintMainNFT" // or "mintCommunityNFT" for the other option
            manifestId={process.env.NEXT_PUBLIC_BASE_NFT_MANIFEST_ID as string}
          />
        ) : (
          <p className="text-lg">Connect your wallet first.</p>
        )} */}
      </div>
    </main>
  );
};

export default Upload;
