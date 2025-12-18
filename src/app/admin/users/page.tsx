import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'
import { getUsers } from '@/lib/users/actions'
import { getDepartments } from '@/lib/departments/actions'
import { UsersList } from '@/components/users/users-list'

export default async function UsersPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  const [users, departments] = await Promise.all([
    getUsers(),
    getDepartments(),
  ])

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Users</h1>
          <p className="mt-1 text-slate-600">Manage users and assign roles</p>
        </div>

        <UsersList users={users} departments={departments} />
      </div>
    </AdminLayout>
  )
}
