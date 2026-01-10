'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Department } from '@/types'
import { Batch } from '@/lib/batches/actions'

interface BranchBatchSelectorProps {
  departments: Department[]
  batches: Batch[]
  selectedBranchId: string
  selectedYear: string
  selectedSem: string
  selectedBatchId: string
  basePath: string
}

export function BranchBatchSelector({
  departments,
  batches,
  selectedBranchId,
  selectedYear,
  selectedSem,
  selectedBatchId,
  basePath,
}: BranchBatchSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const filteredByBranch = selectedBranchId
    ? batches.filter((b) => b.department_id === selectedBranchId)
    : batches

  const filteredByYear = selectedYear
    ? filteredByBranch.filter((b) => b.year === selectedYear)
    : filteredByBranch

  const filteredBySem = selectedSem
    ? filteredByYear.filter((b) => b.semester === selectedSem)
    : filteredByYear

  const handleBranchChange = (branchId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('branch', branchId)
    params.delete('year')
    params.delete('sem')
    params.delete('batch')
    router.push(`${basePath}?${params.toString()}`)
  }

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('year', year)
    params.delete('sem')
    params.delete('batch')
    router.push(`${basePath}?${params.toString()}`)
  }

  const handleSemChange = (sem: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sem', sem)
    params.delete('batch')
    router.push(`${basePath}?${params.toString()}`)
  }

  const handleBatchChange = (batchId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('batch', batchId)
    router.push(`${basePath}?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="w-full sm:w-64">
        <label htmlFor="branch-select" className="sr-only">Select Branch</label>
        <select
          id="branch-select"
          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={selectedBranchId}
          onChange={(e) => handleBranchChange(e.target.value)}
        >
          <option value="">Select Branch</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-40">
        <label htmlFor="year-select" className="sr-only">Select Year</label>
        <select
          id="year-select"
          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
          value={selectedYear}
          onChange={(e) => handleYearChange(e.target.value)}
          disabled={!selectedBranchId}
        >
          <option value="">Select Year</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
        </select>
      </div>

      <div className="w-full sm:w-40">
        <label htmlFor="sem-select" className="sr-only">Select Sem</label>
        <select
          id="sem-select"
          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
          value={selectedSem}
          onChange={(e) => handleSemChange(e.target.value)}
          disabled={!selectedYear}
        >
          <option value="">Select Sem</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
            <option key={s} value={s.toString()}>Semester {s}</option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-40">
        <label htmlFor="batch-select" className="sr-only">Select Batch</label>
        <select
          id="batch-select"
          className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
          value={selectedBatchId}
          onChange={(e) => handleBatchChange(e.target.value)}
          disabled={!selectedSem}
        >
          <option value="">Select Batch</option>
          {filteredBySem.map((batch) => (
            <option key={batch.id} value={batch.id}>
              {batch.batch_name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
