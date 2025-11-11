import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-pill font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue disabled:pointer-events-none disabled:opacity-40 active:scale-95",
  {
    variants: {
      variant: {
        primary: "bg-accent-taupe text-light-text-primary hover:bg-accent-taupe/90 shadow-sm hover:shadow-md",
        secondary: "border-2 border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white",
        outline: "border-2 border-border-gray text-light-text-primary dark:text-dark-text-primary hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary",
        ghost: "hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary",
        destructive: "bg-danger text-white hover:bg-danger/90",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        default: "px-6 py-3",
        lg: "px-8 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
