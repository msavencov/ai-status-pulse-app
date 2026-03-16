import { Link } from "@tanstack/react-router"
import { ArrowLeft, SearchX } from "lucide-react"

const NotFound = () => {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-background"
      data-testid="not-found"
    >
      {/* Ghost background "404" text */}
      <span className="font-mono text-[8rem] font-bold opacity-[0.07] absolute select-none">
        404
      </span>

      {/* Content card */}
      <div className="animate-fade-in relative z-10 flex flex-col items-center gap-4 text-center p-8">
        {/* Icon pill */}
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <SearchX className="w-6 h-6" />
        </div>

        {/* Heading */}
        <h1 className="text-lg font-semibold">Page not found</h1>

        {/* Body */}
        <p className="text-sm text-muted-foreground max-w-xs">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Go Home button */}
        <Link
          to="/"
          className="mt-2 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
