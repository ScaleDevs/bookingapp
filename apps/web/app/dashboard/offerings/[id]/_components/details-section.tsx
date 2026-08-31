"use client"

import { IconEdit, IconArrowLeft } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { View } from "@/app/dashboard/offerings/_components/view"
import { offeringClient } from "@/lib/orpc/client"
import { useEditSheet } from "../_provider/edit-sheet-provider"

type DetailsSectionProps = {
  offeringId: string
}

export function DetailsSection({ offeringId }: DetailsSectionProps) {
  const router = useRouter()
  const { openEditSheet } = useEditSheet()

  const { data: offering, isLoading } = useQuery(
    offeringClient.getById.queryOptions({ input: { id: offeringId } })
  )

  const handleBack = () => {
    router.push("/dashboard/offerings")
  }

  return (
    <>
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button onClick={handleBack} variant="ghost" size="icon-sm">
              <IconArrowLeft />
              <span className="sr-only">Back to offerings</span>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {offering?.name ?? "Loading..."}
              </h1>
              <p className="text-sm text-muted-foreground">Offering Details</p>
            </div>
          </div>
          <Button onClick={openEditSheet} disabled={isLoading}>
            <IconEdit />
            Edit
          </Button>
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <h2 className="text-lg font-semibold">Details</h2>
          </div>
          <div className="p-4">
            <View offering={offering} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </>
  )
}
