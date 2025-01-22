"use client"

import { useEffect, useRef, useState } from "react"

interface DexScreenerChartProps {
  pairAddress: string
  onError: (error: string) => void
}

export default function DexScreenerChart({ pairAddress, onError }: DexScreenerChartProps) {
  const container = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://widgets.dexscreener.com/main.js"
    script.async = true
    script.onerror = (e) => {
      console.error("Failed to load DexScreener script:", e)
      onError("Failed to load DexScreener widget")
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [onError])

  useEffect(() => {
    setIsLoading(true)
    if (container.current) {
      container.current.innerHTML = `<div class="dexscreener-embed" data-embed="1" data-widget="chart" data-fullscreen="1" data-width="100%" data-height="100%" data-pair="${pairAddress}"></div>`

      // Add a timeout to check if the widget has loaded
      const timeoutId = setTimeout(() => {
        if (!document.querySelector(".dexscreener-widget")) {
          onError("DexScreener widget failed to load")
        }
        setIsLoading(false)
      }, 10000) // 10 seconds timeout

      return () => clearTimeout(timeoutId)
    }
  }, [pairAddress, onError])

  if (isLoading) {
    return <div className="h-[600px] flex items-center justify-center">Loading chart...</div>
  }

  return <div ref={container} className="w-full h-[600px]" />
}

