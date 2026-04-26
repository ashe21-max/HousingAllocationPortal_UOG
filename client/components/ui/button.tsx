import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "ghost" | "outline";
  size?: "xs" | "sm" | "md" | "lg" | "icon";
  busy?: boolean;
  fullWidth?: boolean;
};

const variantClasses = {
  primary: "bg-[var(--color-blue)] text-white hover:bg-[var(--color-blue-dark)] border-[var(--color-blue)] shadow-sm hover:shadow-md active:scale-[0.98]",
  secondary: "bg-[var(--surface-muted)] text-[var(--foreground)] hover:bg-[var(--background-tertiary)] border-[var(--border)] hover:border-[var(--color-blue)] hover:text-[var(--color-blue)]",
  success: "bg-[var(--color-green)] text-white hover:bg-[var(--color-green-dark)] border-[var(--color-green)] shadow-sm hover:shadow-md active:scale-[0.98]",
  warning: "bg-[var(--color-yellow)] text-white hover:bg-[var(--color-yellow-dark)] border-[var(--color-yellow)] shadow-sm hover:shadow-md active:scale-[0.98]",
  danger: "bg-[var(--color-red)] text-white hover:bg-[var(--color-red-dark)] border-[var(--color-red)] shadow-sm hover:shadow-md active:scale-[0.98]",
  ghost: "bg-transparent text-[var(--foreground-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] border-transparent",
  outline: "bg-transparent text-[var(--color-blue)] hover:bg-[var(--color-blue)] hover:text-white border-[var(--color-blue)] hover:border-[var(--color-blue)]",
};

const sizeClasses = {
  xs: "h-8 px-3 text-xs font-medium",
  sm: "h-10 px-4 text-sm font-medium",
  md: "h-12 px-6 text-sm font-semibold",
  lg: "h-14 px-8 text-base font-semibold",
  icon: "h-11 w-11 p-0 flex items-center justify-center",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className = "",
  variant = "primary",
  size = "md",
  busy = false,
  fullWidth = false,
  disabled,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center 
        border rounded-[var(--radius-lg)] 
        font-medium transition-all duration-[var(--transition-normal)]
        focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none
        relative overflow-hidden group touch-manipulation
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || busy}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {busy ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </span>
      {/* Shimmer effect */}
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[var(--transition-slow)] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </button>
  );
});

Button.displayName = "Button";
