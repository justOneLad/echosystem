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
import { Footer } from "@/components/Footer"

const PROJECTS_PER_PAGE = 15

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
      <div className="mb-8">
        <div className="flex flex-col items-center justify-center text-center py-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Explore the Hedera Ecosystem</h1>
          <p className="text-lg md:text-xl lg:text-2xl">One Platform, Every Project, One Voice.</p>
        </div>
      </div>
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
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Contributors</h2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {["binance", "google", "facebook", "microsoft", "apple", "amazon"].map((brand) => (
            <Image
              key={brand}
              src={`/${brand}-logo.png`}
              alt={`${brand} logo`}
              width={100}
              height={50}
              objectFit="contain"
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

