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
        className="border-green-500/30 bg-green-500/10 text-green-300 hover:bg-green-500/20 hover:text-green-200"
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Export Excel
      </Button>
      <Button
        onClick={handlePDFExport}
        variant="outline"
        className="border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:text-red-200"
      >
        <FileDown className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
    </div>
  )
}
