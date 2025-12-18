import { SubjectForm } from '@/components/subjects/subject-form'
import { getCurrentUser } from '@/lib/auth/actions'
import { getSubjectById } from '@/lib/subjects/actions'
import { redirect, notFound } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'

export default async function EditSubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  const { id } = await params
  const subject = await getSubjectById(id)

  if (!subject) {
    notFound()
  }

  return (
    <AdminLayout user={user}>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Subject</h1>
          <p className="mt-1 text-slate-600">Update subject information</p>
        </div>

        <SubjectForm subject={subject} mode="edit" />
      </div>
    </AdminLayout>
  )
}
