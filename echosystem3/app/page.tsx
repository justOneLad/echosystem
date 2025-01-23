"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { ProjectSlider } from "@/components/ProjectSlider"
import { CategoryDialog } from "@/components/CategoryDialog"
import ProjectList from "@/components/ProjectList"
import { projects } from "@/lib/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

const PROJECTS_PER_PAGE = 6

export default function Home() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All"])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProjects = projects.filter(
    (project) =>
      (selectedCategories.includes("All") || selectedCategories.some((cat) => project.category.includes(cat))) &&
      (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tokenSymbol.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)
  const currentProjects = filteredProjects.slice((currentPage - 1) * PROJECTS_PER_PAGE, currentPage * PROJECTS_PER_PAGE)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 sm:py-12">
        <ProjectSlider />
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
          <CategoryDialog selectedCategories={selectedCategories} onCategoryChange={setSelectedCategories} />
          <Input
            type="text"
            placeholder="Enter project name or token symbol"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-xs"
          />
        </div>
        <ProjectList projects={currentProjects} />
        <div className="flex justify-center mt-8 space-x-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className="mb-2"
            >
              {page}
            </Button>
          ))}
        </div>
      </main>
      <footer className="bg-secondary py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Hedera EchoSystem</h3>
              <p className="text-sm text-muted-foreground">
                Hedera EchoSystem is a platform showcasing Hedera ecosystem projects.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Donate</h3>
              <p className="text-sm mb-2">Support the Hedera EchoSystem project:</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-mono bg-muted p-2 rounded">0.0.000000</span>
                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText("0.0.000000")}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-muted-foreground/10 text-center">
            <p className="text-sm text-muted-foreground">&copy; 2023 Hedera EchoSystem. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

