import type React from "react"

interface DexScreenerChartProps {
  pairAddress: string
}

export const DexScreenerChart: React.FC<DexScreenerChartProps> = ({ pairAddress }) => {
  return (
    <iframe
      src={`https://dexscreener.com/hedera/${pairAddress}?embed=1&theme=dark&trades=0&info=0`}
      style={{
        width: "100%",
        height: "100%",
        border: "none",
      }}
      title="DEXScreener Chart"
    />
  )
}

