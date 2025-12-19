import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { CoordinatorLayout } from '@/components/layout/coordinator-layout'
import { getTimetableDraftById, getDraftSlots } from '@/lib/timetable-drafts/actions'
import { TimetableGrid } from '@/components/timetable/timetable-grid'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import type { TimetableStatus } from '@/types'
import type { TimetableEntry } from '@/lib/timetable/types'

const statusConfig: Record<TimetableStatus, { icon: React.ElementType; label: string; className: string }> = {
  DRAFT: { icon: FileText, label: 'Draft', className: 'bg-slate-100 text-slate-700' },
  SUBMITTED: { icon: Clock, label: 'Submitted', className: 'bg-amber-100 text-amber-700' },
  APPROVED: { icon: CheckCircle, label: 'Approved', className: 'bg-emerald-100 text-emerald-700' },
  REJECTED: { icon: XCircle, label: 'Rejected', className: 'bg-red-100 text-red-700' },
}

export default async function DraftViewPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  const { id } = await params
  
  if (!user || (user.role !== 'timetable_coordinator' && user.role !== 'admin')) {
    redirect('/login')
  }

  const draft = await getTimetableDraftById(id)
  
  if (!draft) {
    redirect('/coordinator/drafts')
  }

  const slots = await getDraftSlots(id)
  const entries = slots as unknown as TimetableEntry[]

  const config = statusConfig[draft.status]
  const StatusIcon = config.icon

  return (
    <CoordinatorLayout user={user}>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{draft.name}</h1>
            <Badge className={config.className}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          </div>
          <p className="text-slate-600">View and manage your timetable draft</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-500">Semester</p>
                <p className="font-medium text-slate-900">{draft.semester}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Session</p>
                <p className="font-medium text-slate-900">{draft.session}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Created</p>
                <p className="font-medium text-slate-900">
                  {new Date(draft.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Last Updated</p>
                <p className="font-medium text-slate-900">
                  {new Date(draft.updated_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {draft.status === 'REJECTED' && draft.rejection_reason && (
              <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Rejection Reason</p>
                  <p className="text-sm">{draft.rejection_reason}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <TimetableGrid entries={entries} batchName={draft.name} />
      </div>
    </CoordinatorLayout>
  )
}
