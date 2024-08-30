import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_BERA_RPC: z.string(),
  NEXT_PUBLIC_BGT_CONTRACT_ADDRESS: z.string(),
  NEXT_PUBLIC_EXPLORER: z.string(),
  NEXT_PUBLIC_IRYS_GATEWAY: z.string(),
  NEXT_PUBLIC_WALLET_CONNECT_ID: z.string(),
  NEXT_PUBLIC_IRYS_THE_BERA_NFT: z.string(),
  NEXT_PUBLIC_PERCENT_TO_LEVEL_2: z.string(),
  NEXT_PUBLIC_PERCENT_TO_LEVEL_3: z.string(),
  NEXT_PUBLIC_NFT_NAMES: z.string(),
  NEXT_PUBLIC_BASE_NFT_MANIFEST_ID: z.string(),
  NEXT_PUBLIC_YEET_COMMUNITY_MANIFEST_ID: z.string(),
});

/**
 * Public environment variables.
 * Only works with variables that are prefixed with NEXT_PUBLIC_
 */
export const env = envSchema.parse({
  NEXT_PUBLIC_BERA_RPC: process.env.NEXT_PUBLIC_BERA_RPC as string,
  NEXT_PUBLIC_BGT_CONTRACT_ADDRESS: process.env
    .NEXT_PUBLIC_BGT_CONTRACT_ADDRESS as string,
  NEXT_PUBLIC_EXPLORER: process.env.NEXT_PUBLIC_EXPLORER as string,
  NEXT_PUBLIC_IRYS_GATEWAY: process.env.NEXT_PUBLIC_IRYS_GATEWAY as string,
  NEXT_PUBLIC_WALLET_CONNECT_ID: process.env
    .NEXT_PUBLIC_WALLET_CONNECT_ID as string,
  NEXT_PUBLIC_IRYS_THE_BERA_NFT: process.env
    .NEXT_PUBLIC_IRYS_THE_BERA_NFT as string,
  NEXT_PUBLIC_PERCENT_TO_LEVEL_2: process.env
    .NEXT_PUBLIC_PERCENT_TO_LEVEL_2 as string,
  NEXT_PUBLIC_PERCENT_TO_LEVEL_3: process.env
    .NEXT_PUBLIC_PERCENT_TO_LEVEL_3 as string,
  NEXT_PUBLIC_NFT_NAMES: process.env.NEXT_PUBLIC_NFT_NAMES as string,
  NEXT_PUBLIC_BASE_NFT_MANIFEST_ID: process.env
    .NEXT_PUBLIC_BASE_NFT_MANIFEST_ID as string,
  NEXT_PUBLIC_YEET_COMMUNITY_MANIFEST_ID: process.env
    .NEXT_PUBLIC_YEET_COMMUNITY_MANIFEST_ID as string,
});