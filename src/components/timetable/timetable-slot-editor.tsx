'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { DayOfWeek, Faculty, Room, Subject, TimeSlot, TimetableEntry } from '@/lib/timetable/types'
import { checkTimetableConflicts, upsertTimetableSlot } from '@/lib/timetable/actions'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

type SlotRef = {
  id?: string
  batchId: string
  batchName?: string
  dayOfWeek: DayOfWeek
  timeSlot: TimeSlot
  entry?: TimetableEntry | null
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  slot: SlotRef | null
  subjects: Subject[]
  faculty: Faculty[]
  rooms: Room[]
}

export function TimetableSlotEditor({ open, onOpenChange, slot, subjects, faculty, rooms }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [subjectId, setSubjectId] = useState<string>('')
  const [facultyId, setFacultyId] = useState<string>('')
  const [roomId, setRoomId] = useState<string>('')
  const [conflictMessages, setConflictMessages] = useState<string[]>([])
  const [checkingConflicts, setCheckingConflicts] = useState(false)

  useEffect(() => {
    if (!open || !slot) return

    setSubjectId(slot.entry?.subject_id ?? '')
    setFacultyId(slot.entry?.faculty_id ?? '')
    setRoomId(slot.entry?.room_id ?? '')
    setConflictMessages([])
  }, [open, slot])

  const canCheckConflicts = useMemo(() => {
    if (!slot) return false
    return Boolean(subjectId && facultyId && roomId)
  }, [slot, subjectId, facultyId, roomId])

  useEffect(() => {
    if (!open || !slot) return

    if (!canCheckConflicts) {
      setConflictMessages([])
      return
    }

    const timer = setTimeout(() => {
      startTransition(async () => {
        setCheckingConflicts(true)
        try {
          const conflicts = await checkTimetableConflicts({
            slotId: slot.id,
            batchId: slot.batchId,
            dayOfWeek: slot.dayOfWeek,
            timeSlot: slot.timeSlot,
            facultyId,
            roomId,
          })
          setConflictMessages(conflicts.map(c => c.message))
        } catch {
          setConflictMessages(['Failed to check conflicts. Try again.'])
        } finally {
          setCheckingConflicts(false)
        }
      })
    }, 250)

    return () => clearTimeout(timer)
  }, [open, slot, canCheckConflicts, facultyId, roomId])

  const canSave = Boolean(slot && subjectId && facultyId && roomId && conflictMessages.length === 0)

  async function handleSave() {
    if (!slot) return

    startTransition(async () => {
      await upsertTimetableSlot({
        id: slot.id,
        batchId: slot.batchId,
        dayOfWeek: slot.dayOfWeek,
        timeSlot: slot.timeSlot,
        subjectId,
        facultyId,
        roomId,
      })
      onOpenChange(false)
      router.refresh()
    })
  }

  async function handleClear() {
    if (!slot) return

    startTransition(async () => {
      await upsertTimetableSlot({
        id: slot.id,
        batchId: slot.batchId,
        dayOfWeek: slot.dayOfWeek,
        timeSlot: slot.timeSlot,
        subjectId: null,
        facultyId: null,
        roomId: null,
      })
      onOpenChange(false)
      router.refresh()
    })
  }

  if (!slot) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit timetable slot</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm text-slate-400">
            <div>
              <span className="text-slate-200">Batch:</span> {slot.batchName ?? '—'}
            </div>
            <div>
              <span className="text-slate-200">When:</span> {slot.dayOfWeek} · {slot.timeSlot}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-200">Subject</Label>
            <Select value={subjectId} onValueChange={setSubjectId}>
              <SelectTrigger className="border-slate-600 bg-slate-900/40 text-slate-200">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(s => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.subject_code} — {s.subject_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-slate-200">Faculty</Label>
              <Select value={facultyId} onValueChange={setFacultyId}>
                <SelectTrigger className="border-slate-600 bg-slate-900/40 text-slate-200">
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent>
                  {faculty.map(f => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.short_code} — {f.faculty_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-200">Room</Label>
              <Select value={roomId} onValueChange={setRoomId}>
                <SelectTrigger className="border-slate-600 bg-slate-900/40 text-slate-200">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map(r => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.room_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {checkingConflicts ? (
            <p className="text-sm text-slate-400">Checking conflicts…</p>
          ) : conflictMessages.length > 0 ? (
            <Alert variant="destructive" className="border-red-500/30">
              <AlertTitle>Conflicts detected</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5">
                  {conflictMessages.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ) : null}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          {slot.entry?.id ? (
            <Button
              variant="destructive"
              onClick={handleClear}
              disabled={isPending}
              className="sm:mr-auto"
            >
              Clear slot
            </Button>
          ) : (
            <div className="sm:mr-auto" />
          )}

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="border-slate-600 text-slate-200 hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave || isPending} className="bg-purple-600 hover:bg-purple-700">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
