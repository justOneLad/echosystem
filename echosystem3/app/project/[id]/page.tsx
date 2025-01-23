"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { projects } from "@/lib/projects"
import {
  ExternalLink,
  Twitter,
  MessageCircle,
  Globe,
  Hash,
  FileText,
  Share2,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  TwitterIcon,
} from "lucide-react"
import { fetchSaucerSwapPrice } from "@/lib/fetchSaucerSwapPrice"
import { DexScreenerChart } from "@/components/DexScreenerChart"
import { TokenConversionBox } from "@/components/TokenConversionBox"

export default function ProjectPage() {
  const { id } = useParams()
  const project = projects.find((p) => p.id === id)
  const [tokenPrice, setTokenPrice] = useState<string | null>(null)
  const [hbarPrice, setHbarPrice] = useState<string | null>(null)
  const [tokenPriceInHbar, setTokenPriceInHbar] = useState<string | null>(null)
  const [weekHigh, setWeekHigh] = useState<number | null>(null)
  const [weekLow, setWeekLow] = useState<number | null>(null)
  const [holders, setHolders] = useState<number | null>(null)
  const [tokenSupply, setTokenSupply] = useState<number | null>(null)
  const [marketCap, setMarketCap] = useState<number | null>(null)
  const [fdv, setFdv] = useState<number | null>(null)
  const [priceChange, setPriceChange] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    async function fetchTokenData() {
      if (project && project.tokenId) {
        try {
          const price = await fetchSaucerSwapPrice(project.tokenId)
          setTokenPrice(price)

          // Fetch HBAR price
          const hbarPriceResponse = await fetch(
            "https://api.coingecko.com/api/v3/simple/price?ids=hedera-hashgraph&vs_currencies=usd",
          )
          const hbarPriceData = await hbarPriceResponse.json()
          const hbarUsdPrice = hbarPriceData["hedera-hashgraph"].usd
          setHbarPrice(hbarUsdPrice.toString())

          // Calculate token price in HBAR
          if (price && hbarUsdPrice) {
            const priceInHbar = Number(price) / hbarUsdPrice
            setTokenPriceInHbar(priceInHbar.toFixed(6))
          }

          // Simulated data (replace with actual API calls in production)
          setWeekHigh(Number(price) * 1.5)
          setWeekLow(Number(price) * 0.5)
          setHolders(Math.floor(Math.random() * 10000) + 1000)
          setTokenSupply(1000000000)
          setMarketCap(Number(price) * 1000000000)
          setFdv(Number(price) * 1000000000)
          setPriceChange({
            "5m": (Math.random() * 2 - 1) * 0.5,
            "1h": (Math.random() * 2 - 1) * 2,
            "6h": (Math.random() * 2 - 1) * 5,
            "24h": (Math.random() * 2 - 1) * 10,
          })
        } catch (error) {
          console.error("Error fetching token data:", error)
        }
      }
    }

    fetchTokenData()
    const interval = setInterval(fetchTokenData, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [project])

  const handleShare = async () => {
    const shareData = {
      title: `${project?.name} on Hedera EchoSystem Portal`,
      text: `Check out ${project?.name} on Hedera EchoSystem Portal!`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-12 flex-grow">
        {/* Project Header */}
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          <div className="flex-shrink-0">
            <Image
              src={project.logo || "/placeholder.svg"}
              alt={`${project.name} logo`}
              width={120}
              height={120}
              className="rounded-full bg-background p-1"
            />
          </div>
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {project.name} ({project.tokenSymbol})
                </h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline">{project.verificationLevel}</Badge>
                  {project.category.map((cat) => (
                    <Badge key={cat} variant="secondary">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {tokenPrice && (
                  <Button variant="outline" className="bg-green-500 text-white hover:bg-green-600" asChild>
                    <a
                      href={`https://saucerswap.finance/swap?inputToken=0.0.1&outputToken=${project.tokenId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      {Number.parseFloat(tokenPrice).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })}{" "}
                      USD
                    </a>
                  </Button>
                )}
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Project
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" size="sm" asChild>
                <a href={project.telegram} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Telegram
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={project.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={project.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  Website
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={project.discord} target="_blank" rel="noopener noreferrer">
                  <Hash className="w-4 h-4 mr-2" />
                  Discord
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Project Overview */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{project.description}</p>
              {project.whitepaper && (
                <Button variant="outline" className="mt-4" asChild>
                  <a href={project.whitepaper} target="_blank" rel="noopener noreferrer">
                    <FileText className="w-4 h-4 mr-2" />
                    View Whitepaper
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Token Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Token Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Symbol: {project.tokenSymbol}</p>
              <p>
                Token ID:{" "}
                {project.tokenId ? (
                  <a
                    href={`https://hashscan.io/mainnet/token/${project.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {project.tokenId}
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              {tokenSupply && <p>Token Supply: {tokenSupply.toLocaleString()}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Token Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {holders && (
                <p>
                  <Users className="inline-block w-4 h-4 mr-1" />
                  Holders: {holders.toLocaleString()}
                </p>
              )}
              {marketCap && <p>Market Cap: ${marketCap.toLocaleString()}</p>}
              {fdv && <p>Fully Diluted Valuation: ${fdv.toLocaleString()}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Price Changes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(priceChange).map(([period, change]) => (
                <div key={period} className="flex items-center justify-between">
                  <span>{period}:</span>
                  <span className={change >= 0 ? "text-green-500" : "text-red-500"}>
                    {change >= 0 ? (
                      <TrendingUp className="inline w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="inline w-4 h-4 mr-1" />
                    )}
                    {change.toFixed(2)}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Token Conversion */}
        <div className="mb-8">
          <TokenConversionBox tokenSymbol={project.tokenSymbol} tokenPrice={tokenPrice} />
        </div>

        {/* Token Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Price Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px]">
              <DexScreenerChart pairAddress={project.dexScreenerPairAddress} />
            </div>
          </CardContent>
        </Card>

        {/* Team */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {project.teamMembers.map((member, index) => (
                <div key={index} className="flex flex-col items-center text-center space-y-2">
                  <div className="relative w-20 h-20">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="rounded-full"
                      width={80}
                      height={80}
                      objectFit="cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <TwitterIcon className="w-5 h-5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-secondary py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Hedera EchoSystem</h3>
              <p className="text-sm text-muted-foreground">
                Hedera EchoSystem is a platform showcasing projects in the Hedera ecosystem.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Donate</h3>
              <p className="text-sm mb-2">Support the Hedera EchoSystem project:</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono bg-muted p-2 rounded">0.0.000000</span>
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
            <p className="text-sm text-muted-foreground">&copy; 2023 Hedera EchoSystem. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

