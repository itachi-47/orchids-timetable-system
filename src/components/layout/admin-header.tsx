'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'

const pathLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  admin: 'Admin',
  subjects: 'Subjects',
  faculty: 'Faculty',
  rooms: 'Rooms',
  batches: 'Batches',
  timetable: 'Timetable',
  generate: 'Generate',
  create: 'Create',
  edit: 'Edit',
}

export function AdminHeader() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const breadcrumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/')
    const isLast = index === segments.length - 1
    const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

    return { href, label, isLast }
  })

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-4">
      <SidebarTrigger className="-ml-1 text-slate-600 hover:text-slate-900" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <Fragment key={crumb.href}>
              {index > 0 && <BreadcrumbSeparator className="text-slate-400" />}
              <BreadcrumbItem>
                {crumb.isLast ? (
                  <BreadcrumbPage className="font-medium text-slate-900">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={crumb.href}
                    className="text-slate-600 transition-colors hover:text-slate-900"
                  >
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
