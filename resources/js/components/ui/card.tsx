import * as React from "react"

import { cn } from "@/lib/utils"

interface CardProps extends React.ComponentProps<"div"> {
  size?: "default" | "sm"
  variant?: "default" | "flat" | "elevated"
}

function Card({
  className,
  size = "default",
  variant = "default",
  ...props
}: CardProps) {
  const baseShadow = variant === "elevated"
    ? "shadow-[0_4px_12px_-2px_rgba(15,23,23,0.08),0_2px_4px_-2px_rgba(15,23,23,0.04)]"
    : variant === "flat"
    ? ""
    : "shadow-[0_1px_2px_0_rgba(15,23,23,0.04)]"

  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col rounded-[10px] border border-[#E2E8E0] bg-card text-card-foreground",
        size === "sm" ? "gap-4 p-4" : "gap-5 p-6",
        baseShadow,
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1.5",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-section-title font-semibold leading-tight",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-meta", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("text-body", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center pt-2 border-t border-[#E2E8E0] -mx-6 px-6",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
