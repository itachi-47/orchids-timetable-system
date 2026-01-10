import { TimetableEntry } from '@/lib/timetable/types'

const DAYS_MAP: Record<string, number> = {
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6,
  'Sunday': 0,
}

const DAYS_ICS_MAP: Record<string, string> = {
  'Monday': 'MO',
  'Tuesday': 'TU',
  'Wednesday': 'WE',
  'Thursday': 'TH',
  'Friday': 'FR',
  'Saturday': 'SA',
  'Sunday': 'SU',
}

export function exportTimetableToICS(entries: TimetableEntry[], batchName: string) {
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SATS//Timetable//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ]

  // Get next occurrence of a day
  const getNextDayDate = (dayName: string) => {
    const today = new Date()
    const targetDay = DAYS_MAP[dayName]
    const currentDay = today.getDay()
    let diff = targetDay - currentDay
    if (diff <= 0) diff += 7
    const nextDate = new Date(today)
    nextDate.setDate(today.getDate() + diff)
    return nextDate
  }

  entries.forEach(entry => {
    if (entry.is_lunch_break) return

    const [startTime, endTime] = entry.time_slot.split('-')
    const [startH, startM] = startTime.split(':')
    const [endH, endM] = endTime.split(':')

    const date = getNextDayDate(entry.day_of_week)
    
    const formatDate = (d: Date, h: string, m: string) => {
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}${month}${day}T${h}${m}00`
    }

    const dtStart = formatDate(date, startH, startM)
    const dtEnd = formatDate(date, endH, endM)

    icsContent.push('BEGIN:VEVENT')
    icsContent.push(`SUMMARY:${entry.subject?.subject_name} (${entry.subject?.subject_code})`)
    icsContent.push(`DESCRIPTION:Faculty: ${entry.faculty?.full_name}\\nRoom: ${entry.room?.room_name}`)
    icsContent.push(`LOCATION:${entry.room?.room_name}`)
    icsContent.push(`DTSTART:${dtStart}`)
    icsContent.push(`DTEND:${dtEnd}`)
    icsContent.push(`RRULE:FREQ=WEEKLY;BYDAY=${DAYS_ICS_MAP[entry.day_of_week]}`)
    icsContent.push('END:VEVENT')
  })

  icsContent.push('END:VCALENDAR')

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const link = document.createElement('a')
  link.href = window.URL.createObjectURL(blob)
  link.setAttribute('download', `Timetable_${batchName.replace(/\s+/g, '_')}.ics`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
