"use client";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { handleMint } from "./utils/custom-fetchs";
import { Button } from "@/components/ui/button";
import SpinnerIcon from "@/components/svg/spinner-icon";
import { useRouter } from "next/navigation";
import { COMMUNITIES } from "./utils/constants";
import { useToast } from "./hooks/use-toast";
import extractReason from "./utils/evm-error-reason";
import { useQueryClient } from "@tanstack/react-query";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  customText?: string;
  customSuccessText?: string;
  communityId?: (typeof COMMUNITIES)[number]["value"];
  disableAfterSuccess?: boolean;
}

const MintNftNowButton = ({ className, ...props }: Props) => {
  const queryClient = useQueryClient();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState(false);
  const navigation = useRouter();
  const { toast } = useToast();

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
      if (!response.ok) {
        toast({
          title: extractReason(response.error) ?? "Error minting NFT",
        });
      } else {
        setSuccess(true);
        ["stats", "nftData", "communityNftData"].forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
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
        <SpinnerIcon />
      ) : success ? (
        props.customSuccessText ?? "CHECK MY WALLET"
      ) : (
        props?.customText ?? "MINT NFT NOW"
      )}
    </Button>
  );
};

export default MintNftNowButton;
