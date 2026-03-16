import type { ServicePublic } from "@/types/status"

interface OverallStatusProps {
  services: ServicePublic[]
}

export default function OverallStatus({ services }: OverallStatusProps) {
  const allOperational = services.every(
    (s) => s.current_status === "operational",
  )
  const anyDown = services.some((s) => s.current_status === "down")

  let statusText = "All Systems Operational"
  let bgClass = "bg-green-500/8 border-green-500/30"
  let textClass = "text-green-600 dark:text-green-400"
  let dotClass = "bg-green-500"
  let ringClass = "bg-green-500"

  if (anyDown) {
    statusText = "Partial System Outage"
    bgClass = "bg-red-500/8 border-red-500/30"
    textClass = "text-red-600 dark:text-red-400"
    dotClass = "bg-red-500"
    ringClass = "bg-red-500"
  } else if (!allOperational) {
    statusText = "Degraded Performance"
    bgClass = "bg-amber-500/8 border-amber-500/30"
    textClass = "text-amber-600 dark:text-amber-400"
    dotClass = "bg-amber-500"
    ringClass = "bg-amber-500"
  }

  return (
    <div className={`rounded-xl p-4 border ${bgClass}`}>
      <div className="flex items-center gap-3">
        {/* Pulsating dot with animated ring */}
        <span className="relative inline-flex h-3 w-3 shrink-0">
          <span
            className={`absolute inline-flex h-full w-full rounded-full ${ringClass} opacity-75`}
            style={{
              animation:
                "pulse-ring 1.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
          <span
            className={`relative inline-flex h-3 w-3 rounded-full ${dotClass}`}
          />
        </span>
        <h1 className={`text-xl font-bold ${textClass}`}>{statusText}</h1>
      </div>
    </div>
  )
}
