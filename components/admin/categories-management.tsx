"use client"

import { CardFooter } from "@/components/ui/card"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { CategoryForm } from "./category-form"
import type { Database } from "@/types/supabase"

type Category = Database["public"]["Tables"]["categories"]["Row"]

export function CategoriesManagement({ categories }: { categories: Category[] }) {
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null)

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setSelectedCategory(null)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedCategory(null)
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleCreate} className="bg-cyan-400 text-black font-bold hover:bg-cyan-300">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="bg-black/30 border-gray-800/50 flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl text-white">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-400">{category.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => handleEdit(category)}>
                Edit Category
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <CategoryForm isOpen={isFormOpen} onClose={handleCloseForm} category={selectedCategory} />
    </div>
  )
}
