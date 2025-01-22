"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Twitter, Send, Book } from "lucide-react"

export function Header() {
  const [echoPrice, setEchoPrice] = useState<string | null>(null)
  const [hbarPrice, setHbarPrice] = useState<string | null>(null)
  const [saucePrice, setSaucePrice] = useState<string | null>(null)
  const [packPrice, setPackPrice] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPrices() {
      try {
        const tokens = ["ECHO", "HBAR", "SAUCE", "PACK"]
        const prices = await Promise.all(
          tokens.map(async (token) => {
            try {
              const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${token}`)
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
              }
              const data = await response.json()
              return data.pairs && data.pairs.length > 0 ? data.pairs[0].priceUsd : null
            } catch (error) {
              console.error(`Error fetching price for ${token}:`, error)
              return null
            }
          }),
        )
        setEchoPrice(prices[0])
        setHbarPrice(prices[1])
        setSaucePrice(prices[2])
        setPackPrice(prices[3])
      } catch (error) {
        console.error("Error fetching prices:", error)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <Image
              src="https://github.com/HederaEcho/resources/blob/main/echo-logo.png?raw=true"
              alt="Hedera Echosystem Logo"
              width={32}
              height={32}
            />
            <span className="hidden font-bold sm:inline-block">Hedera Echosystem</span>
          </Link>
          {echoPrice && (
            <div className="hidden items-center space-x-2 sm:flex">
              <span className="text-xs font-medium">ECHO:</span>
              <span className="text-xs font-bold text-green-400">
                {echoPrice ? `$${Number(echoPrice).toFixed(4)}` : "N/A"}
              </span>
            </div>
          )}
          {hbarPrice && (
            <div className="hidden items-center space-x-2 sm:flex ml-4">
              <span className="text-xs font-medium">HBAR:</span>
              <span className="text-xs font-bold text-green-400">
                {hbarPrice ? `$${Number(hbarPrice).toFixed(4)}` : "N/A"}
              </span>
            </div>
          )}
          {saucePrice && (
            <div className="hidden items-center space-x-2 sm:flex ml-4">
              <span className="text-xs font-medium">SAUCE:</span>
              <span className="text-xs font-bold text-green-400">
                {saucePrice ? `$${Number(saucePrice).toFixed(4)}` : "N/A"}
              </span>
            </div>
          )}
          {packPrice && (
            <div className="hidden items-center space-x-2 sm:flex ml-4">
              <span className="text-xs font-medium">PACK:</span>
              <span className="text-xs font-bold text-green-400">
                {packPrice ? `$${Number(packPrice).toFixed(4)}` : "N/A"}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Button variant="outline">Get Listed</Button>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="https://twitter.com/ECHOProject"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="https://t.me/ECHOProject"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Telegram</span>
            </Link>
            <Link
              href="https://docs.echoproject.io"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <Book className="h-5 w-5" />
              <span className="sr-only">Documentation</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

