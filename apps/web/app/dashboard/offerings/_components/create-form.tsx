"use client"

import { valibotResolver } from "@hookform/resolvers/valibot"
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
import { trpc } from "@/lib/trpc/client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const createOfferingSchema = v.object({
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

type CreateFormValues = v.InferInput<typeof createOfferingSchema>
type CreateFormOutput = v.InferOutput<typeof createOfferingSchema>

const defaultValues: CreateFormValues = {
  name: "",
  description: "",
  duration: "",
  capacity: "",
  price: "",
  isActive: true,
}

type CreateFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateForm({
  open,
  onOpenChange,
}: CreateFormProps) {
  const utils = trpc.useUtils()
  const createOffering = trpc.offerings.create.useMutation({
    onSuccess: () => {
      void utils.offerings.list.invalidate()
    },
  })

  const form = useForm<CreateFormValues>({
    resolver: valibotResolver(
      createOfferingSchema
    ) as unknown as Resolver<CreateFormValues>,
    defaultValues,
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset(defaultValues)
    }
    onOpenChange(nextOpen)
  }

  const onSubmit = async (values: CreateFormOutput) => {
    try {
      await createOffering.mutateAsync({
        name: values.name,
        description: values.description,
        durationMinutes: String(values.duration),
        capacity: String(values.capacity),
        price: String(values.price),
        isActive: values.isActive,
      })

      toast.success("Offering created successfully")
      handleOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create offering"
      )
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Create Offering</SheetTitle>
          <SheetDescription>
            Add a new service or session that customers can book.
          </SheetDescription>
        </SheetHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              onSubmit(data as unknown as CreateFormOutput)
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
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <FormSubmitButton loading={createOffering.isPending}>
                Create Offering
              </FormSubmitButton>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}
