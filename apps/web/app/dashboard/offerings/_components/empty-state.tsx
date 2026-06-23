"use client"

import { IconPackage, IconPlus } from "@tabler/icons-react"

import { useCreateForm } from "@/app/dashboard/offerings/_providers/create-form-root"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function EmptyState() {
  const { openCreateForm } = useCreateForm()

  return (
    <Empty className="">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconPackage />
        </EmptyMedia>
        <EmptyTitle>No offerings yet</EmptyTitle>
        <EmptyDescription>
          Create your first offering so customers can start booking sessions and
          services.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={openCreateForm}>
          <IconPlus />
          Create Offering
        </Button>
      </EmptyContent>
    </Empty>
  )
}
