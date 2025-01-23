import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TokenConversionBoxProps {
  tokenSymbol: string
  tokenPrice: string | null
}

export function TokenConversionBox({ tokenSymbol, tokenPrice }: TokenConversionBoxProps) {
  const [tokenAmount, setTokenAmount] = useState<string>("")
  const [usdAmount, setUsdAmount] = useState<string>("")

  useEffect(() => {
    if (tokenPrice && tokenAmount) {
      const usd = Number(tokenAmount) * Number(tokenPrice)
      setUsdAmount(usd.toFixed(2))
    }
  }, [tokenAmount, tokenPrice])

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAmount(e.target.value)
  }

  const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsdAmount(e.target.value)
    if (tokenPrice) {
      const tokens = Number(e.target.value) / Number(tokenPrice)
      setTokenAmount(tokens.toFixed(6))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Conversion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder={`Enter ${tokenSymbol} amount`}
            value={tokenAmount}
            onChange={handleTokenChange}
          />
          <span>{tokenSymbol}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Input type="number" placeholder="Enter USD amount" value={usdAmount} onChange={handleUsdChange} />
          <span>USD</span>
        </div>
        {tokenPrice && (
          <p className="text-sm text-muted-foreground">
            Current price: ${Number(tokenPrice).toFixed(6)} USD per {tokenSymbol}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

