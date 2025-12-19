import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/actions'
import { HODDashboard } from '@/components/dashboard/hod-dashboard'

export default async function HODDashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'hod') redirect('/dashboard')
  
  return <HODDashboard user={user} />
}
