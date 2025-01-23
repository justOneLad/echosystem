import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { categories } from "@/lib/projects"

interface CategoryDialogProps {
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
}

export function CategoryDialog({ selectedCategories, onCategoryChange }: CategoryDialogProps) {
  const [localCategories, setLocalCategories] = useState(selectedCategories)

  const handleCategoryChange = (category: string) => {
    const updatedCategories = localCategories.includes(category)
      ? localCategories.filter((c) => c !== category)
      : [...localCategories, category]
    setLocalCategories(updatedCategories)
  }

  const handleApply = () => {
    onCategoryChange(localCategories)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle className="text-lg">Select Categories</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[200px] pr-4">
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={localCategories.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                />
                <label
                  htmlFor={category}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Button onClick={handleApply} size="sm" className="mt-2 w-full">
          Apply
        </Button>
      </DialogContent>
    </Dialog>
  )
}

