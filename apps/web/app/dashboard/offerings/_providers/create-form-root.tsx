"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

import { CreateForm } from "@/app/dashboard/offerings/_components/create-form"

type CreateFormContextValue = {
  openCreateForm: () => void
}

const CreateFormContext =
  createContext<CreateFormContextValue | null>(null)

export function CreateFormRoot({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <CreateFormContext.Provider
      value={{ openCreateForm: () => setOpen(true) }}
    >
      {children}
      <CreateForm open={open} onOpenChange={setOpen} />
    </CreateFormContext.Provider>
  )
}

export function useCreateForm() {
  const context = useContext(CreateFormContext)

  if (!context) {
    throw new Error(
      "useCreateForm must be used within an CreateFormRoot"
    )
  }

  return context
}
