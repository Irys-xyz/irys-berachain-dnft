import { FC } from "react";

const VideoSection: FC = () => {
  return (
    <div className="col-span-12 md:col-span-6 mt-6 w-full aspect-video">
      <video className="rounded-xl" controls autoPlay>
        <source src="/nft-collab.mp4" type="video/mp4" />
      </video>
    </div>
  );
};

export default VideoSection;
