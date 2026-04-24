import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  hover?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

const variantClasses = {
  default: 'bg-[var(--surface)] border-[var(--border)] shadow-[var(--shadow-sm)]',
  elevated: 'bg-[var(--surface-elevated)] border-[var(--border)] shadow-[var(--shadow-lg)]',
  outlined: 'bg-[var(--surface)] border-[var(--border)] shadow-none',
  glass: 'bg-white/80 backdrop-blur-xl border-white/20 shadow-[var(--shadow-lg)]',
};

const titleSizeClasses = {
  sm: 'text-lg font-semibold',
  md: 'text-xl font-semibold',
  lg: 'text-2xl font-bold',
  xl: 'text-3xl font-bold',
};

export function Card({ children, className, variant = 'default', hover = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-xl)] transition-all duration-[var(--transition-normal)]',
        variantClasses[variant],
        hover && 'hover:shadow-[var(--shadow-md)] hover:-translate-y-1 hover:border-[var(--color-blue)]/20',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn('flex flex-col space-y-2 p-6 pb-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, size = 'md', ...props }: CardTitleProps) {
  return (
    <h3
      className={cn(
        'leading-tight tracking-tight text-[var(--foreground)]',
        titleSizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }: CardDescriptionProps) {
  return (
    <p
      className={cn('text-sm text-[var(--foreground-tertiary)] leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }: CardContentProps) {
  return (
    <div
      className={cn('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center p-6 pt-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}
