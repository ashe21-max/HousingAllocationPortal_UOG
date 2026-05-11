import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | null;
  hint?: string;
  icon?: React.ReactNode;
  allowPasswordToggle?: boolean;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  success?: boolean;
  loading?: boolean;
};

const variantClasses = {
  default: 'bg-[var(--surface)] border-[var(--border)] focus:border-[var(--color-blue)] focus:ring-[var(--color-blue)]/20',
  filled: 'bg-[var(--surface-muted)] border-transparent focus:bg-[var(--surface)] focus:border-[var(--color-blue)] focus:ring-[var(--color-blue)]/20',
  outlined: 'bg-transparent border-[var(--border)] focus:border-[var(--color-blue)] focus:ring-[var(--color-blue)]/20',
};

const sizeClasses = {
  sm: 'h-10 px-3 text-sm',
  md: 'h-12 px-4 text-base',
  lg: 'h-14 px-5 text-lg',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    error,
    hint,
    icon,
    allowPasswordToggle = false,
    variant = 'default',
    size = 'md',
    success = false,
    loading = false,
    type,
    disabled,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputType = allowPasswordToggle && type === 'password'
      ? (showPassword ? 'text' : 'password')
      : type;

    const hasError = !!error;
    const hasSuccess = success && !hasError;

    return (
      <div className="space-y-2">
        <label className={cn(
          'block text-sm font-medium transition-colors duration-[var(--transition-fast)]',
          hasError ? 'text-[var(--color-red)]' :
          hasSuccess ? 'text-[var(--color-green)]' :
          'text-[var(--foreground)]'
        )}>
          {label}
        </label>
        <div className="relative group">
          {icon && (
            <div className={cn(
              'absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-[var(--transition-fast)]',
              hasError ? 'text-[var(--color-red)]' :
              hasSuccess ? 'text-[var(--color-green)]' :
              'text-[var(--foreground-tertiary)]'
            )}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            disabled={disabled || loading}
            value={props.value || ''}
            onChange={props.onChange}
            className={cn(
              'w-full border rounded-[var(--radius-lg)] text-[var(--foreground)] caret-[var(--foreground)] transition-all duration-[var(--transition-normal)]',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'placeholder:text-[var(--foreground-tertiary)]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              icon && 'pl-10',
              variantClasses[variant],
              sizeClasses[size as keyof typeof sizeClasses],
              hasError && 'border-[var(--color-red)] focus:border-[var(--color-red)] focus:ring-[var(--color-red)]/20',
              hasSuccess && 'border-[var(--color-green)] focus:border-[var(--color-green)] focus:ring-[var(--color-green)]/20',
              isFocused && 'shadow-[var(--shadow-sm)]',
              className
            )}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...(props.value !== undefined ? {} : props)}
          />

          {/* Status icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {loading && (
              <div className="animate-spin h-4 w-4">
                <svg viewBox="0 0 24 24" className="text-[var(--color-blue)]">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            )}
            {hasError && !loading && (
              <AlertCircle size={16} className="text-[var(--color-red)]" />
            )}
            {hasSuccess && !loading && (
              <CheckCircle size={16} className="text-[var(--color-green)]" />
            )}
            {allowPasswordToggle && type === 'password' && !loading && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  'transition-colors duration-[var(--transition-fast)]',
                  hasError ? 'text-[var(--color-red)] hover:text-[var(--color-red-dark)]' :
                  hasSuccess ? 'text-[var(--color-green)] hover:text-[var(--color-green-dark)]' :
                  'text-[var(--foreground-tertiary)] hover:text-[var(--foreground)]'
                )}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
        </div>

        {/* Helper text */}
        {(error || hint) && (
          <div className="flex items-start gap-1">
            {hasError && <AlertCircle size={14} className="text-[var(--color-red)] mt-0.5 flex-shrink-0" />}
            <p className={cn(
              'text-sm transition-colors duration-[var(--transition-fast)]',
              hasError ? 'text-[var(--color-red)]' : 'text-[var(--foreground-tertiary)]'
            )}>
              {error || hint}
            </p>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
