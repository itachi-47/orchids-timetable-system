import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
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

export function exportTimetableToPDF(entries: TimetableEntry[], batchName: string) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })
  
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(`${batchName} - Timetable`, 148, 15, { align: 'center' })
  
  const tableData: any[][] = []
  
  TIME_SLOTS.forEach(timeSlot => {
    const row: any[] = [timeSlot]
    
    DAYS.forEach(day => {
      const entry = entries.find(
        e => e.day_of_week === day && e.time_slot === timeSlot
      )
      
      if (entry?.is_lunch_break) {
        row.push('LUNCH\nBREAK')
      } else if (entry) {
        const cellValue = `${entry.subject?.subject_code || ''}\n${entry.subject?.subject_name || ''}\n${entry.faculty?.short_code || ''} | ${entry.room?.room_number || ''}`
        row.push(cellValue)
      } else {
        row.push('')
      }
    })
    
    tableData.push(row)
  })
  
  autoTable(doc, {
    head: [['Time', ...DAYS]],
    body: tableData,
    startY: 25,
    theme: 'grid',
    headStyles: {
      fillColor: [126, 58, 242],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 8,
      cellPadding: 3,
      valign: 'middle',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 25, fontStyle: 'bold' }
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.cell.raw === 'LUNCH\nBREAK') {
        data.cell.styles.fillColor = [251, 146, 60]
        data.cell.styles.textColor = [255, 255, 255]
        data.cell.styles.fontStyle = 'bold'
      }
    }
  })
  
  doc.save(`${batchName}_Timetable.pdf`)
}

export function exportAllTimetablesToPDF(timetablesByBatch: { batchName: string; entries: TimetableEntry[] }[]) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })
  
  timetablesByBatch.forEach(({ batchName, entries }, index) => {
    if (index > 0) {
      doc.addPage()
    }
    
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text(`${batchName} - Timetable`, 148, 15, { align: 'center' })
    
    const tableData: any[][] = []
    
    TIME_SLOTS.forEach(timeSlot => {
      const row: any[] = [timeSlot]
      
      DAYS.forEach(day => {
        const entry = entries.find(
          e => e.day_of_week === day && e.time_slot === timeSlot
        )
        
        if (entry?.is_lunch_break) {
          row.push('LUNCH\nBREAK')
        } else if (entry) {
          const cellValue = `${entry.subject?.subject_code || ''}\n${entry.subject?.subject_name || ''}\n${entry.faculty?.short_code || ''} | ${entry.room?.room_number || ''}`
          row.push(cellValue)
        } else {
          row.push('')
        }
      })
      
      tableData.push(row)
    })
    
    autoTable(doc, {
      head: [['Time', ...DAYS]],
      body: tableData,
      startY: 25,
      theme: 'grid',
      headStyles: {
        fillColor: [126, 58, 242],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3,
        valign: 'middle',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 25, fontStyle: 'bold' }
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.cell.raw === 'LUNCH\nBREAK') {
          data.cell.styles.fillColor = [251, 146, 60]
          data.cell.styles.textColor = [255, 255, 255]
          data.cell.styles.fontStyle = 'bold'
        }
      }
    })
  })
  
  doc.save('All_Timetables.pdf')
}
