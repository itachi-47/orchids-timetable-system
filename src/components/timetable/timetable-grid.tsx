'use client'

import { useMemo, useState } from 'react'
import type { DayOfWeek, Faculty, Room, Subject, TimeSlot, TimetableEntry } from '@/lib/timetable/types'
import { ExportButtons } from './export-buttons'
import { TimetableSlotEditor } from './timetable-slot-editor'

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIME_SLOTS: TimeSlot[] = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
]

interface TimetableGridProps {
  entries: TimetableEntry[]
  batchName?: string
  batchId?: string
  editable?: boolean
  subjects?: Subject[]
  faculty?: Faculty[]
  rooms?: Room[]
}

type SelectedSlot = {
  id?: string
  batchId: string
  batchName?: string
  dayOfWeek: DayOfWeek
  timeSlot: TimeSlot
  entry?: TimetableEntry | null
}

export function TimetableGrid({
  entries,
  batchName,
  batchId,
  editable,
  subjects,
  faculty,
  rooms,
}: TimetableGridProps) {
  const [editorOpen, setEditorOpen] = useState(false)
  const [selected, setSelected] = useState<SelectedSlot | null>(null)

  const canEdit = Boolean(editable && batchId && subjects?.length && faculty?.length && rooms?.length)

  const entriesIndex = useMemo(() => {
    const map = new Map<string, TimetableEntry>()
    for (const e of entries) {
      map.set(`${e.day_of_week}__${e.time_slot}`, e)
    }
    return map
  }, [entries])

  const openEditor = (day: DayOfWeek, timeSlot: TimeSlot) => {
    if (!canEdit || !batchId) return

    const entry = entriesIndex.get(`${day}__${timeSlot}`)

    if (entry?.is_lunch_break) return

    setSelected({
      id: entry?.id,
      batchId,
      batchName,
      dayOfWeek: day,
      timeSlot,
      entry: entry ?? null,
    })
    setEditorOpen(true)
  }

  return (
    <div className="space-y-4">
      {batchName && (
        <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-4 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-bold text-slate-50">{batchName}</h3>
            <ExportButtons entries={entries} batchName={batchName} />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-7 gap-2">
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-center font-semibold text-purple-400">
              Time
            </div>
            {DAYS.map(day => (
              <div
                key={day}
                className="rounded-lg border border-slate-700 bg-slate-800 p-3 text-center font-semibold text-purple-400"
              >
                {day}
              </div>
            ))}
          </div>

          {TIME_SLOTS.map(timeSlot => (
            <div key={timeSlot} className="mt-2 grid grid-cols-7 gap-2">
              <div className="flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 p-3 text-center text-sm text-slate-300">
                {timeSlot}
              </div>

              {DAYS.map(day => {
                const entry = entriesIndex.get(`${day}__${timeSlot}`)

                if (entry?.is_lunch_break) {
                  return (
                    <div
                      key={`${day}-${timeSlot}`}
                      className="flex items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/10 p-3"
                    >
                      <span className="text-sm font-medium text-orange-300">Lunch Break</span>
                    </div>
                  )
                }

                const key = `${day}-${timeSlot}`

                if (entry) {
                  const className =
                    'rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-slate-800/50 p-3 backdrop-blur transition-all hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20'

                  return canEdit ? (
                    <button
                      key={key}
                      type="button"
                      onClick={() => openEditor(day, timeSlot)}
                      className={`${className} text-left`}
                    >
                      <div className="text-xs font-bold text-purple-300">{entry.subject?.subject_code}</div>
                      <div className="mt-1 text-xs text-slate-300">{entry.subject?.subject_name}</div>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                        <span>{entry.faculty?.short_code}</span>
                        <span>{entry.room?.room_number}</span>
                      </div>
                    </button>
                  ) : (
                    <div key={key} className={className}>
                      <div className="text-xs font-bold text-purple-300">{entry.subject?.subject_code}</div>
                      <div className="mt-1 text-xs text-slate-300">{entry.subject?.subject_name}</div>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                        <span>{entry.faculty?.short_code}</span>
                        <span>{entry.room?.room_number}</span>
                      </div>
                    </div>
                  )
                }

                const emptyClass =
                  'rounded-lg border border-slate-700 bg-slate-800/50 p-3 transition-colors hover:border-slate-500'

                return canEdit ? (
                  <button
                    key={key}
                    type="button"
                    onClick={() => openEditor(day, timeSlot)}
                    className={`${emptyClass} cursor-pointer`}
                    aria-label={`Edit ${day} ${timeSlot}`}
                  />
                ) : (
                  <div key={key} className={emptyClass} />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {canEdit && subjects && faculty && rooms ? (
        <TimetableSlotEditor
          open={editorOpen}
          onOpenChange={setEditorOpen}
          slot={selected}
          subjects={subjects}
          faculty={faculty}
          rooms={rooms}
        />
      ) : null}
    </div>
  )
}
