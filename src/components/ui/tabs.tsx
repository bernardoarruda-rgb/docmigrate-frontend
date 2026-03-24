import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  value: string
  onChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue>({
  value: '',
  onChange: () => {},
})

function Tabs({
  value,
  onValueChange,
  children,
  className,
}: {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}) {
  const contextValue = React.useMemo(
    () => ({ value, onChange: onValueChange }),
    [value, onValueChange],
  )

  return (
    <TabsContext.Provider value={contextValue}>
      <div data-slot="tabs" className={cn('flex flex-col', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabsList({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="tabs-list"
      role="tablist"
      className={cn(
        'flex items-center gap-1 rounded-lg bg-muted p-1',
        className,
      )}
    >
      {children}
    </div>
  )
}

function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const { value: selected, onChange } = React.useContext(TabsContext)
  const isActive = selected === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={() => onChange(value)}
      className={cn(
        'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
        className,
      )}
    >
      {children}
    </button>
  )
}

function TabsContent({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const { value: selected } = React.useContext(TabsContext)
  if (selected !== value) return null

  return (
    <div
      data-slot="tabs-content"
      role="tabpanel"
      className={cn('mt-3', className)}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
