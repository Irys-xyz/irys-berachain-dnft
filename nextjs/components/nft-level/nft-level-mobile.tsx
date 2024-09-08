import clsx from "clsx";
import Image from "next/image";

import LockIcon from "../svg/lock-icon";
import { lazy, useState } from "react";

type Props = {
  balance: number;
  steps?: number[];
  currentLevel: number;
  communityId?: string;
  viewing: number;
  setViewing: (viewing: number) => void;
};

type StepProps = {
  level: number;
  balance: number;
  completed: boolean;
  viewing: number;
};

/**
 * Step component
 * @description A single step in the NFT level
 * @param {StepProps} props - The props of the component
 * @param {number} props.level - The level of the step
 * @param {number} props.balance - The balance of the step
 * @param {boolean} props.completed - The completion status of the step
 * @param {number} props.viewing - The level being viewed
 */
const Step = ({ level, balance, completed, viewing }: StepProps) => {
  const containerClasses = "flex flex-col items-center justify-center z-10";

  const levelClasses = clsx("px-3 py-1 rounded-tl-xl rounded-tr-xl text-xs", {
    "bg-[#451D07] text-[#FEC601]": completed,
    "bg-[#212121] text-[#656565]": !completed,
  });

  const balanceClasses = clsx(
    "cursor-pointer border font-bold px-5 py-3 text-base",
    {
      "border-[#FEC601] text-[#FEC601] completed-step": completed,
      "border-[#4B4B4B] text-[#949494] uncompleted-step": !completed,
      "bg-[#4B4B4B] text-[#949494] uncompleted-step":
        viewing === level && !completed,
      "bg-[#FEC601] text-black uncompleted-step":
        viewing === level && completed,
      "rounded-tl-xl rounded-bl-xl": level === 1,
      "rounded-tr-xl rounded-br-xl": level === 3,
    }
  );

  return (
    <div className={containerClasses}>
      <div className={levelClasses}>Level {level}</div>
      <div className={balanceClasses}>{balance.toFixed(2)} BGT</div>
    </div>
  );
};

/**
 * NftLevel component
 * @description The NFT level component
 * @param {Props} props - The props of the component
 * @param {number} props.balance - The balance of the user
 * @param {number[]} props.steps - The steps of the component
 * @param {number} props.currentLevel - The current level of the user
 * @param {string} props.communityId - The id of the community
 * @param {number} props.viewing - The current viewing level
 * @param {number} props.setViewing - The function to set the current viewing level
 */
const NftLevelMobile = ({
  viewing,
  setViewing,
  balance,
  steps,
  currentLevel,
  communityId,
}: Props) => {
  const folderPath = communityId ?? "berachain";
  const BASE_NFT_WIDTH = 340;
  const BASE_RATIO = 0.461;

  return (
    <div className="flex  md:hidden flex-col gap-14 relative items-center justify-center">
      <div className="flex items-center justify-center relative ">
        {!communityId &&
          steps?.map((step, index) => (
            <div
              key={`step-${index}`}
              className="flex items-center"
              onClick={() => setViewing(index + 1)}
            >
              <Step
                viewing={viewing}
                level={index + 1}
                balance={step}
                completed={balance >= step || currentLevel >= index + 1}
              />
            </div>
          ))}
      </div>
      <div className="flex gap-4">
        <div className="relative">
          {currentLevel < viewing && (
            <>
              <div className="absolute inset-0 rounded-xl backdrop-blur-xl"></div>
              <LockIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </>
          )}
          <div className="overflow-hidden rounded-xl">
            <Image
              src={`/levels/${folderPath}/level-${viewing}.png`}
              width={BASE_NFT_WIDTH}
              height={BASE_NFT_WIDTH * BASE_RATIO}
              alt="level-one"
              className="rounded-xl hover:scale-125 transition-all hover:-rotate-6"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftLevelMobile;
