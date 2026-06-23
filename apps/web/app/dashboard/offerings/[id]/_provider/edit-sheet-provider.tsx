"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type EditSheetContextType = {
  isEditSheetOpen: boolean
  openEditSheet: () => void
  closeEditSheet: () => void
  setIsEditSheetOpen: (open: boolean) => void
}

const EditSheetContext = createContext<EditSheetContextType | undefined>(
  undefined
)

export function useEditSheet() {
  const context = useContext(EditSheetContext)
  if (!context) {
    throw new Error("useEditSheet must be used within EditSheetProvider")
  }
  return context
}

type EditSheetProviderProps = {
  children: ReactNode
}

export function EditSheetProvider({ children }: EditSheetProviderProps) {
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  const openEditSheet = () => setIsEditSheetOpen(true)
  const closeEditSheet = () => setIsEditSheetOpen(false)

  return (
    <EditSheetContext.Provider
      value={{
        isEditSheetOpen,
        openEditSheet,
        closeEditSheet,
        setIsEditSheetOpen,
      }}
    >
      {children}
    </EditSheetContext.Provider>
  )
}
