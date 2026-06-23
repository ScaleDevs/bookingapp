"use client"

import { useState } from "react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { FormProvider, useForm } from "react-hook-form"
import * as v from "valibot"

import { FormInput, FormSubmitButton } from "@/components/forms"
import { authClient } from "@/lib/auth-client"

const signInSchema = v.object({
  email: v.pipe(v.string(), v.email("Please enter a valid email")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "Password must be at least 8 characters")
  ),
})

type SignInFormValues = v.InferInput<typeof signInSchema>

export default function EmailPasswordSignIn() {
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<SignInFormValues>({
    resolver: valibotResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: SignInFormValues) => {
    setServerError(null)

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    })

    if (error) {
      setServerError(error.message ?? "Something went wrong")
      return
    }

    const organizations = await authClient.organization.list()

    if (organizations.error) {
      setServerError(organizations.error.message ?? "Something went wrong")
      return
    }

    if (organizations.data.length > 0) {
      const { error: setActiveError } = await authClient.organization.setActive(
        {
          organizationId: organizations.data[0].id,
        }
      )

      if (setActiveError) {
        setServerError(
          setActiveError.message ??
            "Failed to set active organization. Please try again."
        )
        return
      }

      window.location.href = "/dashboard"
    } else {
      window.location.href = "/onboarding"
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold">Sign in to your account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your credentials to continue
        </p>
      </div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormInput
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
          />

          <FormInput
            name="password"
            label="Password"
            type="password"
            placeholder="••••••••"
          />

          {serverError ? (
            <p className="text-sm text-destructive" role="alert">
              {serverError}
            </p>
          ) : null}

          <FormSubmitButton className="mt-5 w-full">
            {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
          </FormSubmitButton>
        </form>
      </FormProvider>
    </>
  )
}
