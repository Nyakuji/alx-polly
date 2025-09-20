
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import { Controller, FormProvider, useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"

const Form = FormProvider

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormContext()
    return (
      <p
        ref={ref}
        id={formDescriptionId}
        className={cn("text-[0.8rem] text-muted-foreground", className)}
        {...props}
      />
    )
  }
)
FormDescription.displayName = "FormDescription"

const FormField = ({ ...props }) => {
  return (
    <Controller
      {...props}
      render={({ field, fieldState, formState }) => {
        return props.render({
          field,
          fieldState,
          formState,
        })
      }}
    />
  )
}

const FormItemContext = React.createContext<{ id: string } | null>(null)

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId()

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn("space-y-2", className)} {...props} />
      </FormItemContext.Provider>
    )
  }
)
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>>(
  ({ className, ...props }, ref) => {
    const { error, formItemId } = useFormContext()

    return (
      <LabelPrimitive.Root
        ref={ref}
        className={cn(
          error && "text-destructive",
          className
        )}
        htmlFor={formItemId}
        {...props}
      />
    )
  }
)
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
  ({ ...props }, ref) => {
    const { formItemId, formDescriptionId, formMessageId } = useFormContext()

    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={
          !formDescriptionId
            ? undefined
            : `${formDescriptionId} ${formMessageId}`
        }
        aria-invalid={!!useFormContext().error}
        {...props}
      />
    )
  }
)
FormControl.displayName = "FormControl"

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormContext()
    const body = error ? String(error?.message) : children

    if (!body) {
      return null
    }

    return (
      <p
        ref={ref}
        id={formMessageId}
        className={cn("text-[0.8rem] font-medium text-destructive", className)}
        {...props}
      >
        {body}
      </p>
    )
  }
)
FormMessage.displayName = "FormMessage"

export { useFormContext, Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage }
