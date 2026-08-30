"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  createSheetHandle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { orpc } from "@/lib/orpc/client"
import { View } from "./view"
import { Edit } from "./edit"

type DetailsSheetPayload = {
  id: string
  tab: "view" | "edit"
}

export const detailsSheetHandle = createSheetHandle<DetailsSheetPayload>()

type DetailsSheetContentProps = {
  offeringId: string
  defaultTab: "view" | "edit"
}

function DetailsSheetContent({
  offeringId,
  defaultTab,
}: DetailsSheetContentProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const { data: offering, isLoading } = useQuery(
    orpc.offerings.getById.queryOptions({ input: { id: offeringId } })
  )

  useEffect(() => {
    setActiveTab(defaultTab)
  }, [defaultTab, offeringId])

  const handleEditSuccess = () => {
    setActiveTab("view")
  }

  const handleEditCancel = () => {
    setActiveTab("view")
  }

  return (
    <SheetContent className="flex w-full flex-col sm:max-w-lg">
      <SheetHeader>
        <SheetTitle>Offering Details</SheetTitle>
        <SheetDescription>
          View or edit the details of this offering.
        </SheetDescription>
      </SheetHeader>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "view" | "edit")}
        className="flex min-h-0 flex-1 flex-col"
      >
        <TabsList className="w-full">
          <TabsTrigger value="view" className="flex-1">
            View
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex-1">
            Edit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="flex-1 overflow-y-auto px-4">
          <View offering={offering!} isLoading={isLoading} />
        </TabsContent>

        <TabsContent
          value="edit"
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          {offering && (
            <Edit
              offering={offering}
              offeringId={offeringId}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          )}
        </TabsContent>
      </Tabs>
    </SheetContent>
  )
}

export function DetailsSheet() {
  return (
    <Sheet handle={detailsSheetHandle}>
      {({ payload }) =>
        payload ? (
          <DetailsSheetContent
            key={`${payload.id}-${payload.tab}`}
            offeringId={payload.id}
            defaultTab={payload.tab}
          />
        ) : null
      }
    </Sheet>
  )
}
