import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import axios from "axios"

import IncidentList from "@/components/StatusPage/IncidentList"
import OverallStatus from "@/components/StatusPage/OverallStatus"
import ServiceList from "@/components/StatusPage/ServiceList"
import { Skeleton } from "@/components/ui/skeleton"
import type { IncidentsPublic, ServicesPublic } from "@/types/status"

export const Route = createFileRoute("/")({
  component: StatusPage,
  head: () => ({
    meta: [
      {
        title: "StatusPulse - System Status",
      },
    ],
  }),
})

function StatusPage() {
  const {
    data: servicesData,
    isLoading: servicesLoading,
  } = useQuery<ServicesPublic>({
    queryKey: ["publicServices"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/status/services")
      return res.data
    },
    refetchInterval: 30000,
  })

  const {
    data: incidentsData,
    isLoading: incidentsLoading,
  } = useQuery<IncidentsPublic>({
    queryKey: ["publicIncidents"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/status/incidents?active_only=true")
      return res.data
    },
    refetchInterval: 30000,
  })

  const services = servicesData?.data ?? []
  const incidents = incidentsData?.data ?? []
  const isLoading = servicesLoading || incidentsLoading

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">StatusPulse</h1>
          <p className="mt-1 text-muted-foreground">System Status</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <div className="space-y-8">
            <OverallStatus services={services} />
            <ServiceList services={services} />
            <IncidentList incidents={incidents} />
          </div>
        )}

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          Powered by StatusPulse
        </footer>
      </div>
    </div>
  )
}
