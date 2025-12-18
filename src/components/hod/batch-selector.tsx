'use client'

import { useRouter } from 'next/navigation'

interface Batch {
  id: string
  batch_name: string
}

interface BatchSelectorProps {
  batches: Batch[]
  selectedBatchId: string
  basePath?: string
}

export function BatchSelector({ batches, selectedBatchId, basePath = '/hod/timetable' }: BatchSelectorProps) {
  const router = useRouter()

  return (
    <select
      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
      value={selectedBatchId}
      onChange={(e) => {
        router.push(`${basePath}?batch=${e.target.value}`)
      }}
    >
      {batches.map((batch) => (
        <option key={batch.id} value={batch.id}>
          {batch.batch_name}
        </option>
      ))}
    </select>
  )
}
