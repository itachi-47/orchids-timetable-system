import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/actions'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'admin') redirect('/dashboard')
  
  return <AdminDashboard user={user} />
}
