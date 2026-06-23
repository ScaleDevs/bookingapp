"use client"

import { valibotResolver } from "@hookform/resolvers/valibot"
import { FormProvider, useForm } from "react-hook-form"
import * as v from "valibot"

import { FormInput, FormSelect, FormSubmitButton } from "@/components/forms"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const inviteMemberSchema = v.object({
  email: v.pipe(v.string(), v.email("Enter a valid email address")),
  role: v.pipe(
    v.string(),
    v.minLength(1, "Please select a role"),
  ),
})

type InviteMemberFormValues = v.InferInput<typeof inviteMemberSchema>

const defaultValues: InviteMemberFormValues = {
  email: "",
  role: "staff",
}

type InviteMemberDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: InviteMemberFormValues) => void
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  onSubmit,
}: InviteMemberDialogProps) {
  const form = useForm<InviteMemberFormValues>({
    resolver: valibotResolver(inviteMemberSchema),
    defaultValues,
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset(defaultValues)
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = (values: InviteMemberFormValues) => {
    onSubmit(values)
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite team member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your business dashboard.
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="colleague@business.com"
            />

            <FormSelect
              name="role"
              label="Role"
              placeholder="Select a role"
              options={[
                { label: "Admin", value: "admin" },
                { label: "Staff", value: "staff" },
              ]}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <FormSubmitButton>Send invitation</FormSubmitButton>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export type { InviteMemberFormValues }
