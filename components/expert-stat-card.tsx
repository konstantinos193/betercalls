import { cn } from "@/lib/utils"

type StatCardProps = {
  title: string
  value: string
  isPositive?: boolean
  isNegative?: boolean
}

export function StatCard({ title, value, isPositive, isNegative }: StatCardProps) {
  return (
    <div className="bg-black/30 p-4 rounded-lg border border-gray-800/50 text-center">
      <p className="text-sm text-gray-400">{title}</p>
      <p
        className={cn(
          "text-2xl font-bold mt-1",
          isPositive && "text-green-400",
          isNegative && "text-red-400",
          !isPositive && !isNegative && "text-white",
        )}
      >
        {value}
      </p>
    </div>
  )
}
