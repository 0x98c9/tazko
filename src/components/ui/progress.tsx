
import * as React from "react"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number
    max?: number
    getValueLabel?: (value: number, max: number) => string
  }
>(({ className, value = 0, max = 100, getValueLabel, ...props }, ref) => {
  const percentage = value && max ? (value / max) * 100 : 0

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={
        getValueLabel ? getValueLabel(value, max) : `${percentage.toFixed(0)}%`
      }
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-gray-800",
        className
      )}
      {...props}
    >
      <div
        className="h-full w-full flex-1 bg-primary-purple transition-all"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }
