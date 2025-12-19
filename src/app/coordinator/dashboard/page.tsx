import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/actions'
import { CoordinatorDashboard } from '@/components/dashboard/coordinator-dashboard'

export default async function CoordinatorDashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'timetable_coordinator') redirect('/dashboard')
  
  return <CoordinatorDashboard user={user} />
}
