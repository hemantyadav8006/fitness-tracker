import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}

function getButtonClasses(variant: ButtonVariant, size: ButtonSize): string {
  const base =
    "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 gap-2";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/90",
    secondary:
      "bg-muted text-foreground border border-border hover:bg-muted/80",
    ghost:
      "bg-transparent text-foreground hover:bg-muted border border-transparent",
    danger: "bg-red-500 text-white shadow-md hover:bg-red-500/90 hover:shadow-lg",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4",
    lg: "h-10 px-5 text-base",
    icon: "h-9 w-9 justify-center p-0",
  };

  return cn(base, variants[variant], sizes[size]);
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(getButtonClasses(variant, size), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-[2px] border-white/50 border-t-transparent"
        />
      )}
      {leftIcon && !isLoading ? leftIcon : null}
      <span>{children}</span>
      {rightIcon && !isLoading ? rightIcon : null}
    </button>
  );
}

