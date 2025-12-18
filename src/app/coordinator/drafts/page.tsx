import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { CoordinatorLayout } from '@/components/layout/coordinator-layout'
import { getTimetableDrafts } from '@/lib/timetable-drafts/actions'
import { getBatches } from '@/lib/batches/actions'
import { DraftsList } from '@/components/coordinator/drafts-list'

export default async function CoordinatorDraftsPage() {
  const user = await getCurrentUser()
  
  if (!user || (user.role !== 'timetable_coordinator' && user.role !== 'admin')) {
    redirect('/login')
  }

  const [drafts, batches] = await Promise.all([
    getTimetableDrafts(user.department_id),
    getBatches(),
  ])

  return (
    <CoordinatorLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Drafts</h1>
          <p className="mt-1 text-slate-600">View and manage your timetable drafts</p>
        </div>

        <DraftsList drafts={drafts} batches={batches} currentUser={user} />
      </div>
    </CoordinatorLayout>
  )
}
