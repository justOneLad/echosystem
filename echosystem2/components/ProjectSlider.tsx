"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

const ads = [
  {
    id: 1,
    image: "https://github.com/HederaEcho/ads/blob/main/GIB.jpeg?raw=true",
    link: "https://gib.news",
    alt: "Advertisement 1",
  },
  { id: 2, image: "https://github.com/HederaEcho/ads/blob/main/dino.jpeg?raw=true", link: "#", alt: "Advertisement 2" },
  {
    id: 3,
    image: "https://github.com/HederaEcho/ads/blob/main/SMACKM.jpeg?raw=true",
    link: "#",
    alt: "Advertisement 3",
  },
]

export function ProjectSlider() {
  const [currentAd, setCurrentAd] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAd((prevAd) => (prevAd + 1) % ads.length)
    }, 10000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full max-w-3xl h-36 mb-8 mx-auto">
      {ads.map((ad, index) => (
        <div
          key={ad.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentAd ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image src={ad.image || "/placeholder.svg"} alt={ad.alt} layout="fill" objectFit="cover" />
        </div>
      ))}
    </div>
  )
}

