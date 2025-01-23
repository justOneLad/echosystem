import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Collaborator {
  name: string
  role: string
  image: string
}

const collaborators: Collaborator[] = [
  {
    name: "Alex Thompson",
    role: "Core Developer",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Sarah Chen",
    role: "Product Manager",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Michael Rodriguez",
    role: "Community Lead",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    name: "Emma Wilson",
    role: "Technical Advisor",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export function Collaborators() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Collaborators</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {collaborators.map((collaborator, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-2">
              <div className="relative w-20 h-20">
                <Image
                  src={collaborator.image || "/placeholder.svg"}
                  alt={collaborator.name}
                  className="rounded-full"
                  fill
                  objectFit="cover"
                />
              </div>
              <div>
                <p className="font-medium">{collaborator.name}</p>
                <p className="text-sm text-muted-foreground">{collaborator.role}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

