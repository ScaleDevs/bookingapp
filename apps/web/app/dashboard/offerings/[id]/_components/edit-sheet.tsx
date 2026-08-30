"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useQuery } from "@tanstack/react-query"
import { Edit } from "@/app/dashboard/offerings/_components/edit"
import { useEditSheet } from "../_provider/edit-sheet-provider"
import { orpc } from "@/lib/orpc/client"

type EditSheetProps = {
  offeringId: string
}

export function EditSheet({ offeringId }: EditSheetProps) {
  const { isEditSheetOpen, setIsEditSheetOpen, closeEditSheet } =
    useEditSheet()

  const { data: offering } = useQuery(
    orpc.offerings.getById.queryOptions({ input: { id: offeringId } })
  )

  const handleEditSuccess = () => {
    closeEditSheet()
  }

  const handleEditCancel = () => {
    closeEditSheet()
  }

  if (!offering) {
    return null
  }

  return (
    <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Edit Offering</SheetTitle>
          <SheetDescription>
            Update the details of this offering.
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Edit
            offering={offering}
            offeringId={offeringId}
            onSuccess={handleEditSuccess}
            onCancel={handleEditCancel}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
