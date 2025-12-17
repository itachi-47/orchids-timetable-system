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
          <div className="rounded-lg border border-blue-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xl font-semibold text-slate-900">{batchName}</h3>
              <ExportButtons entries={entries} batchName={batchName} />
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-7 gap-2">
              <div className="rounded-lg border border-slate-300 bg-blue-50 p-3 text-center font-semibold text-blue-700">
                Time
              </div>
              {DAYS.map(day => (
                <div
                  key={day}
                  className="rounded-lg border border-slate-300 bg-blue-50 p-3 text-center font-semibold text-blue-700"
                >
                  {day}
                </div>
              ))}
          </div>

            {TIME_SLOTS.map(timeSlot => (
              <div key={timeSlot} className="mt-2 grid grid-cols-7 gap-2">
                <div className="flex items-center justify-center rounded-lg border border-slate-300 bg-slate-100 p-3 text-center text-sm text-slate-700">
                  {timeSlot}
                </div>

                {DAYS.map(day => {
                  const entry = entriesIndex.get(`${day}__${timeSlot}`)

                  if (entry?.is_lunch_break) {
                    return (
                      <div
                        key={`${day}-${timeSlot}`}
                        className="flex items-center justify-center rounded-lg border border-slate-300 bg-slate-200 p-3"
                      >
                        <span className="text-sm font-medium text-slate-600">Lunch Break</span>
                      </div>
                    )
                  }

                  const key = `${day}-${timeSlot}`

                  if (entry) {
                    const className =
                      'rounded-lg border border-blue-200 bg-white p-3 shadow-sm transition-all hover:border-blue-400 hover:shadow-md'

                    return canEdit ? (
                      <button
                        key={key}
                        type="button"
                        onClick={() => openEditor(day, timeSlot)}
                        className={`${className} text-left`}
                      >
                        <div className="text-xs font-semibold text-blue-700">{entry.subject?.subject_code}</div>
                        <div className="mt-1 text-xs text-slate-700">{entry.subject?.subject_name}</div>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                          <span>{entry.faculty?.short_code}</span>
                          <span>{entry.room?.room_number}</span>
                        </div>
                      </button>
                    ) : (
                      <div key={key} className={className}>
                        <div className="text-xs font-semibold text-blue-700">{entry.subject?.subject_code}</div>
                        <div className="mt-1 text-xs text-slate-700">{entry.subject?.subject_name}</div>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                          <span>{entry.faculty?.short_code}</span>
                          <span>{entry.room?.room_number}</span>
                        </div>
                      </div>
                    )
                  }

                  const emptyClass =
                    'rounded-lg border border-slate-300 bg-white p-3 transition-colors hover:border-slate-400'

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
