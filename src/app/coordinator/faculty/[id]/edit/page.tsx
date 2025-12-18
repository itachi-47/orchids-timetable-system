import { FacultyForm } from '@/components/faculty/faculty-form'
import { getCurrentUser } from '@/lib/auth/actions'
import { getFacultyById } from '@/lib/faculty/actions'
import { redirect, notFound } from 'next/navigation'
import { CoordinatorLayout } from '@/components/layout/coordinator-layout'

export default async function CoordinatorEditFacultyPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'timetable_coordinator') {
    redirect('/login')
  }

  const { id } = await params
  const faculty = await getFacultyById(id)

  if (!faculty) {
    notFound()
  }

  return (
    <CoordinatorLayout user={user}>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Faculty</h1>
          <p className="mt-1 text-slate-600">Update faculty information</p>
        </div>

        <FacultyForm faculty={faculty} mode="edit" isAdmin={false} />
      </div>
    </CoordinatorLayout>
  )
}
