import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const safeButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] transition-all duration-200",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-calm",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-gentle",
        accent: "bg-accent text-accent-foreground hover:bg-accent/80 shadow-gentle",
        emergency: "bg-emergency text-emergency-foreground hover:bg-emergency/90 shadow-lg animate-pulse-gentle",
        soft: "bg-primary-soft text-primary hover:bg-primary-soft/80 border border-primary/20",
        outline: "border border-primary text-primary hover:bg-primary-soft hover:text-primary",
        ghost: "hover:bg-primary-soft hover:text-primary",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-3",
        lg: "h-14 px-8 py-4 text-base",
        xl: "h-16 px-10 py-5 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface SafeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof safeButtonVariants> {
  asChild?: boolean
}

const SafeButton = React.forwardRef<HTMLButtonElement, SafeButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(safeButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
SafeButton.displayName = "SafeButton"

export { SafeButton, safeButtonVariants }