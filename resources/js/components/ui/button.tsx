import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { Link } from '@inertiajs/react';
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-transparent bg-clip-padding whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 text-sm font-medium",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-[#166534] active:bg-[#14532D]",
        outline:
          "border border-border bg-background text-foreground hover:bg-muted hover:border-[#C7D6CB] active:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[#E2E8E0] active:bg-[#D5DDD3]",
        ghost:
          "bg-transparent text-foreground hover:bg-muted active:bg-muted",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-[#B91C1C] active:bg-[#991B1B]",
        link: "bg-transparent text-primary underline-offset-4 hover:underline px-0 h-auto",
      },
      size: {
        default: "h-9 px-3.5",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-4",
        icon: "size-9 p-0",
        "icon-sm": "size-8 p-0",
        "icon-lg": "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants }

export type ButtonLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants>;

function ButtonLink({ className, variant, size, ...props }: ButtonLinkProps) {
  return (
    <Link
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { ButtonLink };

export type ButtonAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof buttonVariants> & {
    target?: string;
  };

function ButtonAnchor({ className, variant, size, ...props }: ButtonAnchorProps) {
  return (
    <a
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { ButtonAnchor };
