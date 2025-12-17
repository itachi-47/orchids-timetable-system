'use client'

import { TimetableEntry } from '@/lib/timetable/types'
import { ExportButtons } from './export-buttons'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIME_SLOTS = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00'
]

interface TimetableGridProps {
  entries: TimetableEntry[]
  batchName?: string
}

export function TimetableGrid({ entries, batchName }: TimetableGridProps) {
  const getEntryForSlot = (day: string, timeSlot: string) => {
    return entries.find(
      entry => entry.day_of_week === day && entry.time_slot === timeSlot
    )
  }

  return (
    <div className="space-y-4">
      {batchName && (
        <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 p-4 backdrop-blur">
          <div className="flex items-center justify-between">
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
                const entry = getEntryForSlot(day, timeSlot)

                if (entry?.is_lunch_break) {
                  return (
                    <div
                      key={`${day}-${timeSlot}`}
                      className="flex items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/10 p-3"
                    >
                      <span className="text-sm font-medium text-orange-300">
                        Lunch Break
                      </span>
                    </div>
                  )
                }

                if (entry) {
                  return (
                    <div
                      key={`${day}-${timeSlot}`}
                      className="rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-slate-800/50 p-3 backdrop-blur transition-all hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/20"
                    >
                      <div className="text-xs font-bold text-purple-300">
                        {entry.subject?.subject_code}
                      </div>
                      <div className="mt-1 text-xs text-slate-300">
                        {entry.subject?.subject_name}
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                        <span>{entry.faculty?.short_code}</span>
                        <span>{entry.room?.room_number}</span>
                      </div>
                    </div>
                  )
                }

                return (
                  <div
                    key={`${day}-${timeSlot}`}
                    className="rounded-lg border border-slate-700 bg-slate-800/50 p-3"
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
