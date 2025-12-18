import { FacultyForm } from '@/components/faculty/faculty-form'
import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'

export default async function CreateFacultyPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  return (
    <AdminLayout user={user}>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add Faculty</h1>
          <p className="mt-1 text-slate-600">Add a new faculty member to your system</p>
        </div>

        <FacultyForm mode="create" />
      </div>
    </AdminLayout>
  )
}
