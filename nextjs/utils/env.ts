import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_BERA_CHAIN_ID: z
    .string()
    .min(1, "NEXT_PUBLIC_BERA_CHAIN_ID is required and cannot be empty"),
  NEXT_PUBLIC_BERA_CHAIN_NAME: z
    .string()
    .min(1, "NEXT_PUBLIC_BERA_CHAIN_NAME is required and cannot be empty"),
  NEXT_PUBLIC_BERA_RPC: z
    .string()
    .min(1, "NEXT_PUBLIC_BERA_RPC is required and cannot be empty"),
  NEXT_PUBLIC_BGT_CONTRACT_ADDRESS: z
    .string()
    .min(1, "NEXT_PUBLIC_BGT_CONTRACT_ADDRESS is required and cannot be empty"),
  NEXT_PUBLIC_EXPLORER: z
    .string()
    .min(1, "NEXT_PUBLIC_EXPLORER is required and cannot be empty"),
  NEXT_PUBLIC_IRYS_GATEWAY: z
    .string()
    .min(1, "NEXT_PUBLIC_IRYS_GATEWAY is required and cannot be empty"),
  NEXT_PUBLIC_WALLET_CONNECT_ID: z
    .string()
    .min(1, "NEXT_PUBLIC_WALLET_CONNECT_ID is required and cannot be empty"),
  NEXT_PUBLIC_IRYS_THE_BERA_NFT: z
    .string()
    .min(1, "NEXT_PUBLIC_IRYS_THE_BERA_NFT is required and cannot be empty"),
  NEXT_PUBLIC_PERCENT_TO_LEVEL_2: z
    .string()
    .min(1, "NEXT_PUBLIC_PERCENT_TO_LEVEL_2 is required and cannot be empty"),
  NEXT_PUBLIC_PERCENT_TO_LEVEL_3: z
    .string()
    .min(1, "NEXT_PUBLIC_PERCENT_TO_LEVEL_3 is required and cannot be empty"),
  NEXT_PUBLIC_NFT_NAMES: z
    .string()
    .min(1, "NEXT_PUBLIC_NFT_NAMES is required and cannot be empty"),
  NEXT_PUBLIC_BASE_NFT_MANIFEST_ID: z
    .string()
    .min(1, "NEXT_PUBLIC_BASE_NFT_MANIFEST_ID is required and cannot be empty"),
  NEXT_PUBLIC_YEET_COMMUNITY_MANIFEST_ID: z
    .string()
    .min(
      1,
      "NEXT_PUBLIC_YEET_COMMUNITY_MANIFEST_ID is required and cannot be empty"
    ),
  NEXT_PUBLIC_BERALAND_COMMUNITY_MANIFEST_ID: z
    .string()
    .min(
      1,
      "NEXT_PUBLIC_BERALAND_COMMUNITY_MANIFEST_ID is required and cannot be empty"
    ),
  NEXT_PUBLIC_BERAMARKET_COMMUNITY_MANIFEST_ID: z
    .string()
    .min(
      1,
      "NEXT_PUBLIC_BERAMARKET_COMMUNITY_MANIFEST_ID is required and cannot be empty"
    ),
  NEXT_PUBLIC_KINGDOMLY_COMMUNITY_MANIFEST_ID: z
    .string()
    .min(
      1,
      "NEXT_PUBLIC_KINGDOMLY_COMMUNITY_MANIFEST_ID is required and cannot be empty"
    ),
  NEXT_PUBLIC_THJ_COMMUNITY_MANIFEST_ID: z
    .string()
    .min(
      1,
      "NEXT_PUBLIC_THJ_COMMUNITY_MANIFEST_ID is required and cannot be empty"
    ),
});

/**
 * Public environment variables.
 * Only works with variables that are prefixed with NEXT_PUBLIC_
 */
export const env = envSchema.parse({
  NEXT_PUBLIC_BERA_CHAIN_ID: process.env.NEXT_PUBLIC_BERA_CHAIN_ID as string,
  NEXT_PUBLIC_BERA_CHAIN_NAME: process.env
    .NEXT_PUBLIC_BERA_CHAIN_NAME as string,
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
  NEXT_PUBLIC_BERALAND_COMMUNITY_MANIFEST_ID: process.env
    .NEXT_PUBLIC_BERALAND_COMMUNITY_MANIFEST_ID as string,
  NEXT_PUBLIC_BERAMARKET_COMMUNITY_MANIFEST_ID: process.env
    .NEXT_PUBLIC_BERAMARKET_COMMUNITY_MANIFEST_ID as string,
  NEXT_PUBLIC_KINGDOMLY_COMMUNITY_MANIFEST_ID: process.env
    .NEXT_PUBLIC_KINGDOMLY_COMMUNITY_MANIFEST_ID as string,
  NEXT_PUBLIC_THJ_COMMUNITY_MANIFEST_ID: process.env
    .NEXT_PUBLIC_THJ_COMMUNITY_MANIFEST_ID as string,
});
