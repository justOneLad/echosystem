export async function fetchSaucerSwapPrice(tokenId: string): Promise<string | null> {
  if (!tokenId) return null

  try {
    const response = await fetch(`https://api.saucerswap.finance/tokens/${tokenId}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    // Check if data is an object and has a priceUsd property
    if (typeof data === "object" && data !== null && "priceUsd" in data) {
      const price = data.priceUsd
      // Ensure the price is a valid number
      if (typeof price === "number" || (typeof price === "string" && !isNaN(Number.parseFloat(price)))) {
        return price.toString()
      }
    }

    throw new Error("Invalid or missing price data in API response")
  } catch (error) {
    console.error("Error fetching SaucerSwap price:", error instanceof Error ? error.message : String(error))
    return null
  }
}

