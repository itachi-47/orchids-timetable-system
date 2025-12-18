'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Clock, CheckCircle, XCircle, Eye, Calendar, User } from 'lucide-react'
import type { TimetableDraft, Batch } from '@/types'
import type { UserData } from '@/lib/users/actions'
import type { UserProfile } from '@/lib/auth/actions'
import { approveTimetable, rejectTimetable } from '@/lib/timetable-drafts/actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PendingApprovalsListProps {
  drafts: TimetableDraft[]
  batches: Batch[]
  users: UserData[]
  currentUser: UserProfile
}

export function PendingApprovalsList({ drafts, batches, users, currentUser }: PendingApprovalsListProps) {
  const router = useRouter()
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedDraft, setSelectedDraft] = useState<TimetableDraft | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [loading, setLoading] = useState(false)

  const getBatchName = (batchId: string) => {
    const batch = batches.find(b => b.id === batchId)
    return batch?.batch_name || 'Unknown Batch'
  }

  const getCreatorName = (userId: string) => {
    const user = users.find(u => u.id === userId)
    return user?.full_name || 'Unknown'
  }

  const handleApprove = async (draftId: string) => {
    if (!confirm('Are you sure you want to approve this timetable?')) return
    setLoading(true)
    try {
      await approveTimetable(draftId, currentUser.id)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve')
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedDraft || !rejectionReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }
    setLoading(true)
    try {
      await rejectTimetable(selectedDraft.id, currentUser.id, rejectionReason)
      setRejectDialogOpen(false)
      setSelectedDraft(null)
      setRejectionReason('')
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reject')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (drafts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-emerald-400" />
          <p className="mt-4 text-slate-600">No pending approvals</p>
          <p className="text-sm text-slate-500">All submitted timetables have been reviewed</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {drafts.map((draft) => (
          <Card key={draft.id} className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-orange-500" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{draft.name}</CardTitle>
                <Badge className="bg-amber-100 text-amber-700">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="h-4 w-4" />
                  <span>{getBatchName(draft.batch_id)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="font-medium">Semester:</span>
                  <span>{draft.semester}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="h-4 w-4" />
                  <span>{getCreatorName(draft.created_by)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="font-medium">Session:</span>
                  <span>{draft.session}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Submitted: {formatDate(draft.submitted_at)}
              </p>

              <div className="flex gap-2 pt-2 border-t">
                <Link href={`/hod/approvals/${draft.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    <Eye className="h-4 w-4" />
                    Review
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleApprove(draft.id)}
                  disabled={loading}
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    setSelectedDraft(draft)
                    setRejectDialogOpen(true)
                  }}
                  disabled={loading}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Timetable</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Please provide a reason for rejecting this timetable. The coordinator will be able to see this feedback.
            </p>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Rejection</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Faculty clash on Tuesday, Room conflict..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={loading || !rejectionReason.trim()}
            >
              {loading ? 'Rejecting...' : 'Reject Timetable'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
