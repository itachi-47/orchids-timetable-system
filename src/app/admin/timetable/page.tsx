import { getTimetable } from '@/lib/timetable/actions'
import { TimetableGrid } from '@/components/timetable/timetable-grid'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export default async function TimetablePage() {
  const supabase = await createClient()

  const [{ data: batches }, { data: subjects }, { data: faculty }, { data: rooms }] = await Promise.all([
    supabase.from('batches').select('*'),
    supabase.from('subjects').select('id, subject_code, subject_name, category, classes_per_week'),
    supabase.from('faculty').select('id, faculty_name, short_code'),
    supabase.from('rooms').select('id, room_number'),
  ])

  const timetableData = await getTimetable()

  const groupedByBatch = (batches || []).map(batch => ({
    batch,
    entries: timetableData.filter(entry => entry.batch_id === batch.id),
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-200">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-50 sm:text-3xl">Timetable</h1>
              <p className="text-slate-400">View and edit timetables for all batches</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/admin/timetable/generate" className="w-full sm:w-auto">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 sm:w-auto">
                <Calendar className="mr-2 h-4 w-4" />
                Generate New
              </Button>
            </Link>
          </div>
        </div>

        {groupedByBatch.length === 0 ? (
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-12 text-center backdrop-blur">
            <p className="text-slate-400">No timetable generated yet</p>
            <Link href="/admin/timetable/generate">
              <Button className="mt-4 bg-purple-600 hover:bg-purple-700">
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
