import * as XLSX from 'xlsx'
import { TimetableEntry } from '@/lib/timetable/types'

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

export function exportTimetableToExcel(entries: TimetableEntry[], batchName: string) {
  const data: any[][] = []
  
  const header = ['Time', ...DAYS]
  data.push(header)
  
  TIME_SLOTS.forEach(timeSlot => {
    const row: any[] = [timeSlot]
    
    DAYS.forEach(day => {
      const entry = entries.find(
        e => e.day_of_week === day && e.time_slot === timeSlot
      )
      
      if (entry?.is_lunch_break) {
        row.push('LUNCH BREAK')
      } else if (entry) {
        const cellValue = `${entry.subject?.subject_code || ''}\n${entry.subject?.subject_name || ''}\n${entry.faculty?.short_code || ''} | ${entry.room?.room_number || ''}`
        row.push(cellValue)
      } else {
        row.push('')
      }
    })
    
    data.push(row)
  })
  
  const worksheet = XLSX.utils.aoa_to_sheet(data)
  
  worksheet['!cols'] = [
    { wch: 15 },
    ...DAYS.map(() => ({ wch: 20 }))
  ]
  
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, batchName)
  
  XLSX.writeFile(workbook, `${batchName}_Timetable.xlsx`)
}

export function exportAllTimetablesToExcel(timetablesByBatch: { batchName: string; entries: TimetableEntry[] }[]) {
  const workbook = XLSX.utils.book_new()
  
  timetablesByBatch.forEach(({ batchName, entries }) => {
    const data: any[][] = []
    
    const header = ['Time', ...DAYS]
    data.push(header)
    
    TIME_SLOTS.forEach(timeSlot => {
      const row: any[] = [timeSlot]
      
      DAYS.forEach(day => {
        const entry = entries.find(
          e => e.day_of_week === day && e.time_slot === timeSlot
        )
        
        if (entry?.is_lunch_break) {
          row.push('LUNCH BREAK')
        } else if (entry) {
          const cellValue = `${entry.subject?.subject_code || ''}\n${entry.subject?.subject_name || ''}\n${entry.faculty?.short_code || ''} | ${entry.room?.room_number || ''}`
          row.push(cellValue)
        } else {
          row.push('')
        }
      })
      
      data.push(row)
    })
    
    const worksheet = XLSX.utils.aoa_to_sheet(data)
    
    worksheet['!cols'] = [
      { wch: 15 },
      ...DAYS.map(() => ({ wch: 20 }))
    ]
    
    XLSX.utils.book_append_sheet(workbook, worksheet, batchName)
  })
  
  XLSX.writeFile(workbook, 'All_Timetables.xlsx')
}
