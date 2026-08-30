"use client"

import { useEffect } from "react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useMutation } from "@tanstack/react-query"
import { FormProvider, Resolver, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as v from "valibot"

import {
  FormInput,
  FormSubmitButton,
  FormSwitch,
  FormTextarea,
} from "@/components/forms"
import { Button } from "@/components/ui/button"
import { SheetFooter } from "@/components/ui/sheet"
import { orpc, type APIOutputs } from "@/lib/orpc/client"
import { useORPCUtils } from "@/lib/orpc/utils"

type Offering = APIOutputs["offerings"]["getById"]

const updateOfferingSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(2, "Name must be at least 2 characters")
  ),
  description: v.pipe(
    v.string(),
    v.minLength(10, "Description must be at least 10 characters")
  ),
  duration: v.pipe(
    v.string(),
    v.minLength(1, "Duration is required"),
    v.regex(/^\d+$/, "Duration must be a whole number"),
    v.transform(Number),
    v.pipe(v.number(), v.minValue(1, "Duration must be at least 1 minute"))
  ),
  capacity: v.pipe(
    v.string(),
    v.minLength(1, "Capacity is required"),
    v.regex(/^\d+$/, "Capacity must be a whole number"),
    v.transform(Number),
    v.pipe(v.number(), v.minValue(1, "Capacity must be at least 1"))
  ),
  price: v.pipe(
    v.string(),
    v.minLength(1, "Price is required"),
    v.regex(/^\d+(\.\d{1,2})?$/, "Enter a valid price"),
    v.transform(Number),
    v.pipe(v.number(), v.minValue(0, "Price must be 0 or greater"))
  ),
  isActive: v.boolean(),
})

type UpdateFormValues = v.InferInput<typeof updateOfferingSchema>
type UpdateFormOutput = v.InferOutput<typeof updateOfferingSchema>

type EditProps = {
  offering: Offering
  offeringId: string
  onSuccess: () => void
  onCancel: () => void
}

export function Edit({
  offering,
  offeringId,
  onSuccess,
  onCancel,
}: EditProps) {
  const utils = useORPCUtils()
  const updateOffering = useMutation(orpc.offerings.update.mutationOptions({
    onSuccess: () => {
      void utils.offerings.list.invalidate()
      void utils.offerings.getById.invalidate()
    },
  }))

  const form = useForm<UpdateFormValues>({
    resolver: valibotResolver(
      updateOfferingSchema
    ) as unknown as Resolver<UpdateFormValues>,
    defaultValues: {
      name: "",
      description: "",
      duration: "",
      capacity: "",
      price: "",
      isActive: true,
    },
  })

  useEffect(() => {
    if (offering) {
      form.reset({
        name: offering.name || "",
        description: offering.description || "",
        duration: String(offering.durationMinutes || ""),
        capacity: String(offering.capacity || ""),
        price: String(offering.price || ""),
        isActive: offering.isActive ?? true,
      })
    }
  }, [offering, form])

  const onSubmit = async (values: UpdateFormOutput) => {
    try {
      await updateOffering.mutateAsync({
        id: offeringId,
        data: {
          name: values.name,
          description: values.description,
          durationMinutes: String(values.duration),
          capacity: String(values.capacity),
          isActive: values.isActive,
        },
      })

      toast.success("Offering updated successfully")
      onSuccess()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update offering"
      )
    }
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          onSubmit(data as unknown as UpdateFormOutput)
        )}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
          <FormInput
            name="name"
            label="Name"
            placeholder="e.g. Court A — Morning Session"
          />

          <FormTextarea
            name="description"
            label="Description"
            placeholder="Describe your offering"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              name="duration"
              label="Duration"
              placeholder="60"
              type="number"
              inputProps={{ min: 1 }}
            />
            <FormInput
              name="capacity"
              label="Capacity"
              placeholder="4"
              type="number"
              inputProps={{ min: 1 }}
            />
          </div>

          <FormInput
            name="price"
            label="Price"
            placeholder="25.00"
            type="number"
            inputProps={{ min: 0, step: "0.01" }}
          />

          <FormSwitch
            name="isActive"
            label="Active status"
            description="Only active offerings are visible to customers."
          />
        </div>

        <SheetFooter className="flex-row justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <FormSubmitButton loading={updateOffering.isPending}>
            Save Changes
          </FormSubmitButton>
        </SheetFooter>
      </form>
    </FormProvider>
  )
}
