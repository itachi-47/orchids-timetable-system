import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { HODSidebar } from './hod-sidebar'
import { AdminHeader } from './admin-header'

type User = {
  id: string
  email: string
  role: string
  full_name: string
}

export function HODLayout({
  children,
  user,
}: {
  children: React.ReactNode
  user: User
}) {
  return (
    <SidebarProvider>
      <HODSidebar user={user} />
      <SidebarInset className="bg-slate-50 dark:bg-slate-900/50">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
