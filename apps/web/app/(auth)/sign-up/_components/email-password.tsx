"use client"

import { useState } from "react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { FormProvider, useForm } from "react-hook-form"
import * as v from "valibot"

import { FormInput, FormSubmitButton } from "@/components/forms"
import { authClient } from "@/lib/auth-client"

const signUpSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(2, "Name must be at least 2 characters")
  ),
  email: v.pipe(v.string(), v.email("Please enter a valid email")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "Password must be at least 8 characters")
  ),
})

type SignUpFormValues = v.InferInput<typeof signUpSchema>

export default function EmailPasswordSignUp() {
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<SignUpFormValues>({
    resolver: valibotResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: SignUpFormValues) => {
    setServerError(null)

    const { error } = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name.trim().toLowerCase(),
      callbackURL: "/onboarding",
    })

    if (error) {
      setServerError(error.message ?? "Something went wrong")
      return
    }

    window.location.href = "/onboarding"
  }

  return (
    <>
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details to get started
        </p>
      </div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormInput name="name" label="Name" placeholder="John Doe" />

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
            {form.formState.isSubmitting ? "Creating account..." : "Sign up"}
          </FormSubmitButton>
        </form>
      </FormProvider>
    </>
  )
}
