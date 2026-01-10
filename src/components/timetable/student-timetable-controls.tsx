'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { Department } from '@/types'
import type { Batch } from '@/lib/batches/actions'
import { Label } from '@/components/ui/label'

interface StudentTimetableControlsProps {
  departments: Department[]
  batches: Batch[]
  selectedDeptId: string
  selectedSem: string
  selectedBatchId: string
}

export function StudentTimetableControls({
  departments,
  batches,
  selectedDeptId,
  selectedSem,
  selectedBatchId,
}: StudentTimetableControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    router.push(`/student/timetable?${params.toString()}`)
  }

  // Filter batches based on selected dept and sem
  const filteredBatches = batches.filter(batch => {
    const matchesDept = !selectedDeptId || batch.department_id === selectedDeptId
    const matchesSem = !selectedSem || batch.semester === selectedSem
    return matchesDept && matchesSem
  })

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="space-y-1.5">
        <Label htmlFor="branch-select" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Branch / Department
        </Label>
        <select
          id="branch-select"
          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          value={selectedDeptId}
          onChange={(e) => updateFilters({ dept: e.target.value, batch: '' })}
        >
          <option value="">All Branches</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="sem-select" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Semester
        </Label>
        <select
          id="sem-select"
          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          value={selectedSem}
          onChange={(e) => updateFilters({ sem: e.target.value, batch: '' })}
        >
          <option value="">All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <option key={s} value={s.toString()}>
              Semester {s}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="batch-select" className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Batch / Section
        </Label>
        <select
          id="batch-select"
          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          value={selectedBatchId}
          onChange={(e) => updateFilters({ batch: e.target.value })}
        >
          <option value="">Select Batch</option>
          {filteredBatches.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.batch_name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
