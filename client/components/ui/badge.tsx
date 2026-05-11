import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  children: React.ReactNode;
}

export function Badge({ children, className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-dark)]',
    secondary: 'border-[var(--border)] bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:bg-[var(--background-tertiary)]',
    destructive: 'border-[var(--destructive)] bg-[var(--destructive)] text-[var(--destructive-foreground)] hover:bg-[var(--color-red-dark)]',
    outline: 'border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]',
    success: 'border-[var(--color-green)] bg-[var(--color-green)] text-white hover:bg-[var(--color-green-dark)]',
    warning: 'border-[var(--color-yellow)] bg-[var(--color-yellow)] text-white hover:bg-[var(--color-yellow-dark)]',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:ring-offset-2 focus:ring-offset-[var(--background)]',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
