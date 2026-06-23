import { AuthGuard } from "@/components/shared/auth-guard"

import OnboardingForm from "./_components/onboarding-form"

export default function OnboardingPage() {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-md flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold">Welcome to KardOps</h1>
            <p className="text-sm text-muted-foreground">
              Let&apos;s create your organization to get started
            </p>
          </div>

          <OnboardingForm />

          <div className="rounded-lg border bg-muted/50 p-4">
            <h3 className="mb-2 text-sm font-medium">
              What&apos;s an organization?
            </h3>
            <p className="text-xs text-muted-foreground">
              An organization is your workspace in KardOps. You can invite team
              members, manage books, and collaborate with others within your
              organization.
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
