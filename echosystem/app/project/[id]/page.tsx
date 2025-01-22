"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { projects, type Project } from "@/lib/projects"
import {
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
  Lock,
} from "lucide-react"
import { fetchSaucerSwapPrice } from "@/lib/fetchSaucerSwapPrice"
import { fetchDavinciLockedAmount } from "@/lib/fetchDavinciLockedAmount"
import { Footer } from "@/components/Footer"
import { TokenConversionWidget } from "@/components/TokenConversionWidget"

export default function ProjectPage({ params }: { params: { id: string } }) {
  const { id } = params
  const project = projects.find((p) => p.name.toLowerCase().replace(/\s+/g, "-") === params.id) as Project | undefined
  const [tokenPrice, setTokenPrice] = useState<string | null>(null)
  const [tokenSupply, setTokenSupply] = useState<number | null>(null)
  const [marketCap, setMarketCap] = useState<number | null>(null)
  const [fdv, setFdv] = useState<number | null>(null)
  const [priceChange, setPriceChange] = useState<{ [key: string]: number }>({})
  const [lockedTokens, setLockedTokens] = useState<number | null>(null)
  const [lockedTokensError, setLockedTokensError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTokenData() {
      if (project && project.tokenId) {
        try {
          // Fetch token price from SaucerSwap
          const price = await fetchSaucerSwapPrice(project.tokenId)
          setTokenPrice(price)

          // Fetch token data from Hedera Mirror Node
          const tokenDataResponse = await fetch(
            `https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/${project.tokenId}`,
          )
          if (!tokenDataResponse.ok) {
            throw new Error(`HTTP error! status: ${tokenDataResponse.status}`)
          }
          const tokenData = await tokenDataResponse.json()

          setTokenSupply(Number(tokenData.total_supply))

          if (price) {
            const calculatedMarketCap = Number(price) * Number(tokenData.total_supply)
            setMarketCap(calculatedMarketCap)
            setFdv(calculatedMarketCap) // Assuming fully diluted valuation is the same as market cap for simplicity
          }

          // Fetch price changes (this is a placeholder, replace with actual API call if available)
          setPriceChange({
            "5m": (Math.random() * 2 - 1) * 0.5,
            "1h": (Math.random() * 2 - 1) * 2,
            "6h": (Math.random() * 2 - 1) * 5,
            "24h": (Math.random() * 2 - 1) * 10,
          })

          // Fetch locked tokens from Davinci Graph API
          try {
            const lockedTokensResponse = await fetch(`https://api.davincigraph.io/tokens/${project.tokenId}/locked`)
            if (lockedTokensResponse.ok) {
              const lockedTokensData = await lockedTokensResponse.json()
              setLockedTokens(lockedTokensData.lockedAmount)
              setLockedTokensError(null)
            } else {
              throw new Error(`HTTP error! status: ${lockedTokensResponse.status}`)
            }
          } catch (error) {
            console.error("Error fetching locked tokens:", error)
            setLockedTokensError("Failed to fetch locked tokens data")
          }
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
      title: `${project?.name} on Hedera Echosystem`,
      text: `Check out ${project?.name} on Hedera Echosystem!`,
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
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <Image
                src={project.logo || "/placeholder.svg"}
                alt={`${project.name} logo`}
                width={100}
                height={100}
                className="rounded-full bg-background p-1"
              />
              <div className="flex-grow">
                <h1 className="text-2xl font-bold">
                  {project.name} ({project.tokenSymbol})
                </h1>
                {tokenPrice ? (
                  <p className="text-lg font-normal text-green-400 mt-2">
                    $
                    {Number.parseFloat(tokenPrice).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}
                  </p>
                ) : (
                  <p className="text-lg font-normal text-muted-foreground mt-2">Price unavailable</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{project.verificationLevel}</Badge>
                  {project.category.map((cat) => (
                    <Badge key={cat} variant="secondary">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="default"
                  onClick={() =>
                    window.open(
                      `https://saucerswap.finance/swap?inputToken=HBAR&outputToken=${project.tokenId}`,
                      "_blank",
                    )
                  }
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  BUY ${project.tokenSymbol}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button variant="outline" asChild>
                <a href={project.telegram} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Telegram
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={project.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={project.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  Website
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={project.discord} target="_blank" rel="noopener noreferrer">
                  <Hash className="w-4 h-4 mr-2" />
                  Discord
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Token Metrics</CardTitle>
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
              {marketCap && <p>Market Cap: ${marketCap.toLocaleString()}</p>}
              {fdv && <p>Fully Diluted Valuation: ${fdv.toLocaleString()}</p>}
              {lockedTokens !== null ? (
                <p>
                  <Lock className="inline-block w-4 h-4 mr-1" />
                  Locked Tokens: {lockedTokens.toLocaleString()} {project.tokenSymbol}
                </p>
              ) : (
                <p className="text-red-500">{lockedTokensError || "Locked tokens data unavailable"}</p>
              )}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs mb-4">{project.description}</p>
              <Button variant="outline" asChild className="w-full md:w-auto">
                <a href={project.whitepaper} target="_blank" rel="noopener noreferrer">
                  <FileText className="w-4 h-4 mr-2" />
                  View Whitepaper
                </a>
              </Button>
              <Button variant="outline" asChild className="w-full md:w-auto ml-2">
                <a href={project.auditReport} target="_blank" rel="noopener noreferrer">
                  <FileText className="w-4 h-4 mr-2" />
                  View Audit Report
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Token Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <TokenConversionWidget tokenSymbol={project.tokenSymbol} tokenPrice={tokenPrice} />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

