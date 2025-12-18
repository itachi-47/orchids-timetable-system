import { getBatches } from '@/lib/batches/actions'
import { getCourseTypes } from '@/lib/course-types/actions'
import { BatchesManager } from '@/components/batches/batches-manager'
import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { CoordinatorLayout } from '@/components/layout/coordinator-layout'

export default async function CoordinatorBatchesPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'timetable_coordinator') {
    redirect('/login')
  }

  const [batches, courseTypes] = await Promise.all([
    getBatches(),
    getCourseTypes(),
  ])

  return (
    <CoordinatorLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Batches & Course Types</h1>
          <p className="mt-1 text-slate-600">Manage student batches and course categories</p>
        </div>

        <BatchesManager batches={batches} courseTypes={courseTypes} isAdmin={false} />
      </div>
    </CoordinatorLayout>
  )
}
