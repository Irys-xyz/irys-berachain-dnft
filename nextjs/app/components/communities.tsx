import { Button } from "@/components/ui/button";
import Heading from "./heading";
import LockIcon from "./svg/lock-icon";
import { FC } from "react";

const COMMUNITIES = [
  {
    title: "Berachain",
    image: "/communities/bera.png",
    value: "berachain",
    description: "Short description goes here this is the second line.",
  },
  {
    title: "Yeet",
    image: "/communities/yeet.png",
    value: "yeet",
    description: "Short description goes here this is the second line.",
  },
  {
    title: "The Honey Jar",
    image: "/communities/thehoneyjar.png",
    value: "the-honey-jar",
    description: "Short description goes here this is the second line.",
  },
  {
    title: "Kingdomly",
    image: "/communities/kingdomly.png",
    value: "kingdomly",
    description: "Short description goes here this is the second line.",
  },
  {
    title: "BeraLand",
    image: "/communities/beraland.png",
    value: "beraland",
    description: "Short description goes here this is the second line.",
  },
];

type LockedModalProps = {
  isVisible: boolean;
};

const LockedModal: FC<LockedModalProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <>
      <div className="backdrop-filter backdrop-blur-md bg-black absolute inset-0 bg-opacity-80 z-20"></div>
      <div className="rounded-xl border-[#0F0F0F] border flex-col gap-8 bg-[#111111CC] bg-opacity-80 backdrop-blur-md px-10 size-[473px] absolute inset-0 flex items-center justify-center z-30 m-auto">
        <div className="size-20 grid place-items-center text-[#515151] bg-[#111111] rounded-full">
          <LockIcon className="mx-auto" />
        </div>
        <Heading level="h3" className="text-center">
          Mint 1 NFT to unlock the community
        </Heading>
        <p className="text-center">
          Mint your Irys + Bera NFT on Berachain. Join a vibrant community.
        </p>
        <div className="px-4 w-full">
          <Button>MINT YOUR NFT NOW</Button>
        </div>
      </div>
    </>
  );
};

type Props = {
  locked: boolean;
};

const Communities: FC<Props> = ({ locked }) => {
  return (
    <div className="relative pt-16 pb-20">
      <LockedModal isVisible={locked} />
      <div className="container">
        <Heading level="h2" className="text-center">
          Community NFT
        </Heading>
        <p className="mt-3 text-customGray text-center text-[#949494]">
          Mint your Irys + Bera NFT on Berachain. Join a vibrant community.
        </p>
        <div className="grid grid-cols-10 w-full gap-5 mt-20 ">
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
                <Button>MINT NFT</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Communities;
