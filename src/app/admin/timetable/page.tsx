import { getTimetable } from '@/lib/timetable/actions'
import { TimetableGrid } from '@/components/timetable/timetable-grid'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getBatches } from '@/lib/batches/actions'
import { getSubjects } from '@/lib/subjects/actions'
import { getFaculty } from '@/lib/faculty/actions'
import { getRooms } from '@/lib/rooms/actions'

export default async function TimetablePage() {
  const [batches, subjects, faculty, rooms, timetableData] = await Promise.all([
    getBatches(),
    getSubjects(),
    getFaculty(),
    getRooms(),
    getTimetable(),
  ])

  const groupedByBatch = (batches || []).map(batch => ({
    batch,
    entries: timetableData.filter(entry => entry.batch_id === batch.id),
  }))

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Timetable</h1>
              <p className="text-slate-600">View and edit timetables for all batches</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/admin/timetable/generate" className="w-full sm:w-auto">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto">
                <Calendar className="mr-2 h-4 w-4" />
                Generate New
              </Button>
            </Link>
          </div>
        </div>

        {groupedByBatch.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm">
            <p className="text-slate-600">No timetable generated yet</p>
            <Link href="/admin/timetable/generate">
              <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                <Calendar className="mr-2 h-4 w-4" />
                Generate Timetable
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedByBatch.map(({ batch, entries }) => (
              <TimetableGrid
                key={batch.id}
                entries={entries}
                batchName={batch.batch_name}
                batchId={batch.id}
                editable
                subjects={subjects ?? []}
                faculty={faculty ?? []}
                rooms={rooms ?? []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
