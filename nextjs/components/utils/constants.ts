import { env } from "./env";

const COMMUNITIES = [
  {
    title: "Berachain",
    image: "/communities/bera.png",
    value: "berachain",
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

export { COMMUNITIES };
