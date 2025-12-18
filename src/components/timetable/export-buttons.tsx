'use client'

import { Button } from '@/components/ui/button'
import { FileDown, FileSpreadsheet } from 'lucide-react'
import { TimetableEntry } from '@/lib/timetable/types'

interface ExportButtonsProps {
  entries: TimetableEntry[]
  batchName: string
  variant?: 'single' | 'all'
  allTimetables?: { batchName: string; entries: TimetableEntry[] }[]
}

export function ExportButtons({ entries, batchName, variant = 'single', allTimetables }: ExportButtonsProps) {
  const handleExcelExport = async () => {
    const { exportTimetableToExcel, exportAllTimetablesToExcel } = await import('@/lib/export/excel')
    
    if (variant === 'all' && allTimetables) {
      exportAllTimetablesToExcel(allTimetables)
    } else {
      exportTimetableToExcel(entries, batchName)
    }
  }

  const handlePDFExport = async () => {
    const { exportTimetableToPDF, exportAllTimetablesToPDF } = await import('@/lib/export/pdf')
    
    if (variant === 'all' && allTimetables) {
      exportAllTimetablesToPDF(allTimetables)
    } else {
      exportTimetableToPDF(entries, batchName)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleExcelExport}
        variant="outline"
        className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Export Excel
      </Button>
      <Button
        onClick={handlePDFExport}
        variant="outline"
        className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
      >
        <FileDown className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
    </div>
  )
}
