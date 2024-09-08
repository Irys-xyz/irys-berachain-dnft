import { env } from "@/utils/env";

const COMMUNITIES = [
  {
    title: "Beramarket",
    image: "/communities/beramarket.png",
    value: "beramarket",
    description: "Short description goes here this is the second line.",
    manifest: env.NEXT_PUBLIC_BERAMARKET_COMMUNITY_MANIFEST_ID,
  },
  {
    title: "Yeet",
    image: "/communities/yeet.png",
    value: "yeet",
    description: "Short description goes here this is the second line.",
    manifest: env.NEXT_PUBLIC_YEET_COMMUNITY_MANIFEST_ID,
  },
  {
    title: "The Honey Jar",
    image: "/communities/thehoneyjar.png",
    value: "the-honey-jar",
    description: "Short description goes here this is the second line.",
    manifest: env.NEXT_PUBLIC_THJ_COMMUNITY_MANIFEST_ID,
  },
  {
    title: "Kingdomly",
    image: "/communities/kingdomly.png",
    value: "kingdomly",
    description: "Short description goes here this is the second line.",
    manifest: env.NEXT_PUBLIC_KINGDOMLY_COMMUNITY_MANIFEST_ID,
  },
  {
    title: "BeraLand",
    image: "/communities/beraland.png",
    value: "beraland",
    description: "Short description goes here this is the second line.",
    manifest: env.NEXT_PUBLIC_BERALAND_COMMUNITY_MANIFEST_ID,
  },
] as const;

const ERROR_UPDATE_METADATA_24H =
  "You can only try updating NFT metadata once per day. Try again tomorrow.";

const LEVEL_PERCENT_MAP: Record<number, bigint> = {
  0: BigInt(0),
  1: BigInt(parseInt(env.NEXT_PUBLIC_PERCENT_TO_LEVEL_2 as string, 10)),
  2: BigInt(parseInt(env.NEXT_PUBLIC_PERCENT_TO_LEVEL_3 as string, 10)),
};

export { COMMUNITIES, ERROR_UPDATE_METADATA_24H, LEVEL_PERCENT_MAP };
