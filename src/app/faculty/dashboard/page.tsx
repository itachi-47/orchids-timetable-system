import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/actions'
import { FacultyDashboard } from '@/components/dashboard/faculty-dashboard'

export default async function FacultyDashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'faculty') redirect('/dashboard')
  
  return <FacultyDashboard user={user} />
}
