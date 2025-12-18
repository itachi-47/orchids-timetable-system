import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { HODLayout } from '@/components/layout/hod-layout'
import { getTimetableDraftsByStatus } from '@/lib/timetable-drafts/actions'
import { getBatches } from '@/lib/batches/actions'
import { getUsers } from '@/lib/users/actions'
import { PendingApprovalsList } from '@/components/hod/pending-approvals-list'

export default async function HODApprovalsPage() {
  const user = await getCurrentUser()
  
  if (!user || (user.role !== 'hod' && user.role !== 'admin')) {
    redirect('/login')
  }

  const [drafts, batches, users] = await Promise.all([
    getTimetableDraftsByStatus('SUBMITTED', user.department_id),
    getBatches(),
    getUsers(),
  ])

  return (
    <HODLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pending Approvals</h1>
          <p className="mt-1 text-slate-600">Review and approve submitted timetables</p>
        </div>

        <PendingApprovalsList 
          drafts={drafts} 
          batches={batches} 
          users={users}
          currentUser={user}
        />
      </div>
    </HODLayout>
  )
}
