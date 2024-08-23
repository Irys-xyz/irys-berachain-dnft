"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import NftViewer from "@/app/components/NftViewer";
import IrysTheBeraNFTAbi from "@/app/contract/IrysTheBeraNFT-abi.json";
import ERC20Abi from "@/app/contract/ERC20Abi.json";
import { berachainTestnetbArtio } from "wagmi/chains";

interface UploadStats {
  baseBGTBalance: number;
  currentBGTBalance: number;
  level2Threshold: number;
  level3Threshold: number;
  tokenIds: number[];
}

const Upload = () => {
  const { address, isConnected } = useAccount();
  const [stats, setStats] = useState<UploadStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log({isConnected});
    console.log({address});
    
    if (!isConnected || !address) return;

    const fetchData = async () => {
      try {
        const publicClient = createPublicClient({
          chain: berachainTestnetbArtio,
          transport: http(process.env.NEXT_PUBLIC_BERA_RPC as string),
        });

        // Fetch Base BGT Balance at Mint
        const baseBGTBalance = await publicClient.readContract({
          address: process.env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
          abi: IrysTheBeraNFTAbi,
          functionName: "getBgtAtMintAmount",
          args: [address],
        }) as bigint;

        const baseBGTBalanceNumber = Number(baseBGTBalance);

        // Calculate thresholds for level 2 and level 3
        const level2Percent = Number(process.env.NEXT_PUBLIC_PERCENT_TO_LEVEL_2);
        const level3Percent = Number(process.env.NEXT_PUBLIC_PERCENT_TO_LEVEL_3);
        
        const level2Threshold = baseBGTBalanceNumber === 0
          ? level2Percent / 100
          : baseBGTBalanceNumber + (baseBGTBalanceNumber * level2Percent) / 100;
        
        const level3Threshold = baseBGTBalanceNumber === 0
          ? level3Percent / 100
          : baseBGTBalanceNumber + (baseBGTBalanceNumber * level3Percent) / 100;
        
  
        console.log("getting bgt for address=",address);
        console.log("process.env.NEXT_PUBLIC_BGT_CONTRACT_ADDRESS=",process.env.NEXT_PUBLIC_BGT_CONTRACT_ADDRESS);

        const currentBGTBalance = await publicClient.readContract({
          address: process.env.NEXT_PUBLIC_BGT_CONTRACT_ADDRESS as `0x${string}`,
          abi: [
            {
              "constant": true,
              "inputs": [{ "name": "account", "type": "address" }],
              "name": "balanceOf",
              "outputs": [{ "name": "", "type": "uint256" }],
              "type": "function",
            },
          ],
          functionName: "balanceOf",
          args: [address],
        }) as bigint;
        console.log({currentBGTBalance});
        // Fetch Token IDs owned by the user
        const tokens = await publicClient.readContract({
          address: process.env.NEXT_PUBLIC_IRYS_THE_BERA_NFT as `0x${string}`,
          abi: IrysTheBeraNFTAbi,
          functionName: "getTokensOwnedBy",
          args: [address],
        }) as bigint[];
        console.log({tokens});

        setStats({
          baseBGTBalance: baseBGTBalanceNumber,
          currentBGTBalance: Number(currentBGTBalance),
          level2Threshold,
          level3Threshold,
          tokenIds: tokens.map((id) => Number(id)),
        });
      } catch (err) {
        setError("Failed to load wallet data");
        console.error(err);
      }
    };

    fetchData();
  }, [address, isConnected]);

  return (
    <main className="flex flex-col items-center justify-center py-16">
      <div className="w-full">
        {isConnected ? (
          stats ? (
            <>
              <div className="bg-slate-400 p-5 rounded-2xl mb-6">
                <h2 className="text-xl font-bold mb-4">Wallet Stats</h2>
                <p>Base BGT Balance at Mint: {stats.baseBGTBalance}</p>
                <p>BGT Balance to Level 2: {stats.level2Threshold}</p>
                <p>BGT Balance to Level 3: {stats.level3Threshold}</p>
                <p>Current BGT Balance: {stats.currentBGTBalance}</p>
                <p>Total NFTs Owned: {stats.tokenIds.length}</p>
                <p>Token IDs Owned: {stats.tokenIds.join(", ")}</p>
              </div>
              <div className="flex flex-row">
                {stats.tokenIds.map((tokenId) => (
                  <NftViewer key={tokenId} tokenId={tokenId} />
                ))}
              </div>
            </>
          ) : (
            <p>Loading...</p>
          )
        ) : (
          <p className="text-lg">Connect your wallet first.</p>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </main>
  );
};

export default Upload;
