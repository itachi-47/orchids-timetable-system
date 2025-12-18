import { SubjectForm } from '@/components/subjects/subject-form'
import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { CoordinatorLayout } from '@/components/layout/coordinator-layout'

export default async function CoordinatorCreateSubjectPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'timetable_coordinator') {
    redirect('/login')
  }

  return (
    <CoordinatorLayout user={user}>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Subject</h1>
          <p className="mt-1 text-slate-600">Add a new subject to your system</p>
        </div>

        <SubjectForm mode="create" isAdmin={false} />
      </div>
    </CoordinatorLayout>
  )
}
