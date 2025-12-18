import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/actions'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'
import { StudentDashboard } from '@/components/dashboard/student-dashboard'
import { CoordinatorDashboard } from '@/components/dashboard/coordinator-dashboard'
import { HODDashboard } from '@/components/dashboard/hod-dashboard'
import { FacultyDashboard } from '@/components/dashboard/faculty-dashboard'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard user={user} />
    case 'hod':
      return <HODDashboard user={user} />
    case 'timetable_coordinator':
      return <CoordinatorDashboard user={user} />
    case 'faculty':
      return <FacultyDashboard user={user} />
    case 'student':
    default:
      return <StudentDashboard user={user} />
  }
}
