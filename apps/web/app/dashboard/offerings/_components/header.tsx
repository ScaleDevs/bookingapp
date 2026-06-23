"use client"

import { IconPlus } from "@tabler/icons-react"

import { TableFilter } from "@/app/dashboard/offerings/_components/table-filter"
import { useCreateForm } from "@/app/dashboard/offerings/_providers/create-form-root"

import { Button } from "@/components/ui/button"

export function Header() {
  const { openCreateForm } = useCreateForm()

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Offerings</h2>
        <p className="text-sm text-muted-foreground">
          Manage the services and sessions customers can book.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TableFilter />

        <Button onClick={openCreateForm} className="shrink-0">
          <IconPlus />
          Create Offering
        </Button>
      </div>
    </div>
  )
}
