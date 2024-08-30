import { z } from "zod";
import { COMMUNITIES } from "./constants";

// Define the request body schema validator
const requestBodySchema = z.object({
  tokenId: z
    .number({
      message: "tokenId must be a number",
    })
    .nonnegative("tokenId must be a non-negative number")
    .int("tokenId must be an integer")
    .min(0, "tokenId must be greater than or equal to 0"),
  communityId: z
    .custom<string>((value) => COMMUNITIES.some((c) => c.value === value), {
      message: `communityId must be a valid community. Valid communities are: ${COMMUNITIES.map(
        (c) => c.value
      ).join(", ")}.`,
    })
    .optional(),
});

export { requestBodySchema };
