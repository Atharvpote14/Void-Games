import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    aria-orientation='horizontal'
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-btn bg-[rgba(255,255,255,0.03)] p-1',
      'backdrop-blur-sm border border-border-subtle',
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
      'inline-flex items-center justify-center whitespace-nowrap rounded-btn px-4 py-2 text-sm font-medium',
      'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      'focus-visible:ring-offset-2 focus-visible:ring-offset-void-bg',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-btn-primary',
      'data-[state=inactive]:text-text-secondary data-[state=inactive]:hover:text-text-primary',
      'data-[state=inactive]:hover:bg-white/5',
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
      'mt-4 ring-offset-void-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      'animate-fade-in data-[orientation=horizontal]:animate-slide-up',
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
