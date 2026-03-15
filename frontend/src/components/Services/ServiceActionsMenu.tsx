import { EllipsisVertical } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ServicePublic } from "@/types/status"
import DeleteService from "./DeleteService"
import EditService from "./EditService"

interface ServiceActionsMenuProps {
  service: ServicePublic
}

export const ServiceActionsMenu = ({ service }: ServiceActionsMenuProps) => {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <EditService service={service} onSuccess={() => setOpen(false)} />
        <DeleteService id={service.id} onSuccess={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
