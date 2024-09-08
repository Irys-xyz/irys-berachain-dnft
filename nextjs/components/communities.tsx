"use client";
import LockIcon from "./svg/lock-icon";
import { FC } from "react";
import MintNftNowButton from "./mint-nft-now-button";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { fetchStats } from "@/lib/custom-fetchs";
import { COMMUNITIES } from "@/utils/constants";
import clsx from "clsx";

type LockedModalProps = {
  isVisible: boolean;
};

const LockedModal: FC<LockedModalProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <>
      <div className="backdrop-filter backdrop-blur-md bg-black absolute inset-0 bg-opacity-60 z-20"></div>
      <div className="rounded-xl border-[#0F0F0F] border flex-col gap-6 bg-[#111111CC] bg-opacity-80 backdrop-blur-md px-10 w-[350px] h-[450px] md:size-[440px] absolute inset-0 flex items-center justify-center z-30 m-auto">
        <div className="size-20 grid place-items-center text-[#515151] bg-[#111111] rounded-full">
          <LockIcon className="mx-auto" />
        </div>
        <h3 className="text-center text-2xl font-bold leading-relaxed">
          Mint the Irys x Berachain NFT
        </h3>
        <p className="text-center text-[#D1D1D1]">
          Unlock Exclusive Community NFT Designs and <br />
          Be Part of the Lore.
        </p>
        <div className="px-4 w-full mt-3">
          <MintNftNowButton />
        </div>
      </div>
    </>
  );
};

type Props = {
  locked: boolean;
};

const Communities: FC<Props> = () => {
  const { address, isConnected, isDisconnected } = useAccount();
  const { data: stats } = useQuery({
    queryKey: ["stats", address],
    queryFn: () => fetchStats(address as string),
    enabled: !!address && isConnected,
  });

  return (
    <div className="relative pt-16 pb-20">
      <LockedModal
        isVisible={isDisconnected || !(stats?.tokenIds?.length ?? 0 > 0)}
      />
      <div className="container">
        <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold text-center">
          Mint Your Berachain x Irys Ecosystem NFT
        </h2>
        {/* <p className="mt-3 text-customGray text-center text-[#949494]">
          Mint your Irys + Bera NFT on Berachain. Join a vibrant community.
        </p> */}
        <div
          className={clsx(
            "grid grid-cols-10 w-full gap-5 mt-20",
            (isDisconnected || !(stats?.tokenIds?.length ?? 0 > 0)) &&
              "max-h-56 md:max-h-max overflow-hidden"
          )}
        >
          {COMMUNITIES.map((community, index) => (
            <div
              key={index}
              className="gap-7 md:col-span-2 col-span-10 bg-[#111111] h-[366px] w-full rounded-xl flex items-center justify-center flex-col"
            >
              <div className="bg-[#272727] rounded-full size-[100px] flex items-center justify-center py-4 px-5">
                <img src={community.image} alt={community.title} />
              </div>
              <div className="grid place-items-center px-4">
                <h3 className="text-base font-bold">{community.title}</h3>
                <p className="text-customGray mt-3 text-center text-sm">
                  {community.description}
                </p>
              </div>
              <div className="px-4 w-full">
                <MintNftNowButton
                  disableAfterSuccess
                  customText="MINT NFT"
                  customSuccessText="NFT MINTED"
                  communityId={community.value}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Communities;
