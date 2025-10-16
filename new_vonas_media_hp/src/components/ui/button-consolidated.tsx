import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Original shadcn variants
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        
        // Custom theme variants
        "tp-btn-cart": "bg-[#2c5aa0] text-white hover:bg-[#1e3f73] px-6 py-3 rounded-none font-medium transition-all duration-300",
        "tp-btn-cart-border": "border-2 border-[#2c5aa0] text-[#2c5aa0] hover:bg-[#2c5aa0] hover:text-white px-6 py-3 rounded-none font-medium transition-all duration-300",
        "tp-btn-black": "bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-none font-medium transition-all duration-300",
        "tp-btn-black-2": "bg-black text-white hover:bg-gray-800 px-8 py-4 rounded-none font-medium transition-all duration-300",
        "tp-btn-black-md": "bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-md font-medium transition-all duration-300",
        "tp-btn-black-sm": "bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-none text-sm font-medium transition-all duration-300",
        "tp-btn-white": "bg-white text-black hover:bg-gray-100 px-6 py-3 rounded-none font-medium transition-all duration-300",
        "tp-btn-white-sm": "bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-none text-sm font-medium transition-all duration-300",
        "tp-btn-border": "border-2 border-black text-black hover:bg-black hover:text-white px-6 py-3 rounded-none font-medium transition-all duration-300",
        "tp-btn-border-sm": "border-2 border-black text-black hover:bg-black hover:text-white px-4 py-2 rounded-none text-sm font-medium transition-all duration-300",
        "tp-btn-border-lg": "border-2 border-black text-black hover:bg-black hover:text-white px-8 py-4 rounded-none font-medium transition-all duration-300",
        "tp-btn-zikzak": "bg-transparent text-black hover:text-[#2c5aa0] px-6 py-3 rounded-none font-medium transition-all duration-300 relative",
        "tp-btn-zikzak-sm": "bg-transparent text-black hover:text-[#2c5aa0] px-4 py-2 rounded-none text-sm font-medium transition-all duration-300 relative",
        "tp-btn-animation": "bg-black text-white hover:bg-gray-800 px-6 py-3 rounded-none font-medium transition-all duration-300 overflow-hidden relative",
        "tp-btn-circle": "w-12 h-12 rounded-full bg-black text-white hover:bg-gray-800 flex items-center justify-center transition-all duration-300",
        "tp-btn-circle-2": "w-16 h-16 rounded-full bg-black text-white hover:bg-gray-800 flex items-center justify-center transition-all duration-300",
        "tp-shop-btn": "bg-[#2c5aa0] text-white hover:bg-[#1e3f73] px-6 py-3 rounded-none font-medium transition-all duration-300",
        "tp-logout-btn": "bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9",
        xs: "h-7 rounded-md px-2",
        // Custom sizes
        "tp-sm": "px-4 py-2 text-sm",
        "tp-md": "px-6 py-3",
        "tp-lg": "px-8 py-4 text-lg",
        "tp-xl": "px-10 py-5 text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonConsolidatedProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

const ButtonConsolidated = React.forwardRef<HTMLButtonElement, ButtonConsolidatedProps>(
  ({ className, variant, size, asChild = false, href, target, rel, children, ...props }, ref) => {
    // If href is provided, render as Link
    if (href) {
      return (
        <Link
          href={href}
          target={target}
          rel={rel}
          className={cn(buttonVariants({ variant, size, className }))}
        >
          {children}
        </Link>
      );
    }

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
ButtonConsolidated.displayName = "ButtonConsolidated";

// Specialized button components for common use cases
export const CartButton = React.forwardRef<HTMLButtonElement, Omit<ButtonConsolidatedProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <ButtonConsolidated
      variant="tp-btn-cart"
      className={className}
      ref={ref}
      {...props}
    />
  )
);
CartButton.displayName = "CartButton";

export const CartBorderButton = React.forwardRef<HTMLButtonElement, Omit<ButtonConsolidatedProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <ButtonConsolidated
      variant="tp-btn-cart-border"
      className={className}
      ref={ref}
      {...props}
    />
  )
);
CartBorderButton.displayName = "CartBorderButton";

export const BlackButton = React.forwardRef<HTMLButtonElement, Omit<ButtonConsolidatedProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <ButtonConsolidated
      variant="tp-btn-black"
      className={className}
      ref={ref}
      {...props}
    />
  )
);
BlackButton.displayName = "BlackButton";

export const WhiteButton = React.forwardRef<HTMLButtonElement, Omit<ButtonConsolidatedProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <ButtonConsolidated
      variant="tp-btn-white"
      className={className}
      ref={ref}
      {...props}
    />
  )
);
WhiteButton.displayName = "WhiteButton";

export const BorderButton = React.forwardRef<HTMLButtonElement, Omit<ButtonConsolidatedProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <ButtonConsolidated
      variant="tp-btn-border"
      className={className}
      ref={ref}
      {...props}
    />
  )
);
BorderButton.displayName = "BorderButton";

export const CircleButton = React.forwardRef<HTMLButtonElement, Omit<ButtonConsolidatedProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <ButtonConsolidated
      variant="tp-btn-circle"
      className={className}
      ref={ref}
      {...props}
    />
  )
);
CircleButton.displayName = "CircleButton";

export const ShopButton = React.forwardRef<HTMLButtonElement, Omit<ButtonConsolidatedProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <ButtonConsolidated
      variant="tp-shop-btn"
      className={className}
      ref={ref}
      {...props}
    />
  )
);
ShopButton.displayName = "ShopButton";

export { ButtonConsolidated, buttonVariants };
