"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  createSheetHandle,
} from "@/components/ui/sheet"
import { blockedTimes } from "@bookingapp/api-contracts"

import type { ContractOutputs } from "@/lib/contract-types"
import { Edit } from "./edit"

type BlockedTime = ContractOutputs<typeof blockedTimes>["list"]["items"][number]

export const detailsSheetHandle = createSheetHandle<BlockedTime>()

type DetailsSheetContentProps = {
  blockedTime: BlockedTime
}

function DetailsSheetContent({ blockedTime }: DetailsSheetContentProps) {
  return (
    <SheetContent className="flex w-full flex-col sm:max-w-lg">
      <SheetHeader>
        <SheetTitle>Edit Blocked Time</SheetTitle>
        <SheetDescription>
          Update the blocked time period details.
        </SheetDescription>
      </SheetHeader>

      <Edit
        blockedTime={blockedTime}
        onSuccess={() => detailsSheetHandle.close()}
        onCancel={() => detailsSheetHandle.close()}
      />
    </SheetContent>
  )
}

export function DetailsSheet() {
  return (
    <Sheet handle={detailsSheetHandle}>
      {({ payload }) =>
        payload ? (
          <DetailsSheetContent key={payload.id} blockedTime={payload} />
        ) : null
      }
    </Sheet>
  )
}
