import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import type { ServicePublic, ServiceStatus } from "@/types/status"
import { ServiceActionsMenu } from "./ServiceActionsMenu"

const STATUS_VARIANT: Record<
  ServiceStatus,
  "default" | "secondary" | "destructive"
> = {
  operational: "default",
  degraded: "secondary",
  down: "destructive",
}

export const columns: ColumnDef<ServicePublic>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm max-w-xs truncate block">
        {row.original.url}
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "current_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.current_status
      return <Badge variant={STATUS_VARIANT[status]}>{status}</Badge>
    },
  },
  {
    accessorKey: "check_interval",
    header: "Interval",
    cell: ({ row }) => <span>{row.original.check_interval}s</span>,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <ServiceActionsMenu service={row.original} />
      </div>
    ),
  },
]
