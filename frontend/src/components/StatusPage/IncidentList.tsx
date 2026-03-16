import { Card, CardContent } from "@/components/ui/card"
import type { IncidentPublic, IncidentStatus } from "@/types/status"

const STATUS_DOT: Record<IncidentStatus, string> = {
  investigating: "bg-red-500",
  identified: "bg-amber-500",
  monitoring: "bg-amber-500",
  resolved: "bg-green-500",
}

const STATUS_LABEL: Record<IncidentStatus, string> = {
  investigating: "Investigating",
  identified: "Identified",
  monitoring: "Monitoring",
  resolved: "Resolved",
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

interface IncidentListProps {
  incidents: IncidentPublic[]
}

export default function IncidentList({ incidents }: IncidentListProps) {
  if (incidents.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No active incidents
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Active Incidents</h2>
      {incidents.map((incident) => (
        <Card key={incident.id}>
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              {/* Timeline dot */}
              <span
                className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${STATUS_DOT[incident.status]}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold">{incident.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {STATUS_LABEL[incident.status]}
                  </span>
                </div>
                <p className="font-mono text-xs text-muted-foreground mt-1">
                  Started {timeAgo(incident.created_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
