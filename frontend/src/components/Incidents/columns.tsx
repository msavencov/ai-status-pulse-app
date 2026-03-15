import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import type { IncidentPublic, IncidentStatus } from "@/types/status"
import UpdateIncidentStatus from "./UpdateIncidentStatus"

const STATUS_VARIANT: Record<
  IncidentStatus,
  "destructive" | "secondary" | "outline" | "default"
> = {
  investigating: "destructive",
  identified: "destructive",
  monitoring: "secondary",
  resolved: "outline",
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString()
}

export const columns: ColumnDef<IncidentPublic>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge variant={STATUS_VARIANT[status]}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatDate(row.original.created_at)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Update Status",
    cell: ({ row }) => <UpdateIncidentStatus incident={row.original} />,
  },
]
