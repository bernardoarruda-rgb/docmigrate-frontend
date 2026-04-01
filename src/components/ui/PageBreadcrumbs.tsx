import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import type { BreadcrumbItem } from '@/types/page'
import {
  Breadcrumb,
  BreadcrumbItem as BreadcrumbItemPrimitive,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'

interface PageBreadcrumbsProps {
  spaceId: number
  spaceName?: string
  breadcrumbs?: BreadcrumbItem[]
  currentPageTitle: string
  showHome?: boolean
  suffix?: string
  className?: string
}

export function PageBreadcrumbs({
  spaceId,
  spaceName,
  breadcrumbs,
  currentPageTitle,
  showHome = true,
  suffix,
  className,
}: PageBreadcrumbsProps) {
  // All breadcrumb items except the last one are ancestors (clickable links).
  // The last item is the current page (non-clickable).
  const ancestors = (breadcrumbs ?? []).slice(0, -1)

  return (
    <Breadcrumb className={cn(className)}>
      <BreadcrumbList>
        {showHome && (
          <>
            <BreadcrumbItemPrimitive>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1">
                  <Home className="h-3 w-3" />
                  Inicio
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItemPrimitive>
            <BreadcrumbSeparator />
          </>
        )}

        <BreadcrumbItemPrimitive>
          {spaceName ? (
            <BreadcrumbLink asChild>
              <Link to={`/spaces/${spaceId}`}>{spaceName}</Link>
            </BreadcrumbLink>
          ) : (
            <span className="h-4 w-20 inline-block bg-muted animate-pulse rounded" />
          )}
        </BreadcrumbItemPrimitive>

        {ancestors.map((crumb) => (
          <React.Fragment key={crumb.id}>
            <BreadcrumbSeparator />
            <BreadcrumbItemPrimitive>
              <BreadcrumbLink asChild>
                <Link to={`/spaces/${spaceId}/pages/${crumb.id}`}>{crumb.title}</Link>
              </BreadcrumbLink>
            </BreadcrumbItemPrimitive>
          </React.Fragment>
        ))}

        <BreadcrumbSeparator />

        <BreadcrumbItemPrimitive>
          {suffix ? (
            <BreadcrumbLink asChild>
              <Link to={`/spaces/${spaceId}/pages/${(breadcrumbs ?? [])[( breadcrumbs ?? []).length - 1]?.id ?? 0}`}>
                {currentPageTitle}
              </Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{currentPageTitle}</BreadcrumbPage>
          )}
        </BreadcrumbItemPrimitive>

        {suffix && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItemPrimitive>
              <BreadcrumbPage>{suffix}</BreadcrumbPage>
            </BreadcrumbItemPrimitive>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
