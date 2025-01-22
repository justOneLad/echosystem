import Image from "next/image"

export function BannerAd() {
  return (
    <div className="w-full h-24 mb-8 relative overflow-hidden rounded-lg">
      <Image src="/banner-ad.jpg" alt="Banner Advertisement" layout="fill" objectFit="cover" />
    </div>
  )
}

