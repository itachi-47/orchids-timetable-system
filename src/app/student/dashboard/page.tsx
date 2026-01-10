import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/actions'
import { StudentDashboard } from '@/components/dashboard/student-dashboard'

export default async function StudentDashboardPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'student') redirect('/dashboard')
  
  redirect('/student/timetable')
}
