import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { CoordinatorLayout } from '@/components/layout/coordinator-layout'
import { getSubjectsWithFaculty } from '@/lib/timetable/actions'
import { getBatches } from '@/lib/batches/actions'
import { GenerateDraftForm } from '@/components/coordinator/generate-draft-form'

export default async function CoordinatorGeneratePage() {
  const user = await getCurrentUser()
  
  if (!user || (user.role !== 'timetable_coordinator' && user.role !== 'admin')) {
    redirect('/login')
  }

  const [{ subjects, faculty }, batches] = await Promise.all([
    getSubjectsWithFaculty(),
    getBatches(),
  ])

  return (
    <CoordinatorLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Generate Timetable</h1>
          <p className="mt-1 text-slate-600">Create a new timetable draft</p>
        </div>

        <GenerateDraftForm 
          subjects={subjects} 
          faculty={faculty} 
          batches={batches}
          currentUser={user}
        />
      </div>
    </CoordinatorLayout>
  )
}
