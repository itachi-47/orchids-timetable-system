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

interface OfficialTimetableOptions {
  instituteName?: string
  departmentName?: string
  semester?: string
  session?: string
}

export function exportTimetableToPDF(
  entries: TimetableEntry[], 
  batchName: string,
  options?: OfficialTimetableOptions
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })
  
  const instituteName = options?.instituteName || 'Madhav Institute of Technology & Science'
  const departmentName = options?.departmentName || 'Department of Computer Science & Engineering'
  const semester = options?.semester || ''
  const session = options?.session || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(instituteName, 148, 12, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(departmentName, 148, 19, { align: 'center' })
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(`CLASS TIMETABLE - ${batchName}`, 148, 28, { align: 'center' })
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  const infoText = semester ? `Semester: ${semester} | Session: ${session}` : `Session: ${session}`
  doc.text(infoText, 148, 34, { align: 'center' })
  
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
    startY: 40,
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
