import { redirect } from 'next/navigation'
import { getTimetable } from '@/lib/timetable/actions'
import { TimetableGrid } from '@/components/timetable/timetable-grid'
import { Button } from '@/components/ui/button'
import { logout, getCurrentUser } from '@/lib/auth/actions'
import { getBatches } from '@/lib/batches/actions'
import { getDepartments } from '@/lib/departments/actions'
import { Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { StudentTimetableControls } from '@/components/timetable/student-timetable-controls'

export default async function StudentTimetablePage({
  searchParams,
}: {
  searchParams: Promise<{ batch?: string; sem?: string; dept?: string }>
}) {
  const userData = await getCurrentUser()
  if (!userData) redirect('/login')

  if (userData.role !== 'student') redirect('/dashboard')

  const params = await searchParams
  const [batches, timetableData, departments] = await Promise.all([
    getBatches(),
    getTimetable(),
    getDepartments(),
  ])

  const selectedDeptId = params.dept || ''
  const selectedSem = params.sem || ''
  const selectedBatchId = params.batch || ''
  
  const selectedBatch = batches.find(b => b.id === selectedBatchId)
  
  const studentTimetable = selectedBatchId 
    ? timetableData.filter(entry => entry.batch_id === selectedBatchId) 
    : []

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Calendar className="h-6 w-6 text-amber-600" />
              <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">My Timetable</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-slate-600 sm:inline">{userData.full_name}</span>
              <form action={logout}>
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Logout
                </Button>
              </form>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <StudentTimetableControls 
              departments={departments}
              batches={batches}
              selectedDeptId={selectedDeptId}
              selectedSem={selectedSem}
              selectedBatchId={selectedBatchId}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Class Schedule</h2>
          <p className="text-slate-600">
            {selectedBatch 
              ? `Weekly timetable for ${selectedBatch.batch_name}` 
              : 'Please select your branch, semester, and batch to view the timetable'}
          </p>
        </div>

        {!selectedBatchId ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900">No Batch Selected</h3>
            <p className="mt-2 text-slate-500">Select your details from the dropdowns above to see your schedule</p>
          </div>
        ) : studentTimetable.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-sm">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-400" />
            <p className="text-slate-600">No timetable available yet for this batch</p>
            <p className="mt-2 text-sm text-slate-500">Contact your administrator or coordinator</p>
          </div>
        ) : (
          <TimetableGrid 
            entries={studentTimetable} 
            batchName={selectedBatch?.batch_name} 
            editable={false}
          />
        )}
      </main>
    </div>
  )
}
