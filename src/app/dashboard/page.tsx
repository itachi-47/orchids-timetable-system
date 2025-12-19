import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/actions'
import { getDashboardRoute } from '@/lib/auth/roles'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  redirect(getDashboardRoute(user.role))
}
