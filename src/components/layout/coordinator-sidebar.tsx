'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  Users,
  DoorOpen,
  School,
  Grid3x3,
  FileText,
  LayoutDashboard,
  LogOut,
  GraduationCap,
} from 'lucide-react'
import { logout } from '@/lib/auth/actions'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Subjects',
    href: '/coordinator/subjects',
    icon: BookOpen,
  },
  {
    title: 'Faculty',
    href: '/coordinator/faculty',
    icon: Users,
  },
  {
    title: 'Rooms',
    href: '/coordinator/rooms',
    icon: DoorOpen,
  },
  {
    title: 'Batches',
    href: '/coordinator/batches',
    icon: School,
  },
]

const timetableItems = [
  {
    title: 'Generate',
    href: '/coordinator/timetable/generate',
    icon: Grid3x3,
  },
  {
    title: 'My Drafts',
    href: '/coordinator/drafts',
    icon: FileText,
  },
]

type User = {
  id: string
  email: string
  role: string
  full_name: string
}

export function CoordinatorSidebar({ user }: { user: User }) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-slate-200">
      <SidebarHeader className="border-b border-slate-200 px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-emerald-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 group-data-[collapsible=icon]:hidden">
            Coordinator
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Timetable
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {timetableItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-700 to-emerald-800 text-sm font-medium text-white">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-1 flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium text-slate-900">{user.full_name}</span>
            <span className="truncate text-xs text-slate-500">{user.email}</span>
          </div>
          <form action={logout} className="group-data-[collapsible=icon]:hidden">
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
