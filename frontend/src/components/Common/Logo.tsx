import { cn } from "@/lib/utils"

interface LogoProps {
  variant?: "full" | "icon" | "responsive"
  className?: string
}

export function Logo({ variant = "full", className }: LogoProps) {
  if (variant === "icon") {
    return <span className={cn("text-xl font-bold", className)}>◆</span>
  }

  // "full" and "responsive" both render full logo
  // For responsive (sidebar context), show both states so sidebar collapsible works
  if (variant === "responsive") {
    return (
      <>
        <span
          className={cn(
            "text-xl font-bold tracking-tight group-data-[collapsible=icon]:hidden",
            className,
          )}
        >
          ◆ StatusPulse
        </span>
        <span
          className={cn(
            "text-xl font-bold hidden group-data-[collapsible=icon]:block",
            className,
          )}
        >
          ◆
        </span>
      </>
    )
  }

  return (
    <span className={cn("text-xl font-bold tracking-tight", className)}>
      ◆ StatusPulse
    </span>
  )
}
