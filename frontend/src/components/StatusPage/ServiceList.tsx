import { useQuery } from "@tanstack/react-query"
import axios from "axios"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type {
  HealthCheckPublic,
  ServicePublic,
  ServiceStatus,
} from "@/types/status"
import UptimeGraph from "./UptimeGraph"

const STATUS_CONFIG: Record<
  ServiceStatus,
  { label: string; dotClass: string; textClass: string }
> = {
  operational: {
    label: "Operational",
    dotClass: "bg-green-500",
    textClass: "text-green-600 dark:text-green-400",
  },
  degraded: {
    label: "Degraded",
    dotClass: "bg-yellow-500",
    textClass: "text-yellow-600 dark:text-yellow-400",
  },
  down: {
    label: "Down",
    dotClass: "bg-red-500",
    textClass: "text-red-600 dark:text-red-400",
  },
}

function ServiceRow({ service }: { service: ServicePublic }) {
  const config = STATUS_CONFIG[service.current_status]

  const { data: checks = [] } = useQuery<HealthCheckPublic[]>({
    queryKey: ["healthChecks", service.id],
    queryFn: async () => {
      const res = await axios.get(
        `/api/v1/status/services/${service.id}/checks?limit=100`,
      )
      return res.data
    },
  })

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${config.dotClass}`} />
        <span className="font-medium truncate">{service.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <UptimeGraph checks={checks} />
        <span className={`text-sm whitespace-nowrap ${config.textClass}`}>
          {config.label}
        </span>
      </div>
    </div>
  )
}

interface ServiceListProps {
  services: ServicePublic[]
}

export default function ServiceList({ services }: ServiceListProps) {
  // Group by category
  const categories = new Map<string, ServicePublic[]>()
  for (const s of services) {
    const list = categories.get(s.category) ?? []
    list.push(s)
    categories.set(s.category, list)
  }

  return (
    <div className="space-y-4">
      {Array.from(categories.entries()).map(([category, categoryServices]) => (
        <Card key={category}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {categoryServices.map((service) => (
                <ServiceRow key={service.id} service={service} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
