import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { HODLayout } from '@/components/layout/hod-layout'
import { getTimetableDraftsByStatus } from '@/lib/timetable-drafts/actions'
import { getBatches } from '@/lib/batches/actions'
import { getUsers } from '@/lib/users/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Calendar, User, Send, Eye } from 'lucide-react'
import { publishTimetable } from '@/lib/timetable-drafts/actions'
import Link from 'next/link'

export default async function HODApprovedPage() {
  const user = await getCurrentUser()
  
  if (!user || (user.role !== 'hod' && user.role !== 'admin')) {
    redirect('/login')
  }

  const [drafts, batches, users] = await Promise.all([
    getTimetableDraftsByStatus('APPROVED', user.department_id),
    getBatches(),
    getUsers(),
  ])

  const getBatchName = (batchId: string) => batches.find(b => b.id === batchId)?.batch_name || 'Unknown'
  const getCreatorName = (userId: string) => users.find(u => u.id === userId)?.full_name || 'Unknown'

  return (
    <HODLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Approved Timetables</h1>
          <p className="mt-1 text-slate-600">Timetables ready to be published to students and faculty</p>
        </div>

        {drafts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-600">No approved timetables yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {drafts.map((draft) => (
              <Card key={draft.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{draft.name}</CardTitle>
                    <Badge className="bg-emerald-100 text-emerald-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approved
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{getBatchName(draft.batch_id)}</span>
                    </div>
                    <div>Sem: {draft.semester}</div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{getCreatorName(draft.created_by)}</span>
                    </div>
                    <div>{draft.session}</div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t">
                    <Link href={`/hod/approvals/${draft.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-1">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <form action={async () => {
                      'use server'
                      await publishTimetable(draft.id, user.id)
                    }} className="flex-1">
                      <Button size="sm" className="w-full gap-1 bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4" />
                        Publish
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </HODLayout>
  )
}
