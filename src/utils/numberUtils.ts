export function calculateBurned(maxSupply: String): String {
  // Ensure maxSupply is present
  if (!maxSupply) {
    return "";
  }

  // Convert maxSupply to a number with a decimal point
  const decimalPosition = maxSupply.length - 8;
  const formattedSupply =
    maxSupply.slice(0, decimalPosition) +
    "." +
    maxSupply.slice(decimalPosition);

  // Perform the subtraction
  const result = 10000000 - Number(formattedSupply);

  // Format the result with commas and return
  return result.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function natToFormattedString(
  numberString: String,
  decimalPosition = 8,
): String {
  // Determine the position to insert the decimal point
  const insertLoc = numberString.length - decimalPosition;

  // Insert the decimal point
  const formattedString =
    numberString.slice(0, insertLoc) + "." + numberString.slice(insertLoc);

  // Convert to a number and format with commas
  const number = Number(formattedString);

  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
