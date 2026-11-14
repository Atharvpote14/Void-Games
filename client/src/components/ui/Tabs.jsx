import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    aria-orientation='horizontal'
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-surface p-1',
      'border border-border',
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-label-md',
      'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      'focus-visible:ring-offset-2 focus-visible:ring-offset-neutral',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-primary data-[state=active]:text-on-surface data-[state=active]:shadow-[0_0_16px_rgba(42,169,224,0.15)]',
      'data-[state=inactive]:text-on-surface-muted data-[state=inactive]:hover:text-on-surface',
      'data-[state=inactive]:hover:bg-surface-raised',
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 ring-offset-neutral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      'animate-fade-in',
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }