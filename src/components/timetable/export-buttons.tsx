'use client'

import { Button } from '@/components/ui/button'
import { FileDown, FileSpreadsheet, Calendar as CalendarIcon } from 'lucide-react'
import { TimetableEntry } from '@/lib/timetable/types'
import type { OfficialTimetableOptions } from '@/lib/export/pdf'

interface ExportButtonsProps {
  entries: TimetableEntry[]
  batchName: string
  variant?: 'single' | 'all'
  allTimetables?: { batchName: string; entries: TimetableEntry[] }[]
  pdfOptions?: OfficialTimetableOptions
}

export function ExportButtons({ entries, batchName, variant = 'single', allTimetables, pdfOptions }: ExportButtonsProps) {
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
      exportAllTimetablesToPDF(allTimetables, pdfOptions)
    } else {
      exportTimetableToPDF(entries, batchName, pdfOptions)
    }
  }

  const handleICSExport = async () => {
    const { exportTimetableToICS } = await import('@/lib/export/calendar')
    exportTimetableToICS(entries, batchName)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={handleExcelExport}
        variant="outline"
        size="sm"
        className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Excel
      </Button>
      <Button
        onClick={handlePDFExport}
        variant="outline"
        size="sm"
        className="border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/30"
      >
        <FileDown className="mr-2 h-4 w-4" />
        PDF
      </Button>
      {variant === 'single' && (
        <Button
          onClick={handleICSExport}
          variant="outline"
          size="sm"
          className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          Add to Calendar
        </Button>
      )}
    </div>
  )
}
