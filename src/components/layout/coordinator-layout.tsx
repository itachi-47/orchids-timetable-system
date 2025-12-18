import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { CoordinatorSidebar } from './coordinator-sidebar'
import { AdminHeader } from './admin-header'

type User = {
  id: string
  email: string
  role: string
  full_name: string
}

export function CoordinatorLayout({
  children,
  user,
}: {
  children: React.ReactNode
  user: User
}) {
  return (
    <SidebarProvider>
      <CoordinatorSidebar user={user} />
      <SidebarInset className="bg-slate-50">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
