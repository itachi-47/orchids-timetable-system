import { getCurrentUser } from '@/lib/auth/actions'
import { redirect, notFound } from 'next/navigation'
import { HODLayout } from '@/components/layout/hod-layout'
import { getTimetableDraftById, getDraftSlots, approveTimetable, rejectTimetable } from '@/lib/timetable-drafts/actions'
import { getBatches } from '@/lib/batches/actions'
import { TimetableGrid } from '@/components/timetable/timetable-grid'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function DraftReviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  const { id } = await params

  if (!user || (user.role !== 'hod' && user.role !== 'admin')) {
    redirect('/login')
  }

  const [draft, slots, batches] = await Promise.all([
    getTimetableDraftById(id),
    getDraftSlots(id),
    getBatches(),
  ])

  if (!draft) {
    notFound()
  }

  const batch = batches.find(b => b.id === draft.batch_id)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return <Badge className="bg-amber-100 text-amber-700"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
      case 'APPROVED':
        return <Badge className="bg-emerald-100 text-emerald-700"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>
      case 'REJECTED':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <HODLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/hod/approvals">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{draft.name}</h1>
                {getStatusBadge(draft.status)}
              </div>
              <p className="text-slate-600">Reviewing draft for {batch?.batch_name} - Sem {draft.semester}</p>
            </div>
          </div>

          {draft.status === 'SUBMITTED' && (
            <div className="flex items-center gap-2">
              <form action={async () => {
                'use server'
                await approveTimetable(id, user.id)
                redirect('/hod/approved')
              }}>
                <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
              </form>
              <Link href={`#reject`}>
                <Button variant="destructive" className="gap-2">
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </Link>
            </div>
          )}
        </div>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Draft Timetable Grid</CardTitle>
            </CardHeader>
            <CardContent>
              <TimetableGrid 
                entries={slots as any} 
                batchName={batch?.batch_name}
                editable={false}
                pdfOptions={{
                  programName: draft.program_name,
                  semester: `Semester ${draft.semester}`,
                  session: draft.session,
                  effectiveDate: draft.effective_date,
                  coordinatorName: draft.coordinator_name,
                  hodName: draft.hod_name,
                }}
              />
            </CardContent>
          </Card>

        {draft.status === 'REJECTED' && draft.rejection_reason && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 text-lg">Rejection Reason</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">{draft.rejection_reason}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </HODLayout>
  )
}
