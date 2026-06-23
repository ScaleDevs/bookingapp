"use client"

import { IconSearch } from "@tabler/icons-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

type CustomersHeaderProps = {
  search: string
  onSearchChange: (value: string) => void
}

export function CustomersHeader({
  search,
  onSearchChange,
}: CustomersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Customers</h2>
        <p className="text-sm text-muted-foreground">
          View customer profiles and reservation history.
        </p>
      </div>

      <InputGroup className="sm:max-w-sm">
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        <InputGroupInput
          placeholder="Search customers..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </InputGroup>
    </div>
  )
}
