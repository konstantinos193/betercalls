"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle } from "lucide-react"
import { PlanForm } from "./plan-form"
import type { Database } from "@/types/supabase"

type Plan = Database["public"]["Tables"]["subscription_plans"]["Row"]

export function PlansManagement({ plans }: { plans: Plan[] }) {
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [selectedPlan, setSelectedPlan] = React.useState<Plan | null>(null)

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan)
    setIsFormOpen(true)
  }

  const handleCreate = () => {
    setSelectedPlan(null)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedPlan(null)
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleCreate} className="bg-cyan-400 text-black font-bold hover:bg-cyan-300">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="bg-black/30 border-gray-800/50 flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl text-white">{plan.name}</CardTitle>
                <Badge variant={plan.is_active ? "default" : "destructive"}>
                  {plan.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription className="text-gray-400">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-3xl font-bold text-white">
                €{plan.price} <span className="text-base font-normal text-gray-500">
                  {plan.interval === "monthly" ? "/mo" : plan.interval === "annual" ? "/yr" : " once"}
                </span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                {(plan.features as string[])?.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => handleEdit(plan)}>
                Edit Plan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <PlanForm isOpen={isFormOpen} onClose={handleCloseForm} plan={selectedPlan} />
    </div>
  )
}
