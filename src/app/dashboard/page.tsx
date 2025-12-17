import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/actions'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'
import { StudentDashboard } from '@/components/dashboard/student-dashboard'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  if (user.role === 'admin') {
    return <AdminDashboard user={user} />
  }

  return <StudentDashboard user={user} />
}
