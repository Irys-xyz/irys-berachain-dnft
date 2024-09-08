import clsx from "clsx";
import Image from "next/image";

import LockIcon from "../svg/lock-icon";
import { lazy } from "react";

type Props = {
  balance: number;
  steps?: number[];
  currentLevel: number;
  communityId?: string;
};

type StepProps = {
  level: number;
  balance: number;
  completed: boolean;
};

/**
 * Step component
 * @description A single step in the NFT level
 * @param {StepProps} props - The props of the component
 * @param {number} props.level - The level of the step
 * @param {number} props.balance - The balance of the step
 * @param {boolean} props.completed - The completion status of the step
 */
const Step = ({ level, balance, completed }: StepProps) => {
  const containerClasses = "flex flex-col items-center justify-center z-10";

  const levelClasses = clsx("px-3 py-1 rounded-tl-xl rounded-tr-xl text-xs", {
    "bg-[#451D07] text-[#FEC601]": completed,
    "bg-[#212121] text-[#656565]": !completed,
  });

  const balanceClasses = clsx(
    "border font-bold px-5 py-3 rounded-full text-lg",
    {
      "border-[#FEC601] text-[#FEC601] completed-step": completed,
      "border-[#4B4B4B] text-[#949494] uncompleted-step": !completed,
    }
  );

  return (
    <div className={containerClasses}>
      <div className={levelClasses}>Level {level}</div>
      <div className={balanceClasses}>{balance.toFixed(5)} BGT</div>
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
 */
const NftLevel = ({ balance, steps, currentLevel, communityId }: Props) => {
  const folderPath = communityId ?? "berachain";
  const BASE_NFT_WIDTH = 260;
  const BASE_RATIO = 0.461;

  return (
    <div className="hidden md:flex flex-col gap-14 relative items-center justify-center px-4 lg:px-0">
      <div className="flex items-center justify-center relative">
        {!communityId &&
          steps?.map((step, index) => (
            <div key={`step-${index}`} className="flex items-center">
              <Step
                level={index + 1}
                balance={step}
                completed={balance >= step || currentLevel >= index + 1}
              />
              {/* custom horizontal line between each level */}
              {((index < steps.length - 1 && balance >= steps[index + 1]) ||
                (index < steps.length - 1 && currentLevel > index + 1)) && (
                <div className="debug top-1/2 mt-5 w-28 h-[2px] bg-[#FEC601] completed-step"></div>
              )}
              {((index < steps.length - 1 &&
                balance < steps[index + 1] &&
                currentLevel < index + 2) ||
                (index < steps.length - 1 && currentLevel < index + 2)) && (
                <div className="top-1/2 mt-5 w-28 h-[2px] bg-[#4B4B4B] uncompleted-step"></div>
              )}
            </div>
          ))}
      </div>
      <div className="flex gap-4">
        <div className="relative">
          {currentLevel < 1 && (
            <>
              <div className="absolute inset-0 rounded-xl backdrop-blur-xl"></div>
              <LockIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </>
          )}
          <div className="overflow-hidden rounded-xl">
            <Image
              src={`/levels/${folderPath}/level-1.png`}
              width={BASE_NFT_WIDTH}
              height={BASE_NFT_WIDTH * BASE_RATIO}
              alt="level-one"
              className="rounded-xl hover:scale-125 transition-all hover:-rotate-6"
            />
          </div>
        </div>
        <div className="relative">
          {currentLevel < 2 && (
            <>
              <div className="absolute inset-0 rounded-xl backdrop-blur-xl"></div>
              <LockIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </>
          )}
          <div className="overflow-hidden rounded-xl">
            <Image
              src={`/levels/${folderPath}/level-2.png`}
              width={BASE_NFT_WIDTH}
              height={BASE_NFT_WIDTH * BASE_RATIO}
              alt="level-two"
              className="rounded-xl hover:scale-125 transition-all hover:-rotate-6"
            />
          </div>
        </div>
        <div className="relative">
          {currentLevel < 3 && (
            <>
              <div className="absolute inset-0 rounded-xl backdrop-blur-xl"></div>
              <LockIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </>
          )}
          <div className="overflow-hidden rounded-xl">
            <Image
              src={`/levels/${folderPath}/level-3.png`}
              width={BASE_NFT_WIDTH}
              height={BASE_NFT_WIDTH * BASE_RATIO}
              alt="level-three"
              className="rounded-xl hover:scale-125 transition-all hover:-rotate-6"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftLevel;
