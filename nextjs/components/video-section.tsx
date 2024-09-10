"use client";
import { FC, useState } from "react";
import ReactPlayer from "react-player";
import BeeIcon from "./svg/bee-icon";

/**
 * NFT Video Component
 * @returns {JSX.Element}
 */
const VideoSection: FC = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState(true);

  const handleReady = () => {
    setIsLoading(false);
  };

  return (
    <div className="col-span-12 md:col-span-6 mt-6 w-full relative h-full min-h-[389px] xl:h-[810px] rounded-xl overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-[#451D07] size-14 p-3 grid place-items-center rounded-full">
            <BeeIcon className="animate-spin" />
          </div>
        </div>
      )}
      <div className="overflow-hidden rounded-xl">
        <ReactPlayer
          url="https://devnet.irys.xyz/tx/76GLpUzW1SM7hybDbPkwf3ZUMp2tXzizTa4HjrnFwZzq/data"
          className="rounded-xl"
          controls
          playing
          muted
          width="100%"
          height={"auto"}
          onReady={handleReady}
          style={{ opacity: isLoading ? 0 : 1 }}
        />
      </div>
    </div>
  );
};

export default VideoSection;
