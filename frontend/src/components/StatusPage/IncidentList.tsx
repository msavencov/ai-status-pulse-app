import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { IncidentPublic, IncidentStatus } from "@/types/status"

const STATUS_VARIANT: Record<
  IncidentStatus,
  "destructive" | "secondary" | "outline" | "default"
> = {
  investigating: "destructive",
  identified: "destructive",
  monitoring: "secondary",
  resolved: "outline",
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
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">{incident.title}</CardTitle>
              <Badge variant={STATUS_VARIANT[incident.status]}>
                {incident.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Started {timeAgo(incident.created_at)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
