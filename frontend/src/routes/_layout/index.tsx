import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import axios from "axios"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import useAuth from "@/hooks/useAuth"
import type { IncidentsPublic, ServicesPublic } from "@/types/status"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
  head: () => ({
    meta: [
      {
        title: "Dashboard - StatusPulse",
      },
    ],
  }),
})

function Dashboard() {
  const { user: currentUser } = useAuth()

  const { data: servicesData } = useQuery<ServicesPublic>({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/services/")
      return res.data
    },
  })

  const { data: incidentsData } = useQuery<IncidentsPublic>({
    queryKey: ["incidents"],
    queryFn: async () => {
      const res = await axios.get("/api/v1/incidents/")
      return res.data
    },
  })

  const services = servicesData?.data ?? []
  const incidents = incidentsData?.data ?? []
  const activeIncidents = incidents.filter((i) => i.status !== "resolved")
  const operational = services.filter((s) => s.current_status === "operational")
  const down = services.filter((s) => s.current_status === "down")

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl truncate max-w-sm">
          Hi, {currentUser?.full_name || currentUser?.email}
        </h1>
        <p className="text-muted-foreground">StatusPulse Admin Dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{services.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Operational
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {operational.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Down
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{down.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">
              {activeIncidents.length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
