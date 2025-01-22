"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TokenConversionWidgetProps {
  tokenSymbol: string
  tokenPrice: string | null
}

export function TokenConversionWidget({ tokenSymbol, tokenPrice }: TokenConversionWidgetProps) {
  const [tokenAmount, setTokenAmount] = useState<string>("1")
  const [usdAmount, setUsdAmount] = useState<string>("")

  useEffect(() => {
    if (tokenPrice) {
      const calculatedUsd = (Number.parseFloat(tokenAmount) * Number.parseFloat(tokenPrice)).toFixed(2)
      setUsdAmount(calculatedUsd)
    }
  }, [tokenAmount, tokenPrice])

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAmount(e.target.value)
    if (tokenPrice) {
      const calculatedUsd = (Number.parseFloat(e.target.value) * Number.parseFloat(tokenPrice)).toFixed(2)
      setUsdAmount(calculatedUsd)
    }
  }

  const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsdAmount(e.target.value)
    if (tokenPrice) {
      const calculatedToken = (Number.parseFloat(e.target.value) / Number.parseFloat(tokenPrice)).toFixed(6)
      setTokenAmount(calculatedToken)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tokenAmount">Amount in {tokenSymbol}</Label>
        <Input
          id="tokenAmount"
          type="number"
          value={tokenAmount}
          onChange={handleTokenChange}
          placeholder={`Enter ${tokenSymbol} amount`}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="usdAmount">Amount in USD</Label>
        <Input
          id="usdAmount"
          type="number"
          value={usdAmount}
          onChange={handleUsdChange}
          placeholder="Enter USD amount"
        />
      </div>
    </div>
  )
}

