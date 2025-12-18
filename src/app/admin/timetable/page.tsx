import { getTimetable } from '@/lib/timetable/actions'
import { TimetableGrid } from '@/components/timetable/timetable-grid'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getBatches } from '@/lib/batches/actions'
import { getSubjects } from '@/lib/subjects/actions'
import { getFaculty } from '@/lib/faculty/actions'
import { getRooms } from '@/lib/rooms/actions'
import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'

export default async function TimetablePage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

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
    <AdminLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Timetable</h1>
            <p className="mt-1 text-slate-600">View and edit timetables for all batches</p>
          </div>

          <Link href="/admin/timetable/generate">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
              <Calendar className="mr-2 h-4 w-4" />
              Generate New
            </Button>
          </Link>
        </div>

        {groupedByBatch.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Calendar className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No timetable generated yet</h3>
            <p className="mt-1 text-slate-600">Get started by generating your first timetable</p>
            <Link href="/admin/timetable/generate">
              <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">
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
    </AdminLayout>
  )
}
