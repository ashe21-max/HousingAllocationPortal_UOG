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
}

export interface TabsTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
  className?: string;
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
          return React.cloneElement(child as React.ReactElement<any>, { activeTab, setActiveTab });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, className, ...props }: TabsListProps) {
  return (
    <div
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className, activeTab, setActiveTab, ...props }: TabsTriggerProps & { activeTab?: string; setActiveTab?: (value: string) => void }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        activeTab === value ? 'bg-background text-foreground shadow-sm' : 'transparent hover:bg-background/50',
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
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
