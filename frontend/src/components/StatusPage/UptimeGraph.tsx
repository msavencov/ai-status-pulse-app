import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { HealthCheckPublic } from "@/types/status"

interface UptimeGraphProps {
  checks: HealthCheckPublic[]
  days?: number
}

interface DayBucket {
  date: string
  total: number
  healthy: number
}

export default function UptimeGraph({ checks, days = 30 }: UptimeGraphProps) {
  // Group checks by day
  const buckets = new Map<string, DayBucket>()
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().split("T")[0]
    buckets.set(key, { date: key, total: 0, healthy: 0 })
  }

  for (const check of checks) {
    const key = check.checked_at.split("T")[0]
    const bucket = buckets.get(key)
    if (bucket) {
      bucket.total++
      if (check.is_healthy) bucket.healthy++
    }
  }

  const dayData = Array.from(buckets.values())

  return (
    <TooltipProvider>
      <div className="flex gap-0.5">
        {dayData.map((day) => {
          const pct =
            day.total === 0 ? 100 : Math.round((day.healthy / day.total) * 100)
          let color = "bg-green-500"
          if (pct < 100 && pct >= 50) color = "bg-amber-500"
          if (pct < 50) color = "bg-red-500"
          if (day.total === 0) color = "bg-muted"

          return (
            <Tooltip key={day.date}>
              <TooltipTrigger asChild>
                <div
                  className={`h-8 w-1.5 rounded-sm ${color} transition-opacity hover:opacity-80`}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {day.date}: {day.total === 0 ? "No data" : `${pct}% uptime`}
                </p>
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
