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
  let bgClass = "bg-green-500/10 border-green-500/30"
  let textClass = "text-green-600 dark:text-green-400"
  let dotClass = "bg-green-500"

  if (anyDown) {
    statusText = "Partial System Outage"
    bgClass = "bg-red-500/10 border-red-500/30"
    textClass = "text-red-600 dark:text-red-400"
    dotClass = "bg-red-500"
  } else if (!allOperational) {
    statusText = "Degraded Performance"
    bgClass = "bg-yellow-500/10 border-yellow-500/30"
    textClass = "text-yellow-600 dark:text-yellow-400"
    dotClass = "bg-yellow-500"
  }

  return (
    <div className={`rounded-lg border p-6 ${bgClass}`}>
      <div className="flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${dotClass} animate-pulse`} />
        <h1 className={`text-xl font-semibold ${textClass}`}>{statusText}</h1>
      </div>
    </div>
  )
}
