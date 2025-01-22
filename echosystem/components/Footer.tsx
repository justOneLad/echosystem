"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { projects, categories } from "@/lib/projects"

export function Footer() {
  const [currentBlock, setCurrentBlock] = useState<number | null>(null)
  const [hederaPrice, setHederaPrice] = useState<number | null>(null)
  const [totalProjects, _] = useState<number>(projects.length)
  const [totalCategories, __] = useState<number>(categories.length)

  const fetchData = async () => {
    // Fetch current block
    try {
      const blockResponse = await fetch("https://mainnet-public.mirrornode.hedera.com/api/v1/blocks?limit=1&order=desc")
      if (!blockResponse.ok) {
        throw new Error(`HTTP error! status: ${blockResponse.status}`)
      }
      const blockData = await blockResponse.json()
      setCurrentBlock(blockData.blocks[0].number)
    } catch (error) {
      console.error("Error fetching current block:", error)
      setCurrentBlock(null)
    }

    // Fetch HBAR price
    try {
      const priceResponse = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd",
      )
      if (!priceResponse.ok) {
        throw new Error(`HTTP error! status: ${priceResponse.status}`)
      }
      const priceData = await priceResponse.json()
      if (!priceData["hedera-hashgraph"] || !priceData["hedera-hashgraph"].usd) {
        throw new Error("Invalid price data received")
      }
      setHederaPrice(priceData["hedera-hashgraph"].usd)
    } catch (error) {
      console.error("Error fetching HBAR price:", error instanceof Error ? error.message : String(error))
      setHederaPrice(null)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="bg-secondary py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold mb-4">About ECHO</h3>
            <p className="text-xs text-muted-foreground">ECHO is a platform showcasing Hedera ecosystem projects.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Ecosystem Stats</h3>
            <p className="text-xs text-muted-foreground">Total Projects: {totalProjects}</p>
            <p className="text-xs text-muted-foreground">Total Categories: {totalCategories}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Hedera Network</h3>
            <p className="text-xs text-muted-foreground">
              Current Block: {currentBlock !== null ? currentBlock : "Error fetching data"}
            </p>
            <p className="text-xs text-muted-foreground">
              HBAR Price: {hederaPrice !== null ? `$${hederaPrice.toFixed(4)}` : "Error fetching data"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Donate</h3>
            <p className="text-xs mb-2">Support the ECHO project:</p>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono bg-muted p-2 rounded">0.0.000000</span>
              <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText("0.0.000000")}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-muted-foreground/10 text-center">
          <p className="text-xs text-muted-foreground">&copy; 2023 ECHO Project. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

