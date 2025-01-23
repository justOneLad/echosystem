"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Twitter, MessageCircle, Globe, Hash } from "lucide-react"
import type { Project } from "@/lib/projects"
import { fetchSaucerSwapPrice } from "@/lib/fetchSaucerSwapPrice"

interface ProjectItemProps {
  project: Project
}

export default function ProjectItem({ project }: ProjectItemProps) {
  const [tokenPrice, setTokenPrice] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTokenPrice() {
      if (project.tokenId) {
        try {
          const price = await fetchSaucerSwapPrice(project.tokenId)
          setTokenPrice(price)
        } catch (error) {
          console.error("Error fetching token price:", error)
        }
      }
    }

    fetchTokenPrice()
  }, [project.tokenId])

  return (
    <Card className="flex flex-col h-full bg-card text-card-foreground">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Image
              src={project.logo || "/placeholder.svg"}
              alt={`${project.name} logo`}
              width={50}
              height={50}
              className="rounded-full bg-background p-1"
            />
            <Link href={`/project/${project.id}`}>
              <CardTitle className="text-xl font-semibold hover:underline">{project.name}</CardTitle>
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline">{project.verificationLevel}</Badge>
          {project.category.map((cat) => (
            <Badge key={cat} variant="secondary">
              {cat}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-2">Token: {project.tokenSymbol}</p>
        <p className="text-sm text-muted-foreground mb-2">Token ID: {project.tokenId || "N/A"}</p>
        {project.tokenId ? (
          tokenPrice ? (
            <p className="text-lg font-semibold text-green-400">
              Price: $
              {Number.parseFloat(tokenPrice).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              })}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Loading price...</p>
          )
        ) : (
          <p className="text-sm text-muted-foreground">Price: N/A</p>
        )}
        <p className="text-sm mt-2">{project.description.slice(0, 100)}...</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-center">
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
      </CardFooter>
    </Card>
  )
}

