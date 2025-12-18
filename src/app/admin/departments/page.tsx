import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'
import { getDepartments } from '@/lib/departments/actions'
import { getUsers } from '@/lib/users/actions'
import { DepartmentsList } from '@/components/departments/departments-list'

export default async function DepartmentsPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  const [departments, users] = await Promise.all([
    getDepartments(),
    getUsers(),
  ])

  const facultyUsers = users.filter(u => 
    u.role === 'faculty' || u.role === 'hod' || u.role === 'timetable_coordinator'
  )

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Departments</h1>
          <p className="mt-1 text-slate-600">Manage departments and assign HOD/Coordinators</p>
        </div>

        <DepartmentsList departments={departments} facultyUsers={facultyUsers} />
      </div>
    </AdminLayout>
  )
}
