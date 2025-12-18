'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Clock, CheckCircle, XCircle, Send, Eye, Trash2, AlertCircle } from 'lucide-react'
import type { TimetableDraft, TimetableStatus, Batch } from '@/types'
import type { UserProfile } from '@/lib/auth/actions'
import { submitDraftForApproval, deleteDraft } from '@/lib/timetable-drafts/actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface DraftsListProps {
  drafts: TimetableDraft[]
  batches: Batch[]
  currentUser: UserProfile
}

const statusConfig: Record<TimetableStatus, { icon: React.ElementType; label: string; className: string }> = {
  DRAFT: { icon: FileText, label: 'Draft', className: 'bg-slate-100 text-slate-700' },
  SUBMITTED: { icon: Clock, label: 'Submitted', className: 'bg-amber-100 text-amber-700' },
  APPROVED: { icon: CheckCircle, label: 'Approved', className: 'bg-emerald-100 text-emerald-700' },
  REJECTED: { icon: XCircle, label: 'Rejected', className: 'bg-red-100 text-red-700' },
}

export function DraftsList({ drafts, batches, currentUser }: DraftsListProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const getBatchName = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId)
    return batch?.batch_name || 'Unknown Batch'
  }

  const handleSubmit = async (draftId: string) => {
    if (!confirm('Submit this timetable for HOD approval?')) return
    setLoading(draftId)
    try {
      await submitDraftForApproval(draftId, currentUser.id)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to submit')
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (draftId: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return
    setLoading(draftId)
    try {
      await deleteDraft(draftId)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setLoading(null)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (drafts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-slate-600">No drafts yet</p>
          <p className="text-sm text-slate-500">Generate a timetable to get started</p>
          <Link href="/coordinator/timetable/generate">
            <Button className="mt-4">Generate Timetable</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {drafts.map((draft) => {
        const config = statusConfig[draft.status]
        const StatusIcon = config.icon
        const canSubmit = draft.status === 'DRAFT' || draft.status === 'REJECTED'
        const canDelete = draft.status !== 'APPROVED'

        return (
          <Card key={draft.id} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${
              draft.status === 'APPROVED' ? 'bg-gradient-to-b from-emerald-500 to-emerald-600' :
              draft.status === 'REJECTED' ? 'bg-gradient-to-b from-red-500 to-red-600' :
              draft.status === 'SUBMITTED' ? 'bg-gradient-to-b from-amber-500 to-amber-600' :
              'bg-gradient-to-b from-slate-400 to-slate-500'
            }`} />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg truncate">{draft.name}</CardTitle>
                <Badge className={config.className}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {config.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-1">
                <p className="text-slate-600">
                  <span className="font-medium">Batch:</span> {getBatchName(draft.batch_id)}
                </p>
                <p className="text-slate-600">
                  <span className="font-medium">Semester:</span> {draft.semester}
                </p>
                <p className="text-slate-600">
                  <span className="font-medium">Session:</span> {draft.session}
                </p>
                <p className="text-xs text-slate-500">
                  Created: {formatDate(draft.created_at)}
                </p>
              </div>

              {draft.status === 'REJECTED' && draft.rejection_reason && (
                <div className="p-2 rounded bg-red-50 text-red-700 text-sm flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{draft.rejection_reason}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2 border-t">
                <Link href={`/coordinator/drafts/${draft.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </Link>
                {canSubmit && (
                  <Button
                    size="sm"
                    className="gap-1"
                    onClick={() => handleSubmit(draft.id)}
                    disabled={loading === draft.id}
                  >
                    <Send className="h-4 w-4" />
                    Submit
                  </Button>
                )}
                {canDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(draft.id)}
                    disabled={loading === draft.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
