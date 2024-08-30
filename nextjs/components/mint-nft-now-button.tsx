"use client";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { handleMint } from "./utils/custom-fetchs";
import { Button } from "@/components/ui/button";
import Spinner from "./spinner";
import { useRouter } from "next/navigation";
import { COMMUNITIES } from "./utils/constants";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  customText?: string;
  customSuccessText?: string;
  communityId?: (typeof COMMUNITIES)[number]["value"];
  disableAfterSuccess?: boolean;
}

const MintNftNowButton = ({ className, ...props }: Props) => {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState(false);
  const navigation = useRouter();

  const handleMintNftNow = async () => {
    if (success) {
      navigation.push("/wallet");
      return;
    }

    if (!isConnected) {
      if (openConnectModal) {
        openConnectModal();
      }
    } else {
      setLoading(true);
      const response = await handleMint(
        props.communityId
          ? {
              mintFunctionName: "mintCommunityNFT",
              communityId: props.communityId,
            }
          : {
              mintFunctionName: "mintMainNFT",
            }
      );
      if (response.ok) {
        setSuccess(true);
      }
    }
    setLoading(false);
  };

  return (
    <Button
      className={className}
      onClick={handleMintNftNow}
      {...props}
      disabled={loading || props.disableAfterSuccess ? success : false}
    >
      {loading ? (
        <Spinner />
      ) : success ? (
        props.customSuccessText ?? "CHECK MY WALLET"
      ) : (
        props?.customText ?? "MINT NFT NOW"
      )}
    </Button>
  );
};

export default MintNftNowButton;
