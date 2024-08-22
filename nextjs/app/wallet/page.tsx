"use client";

import { useAccount } from "wagmi";
import NftViewer from "@/app/components/NftViewer";

const Upload = () => {
  const { isConnected } = useAccount();

  return (
    <main className="flex flex-col items-center justify-center py-16">
      <div className="w-full md:w-1/3">
        {isConnected ? (
          <NftViewer
            tokenId={0}
          />
        ) : (
          <p className="text-lg">Connect your wallet first.</p>
        )}
      </div>
    </main>
  );
};

export default Upload;
