import { getFacultyById } from '@/lib/faculty/actions'
import { FacultyForm } from '@/components/faculty/faculty-form'
import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/actions'
import { AdminLayout } from '@/components/layout/admin-layout'

export default async function EditFacultyPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  const { id } = await params
  
  try {
    const faculty = await getFacultyById(id)
    
    return (
      <AdminLayout user={user}>
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Faculty</h1>
            <p className="mt-1 text-slate-600">Update faculty member information</p>
          </div>

          <FacultyForm faculty={faculty} mode="edit" />
        </div>
      </AdminLayout>
    )
  } catch {
    notFound()
  }
}
