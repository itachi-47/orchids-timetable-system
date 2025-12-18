'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock } from 'lucide-react'
import type { TimetableEntry, DayOfWeek, TimeSlot } from '@/lib/timetable/types'

interface FacultyScheduleProps {
  entries: TimetableEntry[]
  facultyName?: string
}

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

export function FacultySchedule({ entries, facultyName }: FacultyScheduleProps) {
  const entriesIndex = new Map<string, TimetableEntry>()
  for (const e of entries) {
    entriesIndex.set(`${e.day_of_week}__${e.time_slot}`, e)
  }

  const totalHours = entries.filter(e => !e.is_lunch_break).length

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-slate-600">No classes scheduled</p>
          <p className="text-sm text-slate-500">
            {facultyName 
              ? 'You have no classes assigned in the current timetable'
              : 'Your faculty profile is not linked. Contact admin.'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Clock className="h-5 w-5 text-blue-600" />
        <div>
          <p className="font-medium text-blue-900">Weekly Workload</p>
          <p className="text-sm text-blue-700">{totalHours} hours per week</p>
        </div>
      </div>

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
                const key = `${day}-${timeSlot}`

                if (entry?.is_lunch_break) {
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-center rounded-lg border border-slate-300 bg-slate-200 p-3"
                    >
                      <span className="text-sm font-medium text-slate-600">Lunch Break</span>
                    </div>
                  )
                }

                if (entry) {
                  return (
                    <div
                      key={key}
                      className="rounded-lg border border-blue-200 bg-blue-50 p-3 shadow-sm"
                    >
                      <div className="text-xs font-semibold text-blue-700">{entry.subject?.subject_code}</div>
                      <div className="mt-1 text-xs text-slate-700">{entry.subject?.subject_name}</div>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                        <span>{entry.batch?.batch_name}</span>
                        <span>{entry.room?.room_number}</span>
                      </div>
                    </div>
                  )
                }

                return (
                  <div
                    key={key}
                    className="rounded-lg border border-slate-200 bg-white p-3"
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
