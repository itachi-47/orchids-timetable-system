import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { HODLayout } from '@/components/layout/hod-layout'
import { unpublishTimetable, deleteApprovedTimetable } from '@/lib/timetable-drafts/actions'
import { getBatches } from '@/lib/batches/actions'
import { getUsers } from '@/lib/users/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Send, Calendar, User, Eye, CheckCircle2, Undo2, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default async function HODPublishedPage() {
  const user = await getCurrentUser()
  
  if (!user || (user.role !== 'hod' && user.role !== 'admin')) {
    redirect('/login')
  }

  const db = (await import('@/lib/mongodb/client')).getDb()
  const [batches, users] = await Promise.all([
    getBatches(),
    getUsers(),
  ])

  // Fetch drafts that have a published_at date
  const drafts = await (await db).collection('timetable_drafts')
    .find({ published_at: { $exists: true } }, { projection: { _id: 0 } })
    .sort({ published_at: -1 })
    .toArray()

  const getBatchName = (batchId: string) => batches.find(b => b.id === batchId)?.batch_name || 'Unknown'
  const getCreatorName = (userId: string) => users.find(u => u.id === userId)?.full_name || 'Unknown'

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <HODLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Published Timetables</h1>
            <p className="mt-1 text-slate-600">History of published timetables in your department</p>
          </div>
          <Link href="/hod/timetable">
            <Button className="gap-2">
              <Eye className="h-4 w-4" />
              View Current Grid
            </Button>
          </Link>
        </div>

        {drafts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Send className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-600">No timetables published yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {drafts.map((draft: any) => (
              <Card key={draft.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{draft.name}</CardTitle>
                    <Badge className="bg-blue-100 text-blue-700">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Published
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

                  <div className="flex flex-col gap-2 pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          Published on {formatDate(draft.published_at)}
                        </span>
                        <Link href={`/hod/approvals/${draft.id}`}>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="h-4 w-4" />
                            Details
                          </Button>
                        </Link>
                      </div>
                      <div className="flex gap-2">
                        <form action={async () => {
                          'use server'
                          await unpublishTimetable(draft.id, user.id)
                        }} className="flex-1">
                          <Button type="submit" variant="outline" size="sm" className="w-full gap-1 text-amber-600 border-amber-200 hover:bg-amber-50">
                            <Undo2 className="h-4 w-4" />
                            Unpublish & Edit
                          </Button>
                        </form>
                        <form action={async () => {
                          'use server'
                          await deleteApprovedTimetable(draft.id, user.id)
                        }} className="flex-1">
                          <Button type="submit" variant="outline" size="sm" className="w-full gap-1 text-red-600 border-red-200 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </form>
                      </div>
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
