import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { HODLayout } from '@/components/layout/hod-layout'
import { getTimetable } from '@/lib/timetable/actions'
import { getBatches } from '@/lib/batches/actions'
import { TimetableGrid } from '@/components/timetable/timetable-grid'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from 'lucide-react'

export default async function HODTimetablePage({
  searchParams,
}: {
  searchParams: Promise<{ batch?: string }>
}) {
  const user = await getCurrentUser()
  
  if (!user || (user.role !== 'hod' && user.role !== 'admin')) {
    redirect('/login')
  }

  const params = await searchParams
  const [timetable, batches] = await Promise.all([
    getTimetable(),
    getBatches(),
  ])

  const selectedBatchId = params.batch || batches[0]?.id
  const selectedBatch = batches.find(b => b.id === selectedBatchId)
  const filteredTimetable = selectedBatchId 
    ? timetable.filter(entry => entry.batch_id === selectedBatchId)
    : []

  return (
    <HODLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Department Timetable</h1>
            <p className="mt-1 text-slate-600">View currently published timetables for all batches</p>
          </div>
          
          {batches.length > 0 && (
            <div className="w-full sm:w-64">
               <div className="text-sm font-medium text-slate-700 mb-1">Select Batch</div>
               <div className="flex gap-2">
                {/* We use a simple link-based selection here to avoid complex state in RSC */}
                <div className="grid grid-cols-1 w-full">
                  <select 
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
                    defaultValue={selectedBatchId}
                    onChange={(e) => {
                      window.location.href = `/hod/timetable?batch=${e.target.value}`
                    }}
                  >
                    {batches.map(batch => (
                      <option key={batch.id} value={batch.id}>
                        {batch.batch_name}
                      </option>
                    ))}
                  </select>
                </div>
               </div>
            </div>
          )}
        </div>

        {batches.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 text-slate-600">No batches available</p>
            </CardContent>
          </Card>
        ) : filteredTimetable.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-4 text-slate-600">No timetable available for this batch</p>
              <p className="text-sm text-slate-500">Approve and publish a draft to see it here</p>
            </CardContent>
          </Card>
        ) : (
          <TimetableGrid 
            entries={filteredTimetable} 
            batchName={selectedBatch?.batch_name}
            editable={false}
          />
        )}
      </div>
    </HODLayout>
  )
}
