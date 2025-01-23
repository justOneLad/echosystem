"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const ads = [
  { id: 1, image: "/ad1.jpg", link: "#", alt: "Advertisement 1" },
  { id: 2, image: "/ad2.jpg", link: "#", alt: "Advertisement 2" },
  { id: 3, image: "/ad3.jpg", link: "#", alt: "Advertisement 3" },
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
    <div className="relative w-full h-48 mb-8">
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

