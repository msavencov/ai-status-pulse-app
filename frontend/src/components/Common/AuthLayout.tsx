interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-fade-in max-w-sm w-full rounded-xl shadow-sm border p-8">
        {children}
      </div>
    </div>
  )
}
