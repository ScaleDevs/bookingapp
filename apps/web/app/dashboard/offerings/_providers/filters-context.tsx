"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type TableFilters = {
  name?: string
  status?: "active" | "archived"
}

type FiltersContextValue = {
  filters: TableFilters
  setFilters: (next: TableFilters) => void
}

const FiltersContext = createContext<FiltersContextValue | null>(
  null
)

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<TableFilters>({})

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FiltersContext)

  if (!context) {
    throw new Error(
      "useFilters must be used within an FiltersProvider"
    )
  }

  return context
}
