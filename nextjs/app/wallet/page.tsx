"use client";
import BeeIcon from "../../components/svg/bee-icon";
import NftLevel from "../../components/nft-level/nft-level";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  fetchStats,
  fetchMetadata,
  updateMetadata,
  handleMint,
} from "../../components/utils/custom-fetchs";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import Spinner from "@/components/spinner";

const Wallet = () => {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const handleMintNftNow = () => {
    if (!openConnectModal) return;

    if (!isConnected) {
      openConnectModal();
    } else {
      handleMint({
        mintFunctionName: "mintMainNFT",
      });
    }
  };

  const {
    data: stats,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: () => fetchStats(address as string),
    enabled: !!address && isConnected,
  });

  const queryClient = useQueryClient();

  // Query to fetch NFT metadata
  const {
    data: nftData,
    isLoading: nftLoading,
    isFetched: alreadyFetchedNftData,
    error: nftError,
  } = useQuery({
    queryKey: ["nftData"],
    queryFn: () =>
      fetchMetadata(stats?.tokenIds[2] || (stats?.tokenIds[0] as any)),
    // fetchMetadata(26),
    refetchInterval: 1000,
    enabled: !!stats?.tokenIds.length, // Only fetch metadata if tokenURI is available
  });

  // Mutation to update metadata
  const updateMetadataMutation = useMutation({
    mutationFn: () =>
      updateMetadata(stats?.tokenIds[2] || stats?.tokenIds[0] || 0),
    // updateMetadata(26),
    onSuccess: () => {
      console.log("Metadata updated successfully");
      // Invalidate and refetch the NFT data query
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: ["nftData"] });
    },
    onError: (error: Error) => {
      console.error("Error updating metadata:", error.message);
    },
  });

  if (
    !isConnected ||
    !address ||
    (alreadyFetchedNftData && !nftData) ||
    (alreadyFetchedNftData && !stats?.tokenIds.length)
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
            You need to mint lorem ipsum dolor set amed nuele
          </h1>
          <p className="text-[#949494] text-center">
            Mint your Irys + Bera NFT on Berachain. Join a vibrant community
            lorem
          </p>
          <div className="mt-24 z-50">
            <Button
              className="font-bold uppercase px-10"
              onClick={handleMintNftNow}
            >
              Mint your nft now
            </Button>
          </div>
          <img src="/bg-wallet.png" className="w-full -mt-28" alt="bg-wallet" />
        </div>
      </div>
    );
  }

  if (
    isLoading ||
    !stats ||
    nftLoading ||
    (!alreadyFetchedNftData && !nftData)
  ) {
    return (
      <div className="relative">
        <div className="-z-10 -mt-60 absolute inset-0 size-96 bg-white/80 rounded-full transform -translate-x-1/2 -translate-y-1/2 left-1/2 blur-[200px]"></div>
        <img
          src="/bg.png"
          className="absolute inset-0 w-full h-full opacity-10 -mt-2 -z-10"
        />
        <div className="flex items-center justify-center flex-col gap-5 pt-10">
          <div className="bg-[#451D07] size-14 grid place-items-center rounded-full">
            <BeeIcon className="animate-spin" />
          </div>
          <p className="text-center text-[#949494]">
            {isLoading ? "Loading wallet..." : "Fetching NFT..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || nftError) {
    return (
      <div className="relative">
        <div className="-z-10 -mt-60 absolute inset-0 size-96 bg-white/80 rounded-full transform -translate-x-1/2 -translate-y-1/2 left-1/2 blur-[200px]"></div>
        <img
          src="/bg.png"
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
      <Dialog
        open={!!updateMetadataMutation?.error}
        onOpenChange={() => updateMetadataMutation.reset()}
      >
        <DialogContent className="bg-[#111111CC] border-none w-[418px] backdrop-blur-md">
          <DialogHeader>
            <DialogDescription className=" flex items-center justify-center flex-col">
              <div className="bg-[#451D07] size-14 grid place-items-center rounded-full">
                <BeeIcon className="" />
              </div>
              <p className="text-white font-bold tracking-tight text-lg text-center mt-5 mb-5">
                {updateMetadataMutation.error?.message}
              </p>
            </DialogDescription>
            <DialogClose>
              <Button>OKAY</Button>
            </DialogClose>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="-z-10 -mt-60 absolute inset-0 size-96 bg-white/80 rounded-full transform -translate-x-1/2 -translate-y-1/2 left-1/2 blur-[200px]"></div>
      <img
        src="/bg.png"
        className="absolute inset-0 w-full h-full opacity-10 -mt-2 -z-10"
      />

      <div className="flex items-center justify-center flex-col gap-5 pt-10">
        <div className="bg-[#451D07] size-14 grid place-items-center rounded-full">
          <BeeIcon className="" />
        </div>
        <p className="text-center text-[#949494]">Your BTG Balance</p>
        <h1 className="text-5xl font-bold tracking-tight">
          {stats.currentBGTBalance}
        </h1>
      </div>
      <section className="mt-14">
        <NftLevel
          balance={stats?.currentBGTBalance}
          currentLevel={+nftData?.currentLevel || 0}
          steps={[
            stats?.baseBGTBalance,
            stats?.level2Threshold,
            stats?.level3Threshold,
          ]}
        />
      </section>
      <div className="flex items-center justify-center mt-20">
        <div className="mx-auto">
          <Button
            className="w-[200px]"
            disabled={updateMetadataMutation.isPending}
            onClick={() => updateMetadataMutation.mutate()}
          >
            {updateMetadataMutation.isPending ? <Spinner /> : "Update Metadata"}
          </Button>
        </div>
      </div>
      <div className="my-20 mx-auto flex items-center justify-center flex-col max-w-4xl pt-10 border-t border-[#1C1C1C]">
        <p className="text-lg text-[#949494] text-center max-w-3xl">
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
