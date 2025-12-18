import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AdminSidebar } from './admin-sidebar'
import { AdminHeader } from './admin-header'

type User = {
  id: string
  email: string
  role: string
  full_name: string
}

export function AdminLayout({
  children,
  user,
}: {
  children: React.ReactNode
  user: User
}) {
  return (
    <SidebarProvider>
      <AdminSidebar user={user} />
      <SidebarInset className="bg-slate-50">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
