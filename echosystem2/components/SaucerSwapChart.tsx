"use client"

import { useState, useEffect } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface SaucerSwapChartProps {
  tokenId: string
}

interface PriceData {
  timestamp: number
  price: number
}

export function SaucerSwapChart({ tokenId }: SaucerSwapChartProps) {
  const [priceData, setPriceData] = useState<PriceData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPriceData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Replace this with the actual SaucerSwap API endpoint when available
        const response = await fetch(`https://api.saucerswap.finance/tokens/${tokenId}/prices?interval=1d&limit=30`)
        if (!response.ok) {
          throw new Error("Failed to fetch price data")
        }
        const data = await response.json()
        setPriceData(data)
      } catch (err) {
        console.error("Error fetching price data:", err)
        setError("Failed to load price data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPriceData()
  }, [tokenId])

  if (isLoading) {
    return <div className="h-[400px] flex items-center justify-center">Loading chart...</div>
  }

  if (error) {
    return <div className="h-[400px] flex items-center justify-center text-red-500">{error}</div>
  }

  const chartData = {
    labels: priceData.map((d) => new Date(d.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: "Price (USD)",
        data: priceData.map((d) => d.price),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Token Price History",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  }

  return (
    <div className="h-[400px]">
      <Line data={chartData} options={options} />
    </div>
  )
}

