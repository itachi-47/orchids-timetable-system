import { redirect } from 'next/navigation'
import { getTimetable } from '@/lib/timetable/actions'
import { TimetableGrid } from '@/components/timetable/timetable-grid'
import { Button } from '@/components/ui/button'
import { logout, getCurrentUser } from '@/lib/auth/actions'
import { getBatches } from '@/lib/batches/actions'
import { Calendar } from 'lucide-react'

export default async function StudentDashboard() {
  const userData = await getCurrentUser()
  if (!userData) redirect('/login')

  if (userData.role !== 'student') redirect('/dashboard')

  const [batches, timetableData] = await Promise.all([getBatches(), getTimetable()])

  const batchId = batches?.[0]?.id
  const batchName = batches?.[0]?.batch_name

  const studentTimetable = batchId ? timetableData.filter(entry => entry.batch_id === batchId) : []

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">My Timetable</h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <span className="text-sm text-slate-600">{userData.full_name}</span>
            <form action={logout}>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 sm:w-auto"
              >
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Welcome, {userData.full_name}</h2>
          <p className="text-slate-600">View your class schedule</p>
        </div>

        {studentTimetable.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-400" />
            <p className="text-slate-600">No timetable available yet</p>
            <p className="mt-2 text-sm text-slate-500">Contact your administrator</p>
          </div>
        ) : (
          <TimetableGrid entries={studentTimetable} batchName={batchName} />
        )}
      </main>
    </div>
  )
}
