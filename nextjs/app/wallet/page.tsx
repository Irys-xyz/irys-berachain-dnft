"use client";
import BeeIcon from "@/components/svg/bee-icon";
import NftLevel from "@/components/nft-level/nft-level";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  fetchStats,
  fetchMetadata,
  updateMetadata,
  handleMint,
} from "@/lib/custom-fetchs";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import SpinnerIcon from "@/components/svg/spinner-icon";
import { useState } from "react";
import { useToast } from "@/components/hooks/use-toast";
import ErrorDialog from "@/components/error-dialog";
import extractReason from "@/utils/evm-error-reason";
import NftLevelMobile from "@/components/nft-level/nft-level-mobile";

const Wallet = () => {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleMintNftNow = async () => {
    setLoading(true);
    if (!isConnected) {
      openConnectModal?.();
    } else {
      const res = await handleMint({
        mintFunctionName: "mintMainNFT",
      });

      if (res.ok === false) {
        toast({
          title: extractReason(res.error) ?? "Error minting NFT",
        });
      }

      if (res.ok) {
        ["stats", "nftData", "communityNftData"].forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
    }
    setLoading(false);
  };

  const {
    data: stats,
    error: statsError,
    isLoading: isStatsLoading,
  } = useQuery({
    queryKey: ["stats", address],
    queryFn: () => fetchStats(address as string),
    enabled: !!address && isConnected,
  });

  const queryClient = useQueryClient();

  // Query to fetch NFT metadata
  const {
    data: nftData,
    error: nftError,
    isLoading: isNftLoading,
    isFetched: isNftFetched,
  } = useQuery({
    queryKey: ["nftData", address],
    queryFn: () => stats?.tokenIds.length && fetchMetadata(stats?.tokenIds[0]),
    refetchInterval: 1000,
    enabled: !!stats?.tokenIds.length,
  });

  const [viewing, setViewing] = useState(+nftData?.currentLevel || 1);

  const { data: communityNftData } = useQuery({
    queryKey: ["communityNftData", address],
    queryFn: () => stats?.tokenIds.length && fetchMetadata(stats?.tokenIds[1]),
    refetchInterval: 1000,
    enabled: !!stats?.tokenIds?.length && !!stats?.tokenIds[1],
  });
  // Mutation to update metadata
  const updateMetadataMutation = useMutation({
    mutationFn: () =>
      updateMetadata({
        walletAddress: address as string,
      }),
    onSuccess: () => {
      ["stats", "nftData", "communityNftData"].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] });
      });
      toast({
        title:
          "Metadata updated successfully, wait a few seconds for the changes to reflect.",
      });
    },
    onError: (error: Error) => {
      console.error("Error updating metadata:", error.message);
    },
  });

  if (
    !isConnected ||
    !address ||
    (isNftFetched && !nftData) ||
    (!isNftFetched && !stats?.tokenIds.length)
  ) {
    return (
      <div className="relative px-8 md:px-0">
        <div className="-z-10 -mt-60 absolute inset-0 size-96 bg-white/80 rounded-full transform -translate-x-1/2 -translate-y-1/2 left-1/2 blur-[200px]"></div>
        <img
          src="/bg.png"
          className="absolute inset-0 w-full h-full opacity-10 -mt-2 -z-10"
        />
        <div className="flex items-center justify-center flex-col gap-5 pt-32">
          <h1 className="text-6xl font-bold text-white text-center max-w-3xl tracking-tight">
            You don&apos;t have a NFT yet
          </h1>
          <p className="text-[#949494] text-center">
            Mint your Irys + Bera NFT on Berachain. Join a vibrant community.
          </p>
          <div className="mt-24 z-50">
            <Button
              className="font-bold uppercase px-10"
              onClick={handleMintNftNow}
            >
              {loading ? <SpinnerIcon /> : "Mint your nft now"}
            </Button>
          </div>
          <img
            src="/bg-wallet.png"
            className="w-full -mt-28"
            alt="background image"
          />
        </div>
      </div>
    );
  }

  if (isStatsLoading || isNftLoading) {
    return (
      <div className="relative">
        <div className="-z-10 -mt-60 absolute inset-0 size-96 bg-white/80 rounded-full transform -translate-x-1/2 -translate-y-1/2 left-1/2 blur-[200px]"></div>
        <img
          src="/bg.png"
          alt="background image"
          className="absolute inset-0 w-full h-full opacity-10 -mt-2 -z-10"
        />
        <div className="flex items-center justify-center flex-col gap-5 pt-10">
          <div className="bg-[#451D07] size-14 p-3 grid place-items-center rounded-full">
            <BeeIcon className="animate-spin" />
          </div>
          <p className="text-center text-[#949494]">
            {isStatsLoading ? "Loading wallet..." : "Fetching NFT..."}
          </p>
        </div>
      </div>
    );
  }

  if (statsError || nftError) {
    return (
      <div className="relative">
        <div className="-z-10 -mt-60 absolute inset-0 size-96 bg-white/80 rounded-full transform -translate-x-1/2 -translate-y-1/2 left-1/2 blur-[200px]"></div>
        <img
          src="/bg.png"
          alt="background image"
          className="absolute inset-0 w-full h-full opacity-10 -mt-2 -z-10"
        />
        <div className="flex items-center justify-center flex-col gap-5 pt-10">
          <div className="bg-[#451D07] size-14 grid place-items-center rounded-full">
            <BeeIcon className="animate-spin" />
          </div>
          <p className="text-center text-[#949494]">
            Error while communicating with the blockchain. <br /> Please, try
            again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <ErrorDialog updateMetadataMutation={updateMetadataMutation} />

      <div className="-z-10 -mt-60 absolute inset-0 size-96 bg-white/80 rounded-full transform -translate-x-1/2 -translate-y-1/2 left-1/2 blur-[200px]"></div>
      <img
        alt="background image"
        src="/bg.png"
        className="absolute inset-0 w-full h-full opacity-10 -mt-2 -z-10"
      />

      <div className="hidden md:flex items-center justify-center flex-col gap-5 pt-10">
        <div className="bg-[#451D07] p-3 size-14 grid place-items-center rounded-full">
          <BeeIcon className="" />
        </div>
        <p className="text-center text-[#949494]">Your BTG Balance</p>
        <h1 className="text-5xl font-bold tracking-tight">
          {stats?.currentBGTBalance}
        </h1>
      </div>
      <div className="border-b border-white/10 md:hidden flex items-start justify-center flex-col gap-5 py-10 px-5 bg-black">
        <div className="flex items-center gap-2">
          <div className="bg-[#451D07] p-1 size-6 grid place-items-center rounded-full">
            <BeeIcon className="" />
          </div>
          <p className="text-center text-[#949494]">Your BTG Balance</p>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          {stats?.currentBGTBalance.toFixed(12)}
        </h1>
      </div>
      <section className="mt-14">
        <NftLevelMobile
          viewing={viewing}
          setViewing={setViewing}
          balance={stats?.currentBGTBalance ?? 0}
          currentLevel={+nftData?.currentLevel || 0}
          steps={[
            stats?.baseBGTBalance ?? 0,
            stats?.level2Threshold ?? 0,
            stats?.level3Threshold ?? 0,
          ]}
        />
        <NftLevel
          balance={stats?.currentBGTBalance ?? 0}
          currentLevel={+nftData?.currentLevel || 0}
          steps={[
            stats?.baseBGTBalance ?? 0,
            stats?.level2Threshold ?? 0,
            stats?.level3Threshold ?? 0,
          ]}
        />
      </section>
      {communityNftData && (
        <section className="-mt-10">
          <NftLevelMobile
            viewing={viewing}
            setViewing={setViewing}
            communityId={communityNftData?.communityId}
            balance={stats?.currentBGTBalance ?? 0}
            currentLevel={+communityNftData?.currentLevel || 0}
            steps={[
              stats?.baseBGTBalance ?? 0,
              stats?.level2Threshold ?? 0,
              stats?.level3Threshold ?? 0,
            ]}
          />
          <NftLevel
            communityId={communityNftData?.communityId}
            balance={stats?.currentBGTBalance ?? 0}
            currentLevel={+communityNftData?.currentLevel || 0}
            steps={[
              stats?.baseBGTBalance ?? 0,
              stats?.level2Threshold ?? 0,
              stats?.level3Threshold ?? 0,
            ]}
          />
        </section>
      )}
      <div className="flex items-center justify-center mt-20">
        <div className="mx-auto">
          <Button
            className="w-[200px]"
            disabled={updateMetadataMutation.isPending}
            onClick={() => updateMetadataMutation.mutate()}
          >
            {updateMetadataMutation.isPending ? (
              <SpinnerIcon />
            ) : (
              "Update Metadata"
            )}
          </Button>
        </div>
      </div>
      <div className="my-20 mx-auto flex items-center justify-center flex-col max-w-4xl pt-10 border-t border-[#1C1C1C]">
        <p className="text-lg text-[#949494] text-center max-w-3xl px-6 md:px-0">
          $BGT cannot be bought and isn’t transferable. The only way to earn
          $BGT is by providing liquidity and then staking the LP token into a
          whitelisted gauge.
        </p>
        <div className="mt-10">
          <Link
            href="https://bartio.station.berachain.com/gauge?ref=berachain.ghost.io"
            target="_blank"
          >
            <Button className="font-normal">Stake Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
