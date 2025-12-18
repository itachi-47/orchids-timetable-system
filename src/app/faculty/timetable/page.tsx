import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { FacultyLayout } from '@/components/layout/faculty-layout'
import { getTimetable } from '@/lib/timetable/actions'
import { getBatches } from '@/lib/batches/actions'
import { TimetableGrid } from '@/components/timetable/timetable-grid'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from 'lucide-react'

export default async function FacultyTimetablePage({
  searchParams,
}: {
  searchParams: Promise<{ batch?: string }>
}) {
  const user = await getCurrentUser()
  
  if (!user || !['faculty', 'hod', 'timetable_coordinator', 'admin'].includes(user.role)) {
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
    <FacultyLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">View Timetable</h1>
            <p className="mt-1 text-slate-600">View approved timetables for all batches</p>
          </div>
          
          {batches.length > 0 && (
            <form className="w-full sm:w-64">
              <Select 
                name="batch" 
                defaultValue={selectedBatchId}
                onValueChange={(value) => {
                  window.location.href = `/faculty/timetable?batch=${value}`
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map(batch => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.batch_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </form>
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
              <p className="text-sm text-slate-500">Timetable will appear once published by HOD</p>
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
    </FacultyLayout>
  )
}
