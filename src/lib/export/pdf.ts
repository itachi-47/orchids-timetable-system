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

const CATEGORY_LEGEND: Record<string, string> = {
  'BSC': 'Basic Science Course',
  'DC': 'Departmental Core',
  'DLC': 'Departmental Lab Course',
  'PBL': 'Project Based Learning',
  'MAC': 'Mandatory Audit Course',
  'SP': 'Semester Proficiency',
  'SLP': 'Self Learning/Presentation',
  'OE': 'Open Elective',
  'DE': 'Departmental Elective',
  'HSMC': 'Humanities & Social Science',
}

export interface OfficialTimetableOptions {
  instituteName?: string
  departmentName?: string
  programName?: string
  semester?: string
  session?: string
  effectiveDate?: string
  coordinatorName?: string
  hodName?: string
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
  
  const instituteName = options?.instituteName || 'Madhav Institute of Technology & Science, Gwalior'
  const departmentName = options?.departmentName || 'Department of Computer Science & Engineering'
  const programName = options?.programName || batchName
  const semester = options?.semester || ''
  const session = options?.session || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1).toString().slice(-2)
  const effectiveDate = options?.effectiveDate || formatDate(new Date())
  const coordinatorName = options?.coordinatorName || 'Time Table Coordinator'
  const hodName = options?.hodName || 'Head of Department'

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(instituteName, 148, 10, { align: 'center' })
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(departmentName, 148, 16, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  const titleText = semester ? `${programName} - ${semester}` : programName
  doc.text(titleText, 148, 23, { align: 'center' })
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Session: ${session}`, 148, 29, { align: 'center' })
  
  doc.setFontSize(9)
  doc.text(`Time Table w.e.f. ${effectiveDate}`, 148, 34, { align: 'center' })
  
  const tableData: string[][] = []
  
  TIME_SLOTS.forEach(timeSlot => {
    const row: string[] = [timeSlot]
    
    DAYS.forEach(day => {
      const entry = entries.find(
        e => e.day_of_week === day && e.time_slot === timeSlot
      )
      
      if (entry?.is_lunch_break) {
        row.push('LUNCH\nBREAK')
      } else if (entry) {
        const cellValue = `${entry.subject?.subject_code || ''}\n${entry.faculty?.short_code || ''}\n${entry.room?.room_number || ''}`
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
    startY: 38,
    theme: 'grid',
    styles: {
      lineColor: [0, 0, 0],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 2
    },
    bodyStyles: {
      fontSize: 7,
      cellPadding: 2,
      valign: 'middle',
      halign: 'center',
      minCellHeight: 12
    },
    columnStyles: {
      0: { cellWidth: 22, fontStyle: 'bold', fontSize: 8 }
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.cell.raw === 'LUNCH\nBREAK') {
        data.cell.styles.fillColor = [241, 196, 15]
        data.cell.styles.textColor = [0, 0, 0]
        data.cell.styles.fontStyle = 'bold'
      }
    }
  })
  
  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 130
  
  const subjectList = getUniqueSubjectsFromEntries(entries)
  
  if (subjectList.length > 0) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Subject Details', 15, finalY + 8)
    
    const subjectTableData = subjectList.map((item, index) => [
      (index + 1).toString(),
      item.subject_code,
      item.subject_name,
      item.category || '-',
      item.faculty_codes.join(', ') || '-',
    ])
    
    autoTable(doc, {
      head: [['S.No', 'Code', 'Subject Name', 'Category', 'Faculty']],
      body: subjectTableData,
      startY: finalY + 12,
      theme: 'grid',
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.2,
        fontSize: 7,
      },
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        cellPadding: 1.5,
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 70 },
        3: { cellWidth: 20, halign: 'center' },
        4: { cellWidth: 40 },
      }
    })
  }
  
  const subjectFinalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || finalY + 40
  
  const categories = [...new Set(subjectList.map(s => s.category).filter(Boolean))]
  if (categories.length > 0) {
    const legendY = subjectFinalY + 6
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    const legendText = categories.map(cat => `${cat}: ${CATEGORY_LEGEND[cat] || cat}`).join('  |  ')
    doc.text(legendText, 15, legendY)
  }
  
  const signatureY = 190
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  
  doc.line(30, signatureY, 80, signatureY)
  doc.text(coordinatorName, 55, signatureY + 5, { align: 'center' })
  doc.text('(Time Table Coordinator)', 55, signatureY + 9, { align: 'center' })
  
  doc.line(210, signatureY, 260, signatureY)
  doc.text(hodName, 235, signatureY + 5, { align: 'center' })
  doc.text('(Head of Department)', 235, signatureY + 9, { align: 'center' })
  
  doc.save(`${batchName}_Timetable.pdf`)
}

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

interface SubjectInfo {
  subject_code: string
  subject_name: string
  category: string
  faculty_codes: string[]
}

function getUniqueSubjectsFromEntries(entries: TimetableEntry[]): SubjectInfo[] {
  const subjectMap = new Map<string, SubjectInfo>()
  
  entries.forEach(entry => {
    if (entry.subject && !entry.is_lunch_break) {
      const key = entry.subject.id
      if (!subjectMap.has(key)) {
        subjectMap.set(key, {
          subject_code: entry.subject.subject_code,
          subject_name: entry.subject.subject_name,
          category: entry.subject.category || '',
          faculty_codes: []
        })
      }
      if (entry.faculty?.short_code) {
        const info = subjectMap.get(key)!
        if (!info.faculty_codes.includes(entry.faculty.short_code)) {
          info.faculty_codes.push(entry.faculty.short_code)
        }
      }
    }
  })
  
  return Array.from(subjectMap.values()).sort((a, b) => 
    a.subject_code.localeCompare(b.subject_code)
  )
}

export function exportAllTimetablesToPDF(
  timetablesByBatch: { batchName: string; entries: TimetableEntry[] }[],
  options?: OfficialTimetableOptions
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  })

  const instituteName = options?.instituteName || 'Madhav Institute of Technology & Science, Gwalior'
  const departmentName = options?.departmentName || 'Department of Computer Science & Engineering'
  const session = options?.session || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1).toString().slice(-2)
  const effectiveDate = options?.effectiveDate || formatDate(new Date())
  const coordinatorName = options?.coordinatorName || 'Time Table Coordinator'
  const hodName = options?.hodName || 'Head of Department'
  
  timetablesByBatch.forEach(({ batchName, entries }, index) => {
    if (index > 0) {
      doc.addPage()
    }
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(instituteName, 148, 10, { align: 'center' })
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(departmentName, 148, 16, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(batchName, 148, 23, { align: 'center' })
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Session: ${session}`, 148, 29, { align: 'center' })
    
    doc.setFontSize(9)
    doc.text(`Time Table w.e.f. ${effectiveDate}`, 148, 34, { align: 'center' })
    
    const tableData: string[][] = []
    
    TIME_SLOTS.forEach(timeSlot => {
      const row: string[] = [timeSlot]
      
      DAYS.forEach(day => {
        const entry = entries.find(
          e => e.day_of_week === day && e.time_slot === timeSlot
        )
        
        if (entry?.is_lunch_break) {
          row.push('LUNCH\nBREAK')
        } else if (entry) {
          const cellValue = `${entry.subject?.subject_code || ''}\n${entry.faculty?.short_code || ''}\n${entry.room?.room_number || ''}`
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
      startY: 38,
      theme: 'grid',
      styles: {
        lineColor: [0, 0, 0],
        lineWidth: 0.3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 2
      },
      bodyStyles: {
        fontSize: 7,
        cellPadding: 2,
        valign: 'middle',
        halign: 'center',
        minCellHeight: 12
      },
      columnStyles: {
        0: { cellWidth: 22, fontStyle: 'bold', fontSize: 8 }
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.cell.raw === 'LUNCH\nBREAK') {
          data.cell.styles.fillColor = [241, 196, 15]
          data.cell.styles.textColor = [0, 0, 0]
          data.cell.styles.fontStyle = 'bold'
        }
      }
    })
    
    const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY || 130
    
    const subjectList = getUniqueSubjectsFromEntries(entries)
    
    if (subjectList.length > 0) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('Subject Details', 15, finalY + 8)
      
      const subjectTableData = subjectList.map((item, index) => [
        (index + 1).toString(),
        item.subject_code,
        item.subject_name,
        item.category || '-',
        item.faculty_codes.join(', ') || '-',
      ])
      
      autoTable(doc, {
        head: [['S.No', 'Code', 'Subject Name', 'Category', 'Faculty']],
        body: subjectTableData,
        startY: finalY + 12,
        theme: 'grid',
        styles: {
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
          fontSize: 7,
        },
        headStyles: {
          fillColor: [52, 73, 94],
          textColor: [255, 255, 255],
          fontSize: 8,
          fontStyle: 'bold',
          halign: 'center'
        },
        bodyStyles: {
          cellPadding: 1.5,
        },
        columnStyles: {
          0: { cellWidth: 12, halign: 'center' },
          1: { cellWidth: 25, halign: 'center' },
          2: { cellWidth: 70 },
          3: { cellWidth: 20, halign: 'center' },
          4: { cellWidth: 40 },
        }
      })
    }
    
    const signatureY = 190
    
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    
    doc.line(30, signatureY, 80, signatureY)
    doc.text(coordinatorName, 55, signatureY + 5, { align: 'center' })
    doc.text('(Time Table Coordinator)', 55, signatureY + 9, { align: 'center' })
    
    doc.line(210, signatureY, 260, signatureY)
    doc.text(hodName, 235, signatureY + 5, { align: 'center' })
    doc.text('(Head of Department)', 235, signatureY + 9, { align: 'center' })
  })
  
  doc.save('All_Timetables.pdf')
}
