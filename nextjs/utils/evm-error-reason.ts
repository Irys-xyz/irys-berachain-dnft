/**
 * Extracts the revert reason from a given EVM error message.
 * @param text The EVM error message to extract the reason from.
 * @returns The extracted reason if found, or null if not found.
 */
const extractReason = (text: string) => {
  const fixedPhrase = "reverted with the following reason:\n";
  const startIndex = text.indexOf(fixedPhrase);

  if (startIndex === -1) return null; // Fixed phrase not found

  const textAfterPhrase = text.slice(startIndex + fixedPhrase.length).trim();
  const endIndex = textAfterPhrase.indexOf("\n\n");

  return endIndex === -1
    ? textAfterPhrase
    : textAfterPhrase.slice(0, endIndex).trim();
};

export default extractReason;
