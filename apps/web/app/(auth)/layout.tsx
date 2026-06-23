import { AuthToggleLink } from "./_components/auth-toggle-link"
import { ThemeToggle } from "@/components/shared/theme-toggle"

const RightSide = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-1 flex-col p-5">
      <div className="flex items-center justify-between">
        <AuthToggleLink />

        <ThemeToggle />
      </div>
      <div className="flex h-full flex-col items-center justify-center">
        <div className="flex w-full flex-col gap-6 py-12 md:min-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-row">
      {/* media panel */}
      <div className="hidden p-5 md:block md:w-5/7">
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border bg-background">
          {/* Background glow */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-transparent to-primary/10" />
          <div className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-primary/10 blur-3xl" />

          {/* subtle grid texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-size-[40px_40px] opacity-[0.05]" />

          {/* content */}
          <div className="relative flex h-full flex-col justify-between p-12">
            {/* top branding */}
            <div>
              <h1 className="text-xl font-semibold tracking-tight">BookHub</h1>
            </div>

            {/* main hero */}
            <div className="max-w-xl space-y-6">
              <h2 className="text-5xl leading-tight font-bold tracking-tight">
                Run your operations
                <span className="block text-primary">faster & smarter</span>
              </h2>

              <p className="text-lg text-muted-foreground">
                Manage inventory, sales, and production across branches — all in
                one streamlined system built for speed.
              </p>

              {/* optional badges */}
              <div className="flex gap-3 text-sm text-muted-foreground">
                <span className="rounded-full border border-border px-3 py-1">
                  Multi-branch
                </span>
                <span className="rounded-full border border-border px-3 py-1">
                  Real-time tracking
                </span>
                <span className="rounded-full border border-border px-3 py-1">
                  Fast & lightweight
                </span>
              </div>
            </div>

            {/* bottom subtle trust signal */}
            <div className="text-sm text-muted-foreground">
              Built for growing businesses
            </div>
          </div>
        </div>
      </div>

      {/* Login/Signup form */}
      <RightSide>{children}</RightSide>
    </div>
  )
}
