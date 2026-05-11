import React from 'react';
import { cn } from '@/lib/utils';

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
}

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
}

export interface TabsTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
  className?: string;
  activeTab?: string;
  setActiveTab?: (value: string) => void;
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ children, defaultValue, className, ...props }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue || '');

  return (
    <div className={cn('w-full', className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ activeTab: string; setActiveTab: (value: string) => void }>, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, className, activeTab, setActiveTab, ...props }: TabsListProps) {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-1 text-[var(--foreground-secondary)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className, activeTab, setActiveTab, ...props }: TabsTriggerProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50',
        activeTab === value
          ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
          : 'bg-transparent text-[var(--foreground-secondary)] hover:bg-[var(--background)] hover:text-[var(--foreground)]',
        className
      )}
      onClick={() => setActiveTab?.(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className, activeTab, ...props }: TabsContentProps & { activeTab?: string }) {
  if (activeTab !== value) {
    return null;
  }

  return (
    <div
      className={cn(
        'mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
        className
      )}
    >
      {children}
    </div>
  );
}
