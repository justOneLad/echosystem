export async function fetchSaucerSwapPrice(tokenId: string): Promise<string | null> {
  if (!tokenId) return null

  try {
    const response = await fetch(`https://api.saucerswap.finance/tokens/${tokenId}`)
    const data = await response.json()
    return data.priceUsd
  } catch (error) {
    console.error("Error fetching SaucerSwap price:", error)
    return null
  }
}

