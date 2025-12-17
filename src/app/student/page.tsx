import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTimetable } from '@/lib/timetable/actions'
import { TimetableGrid } from '@/components/timetable/timetable-grid'
import { Button } from '@/components/ui/button'
import { logout } from '@/lib/auth/actions'
import { Calendar } from 'lucide-react'

export default async function StudentDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userData } = await supabase.from('users').select('*').eq('user_id', user.id).single()

  if (!userData) redirect('/login')
  if (userData.role !== 'student') redirect('/dashboard')

  const { data: batches } = await supabase.from('batches').select('*')
  const timetableData = await getTimetable()

  const batchId = batches?.[0]?.id
  const batchName = batches?.[0]?.batch_name

  const studentTimetable = batchId ? timetableData.filter(entry => entry.batch_id === batchId) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-purple-400" />
            <h1 className="text-xl font-bold text-slate-50 sm:text-2xl">My Timetable</h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <span className="text-sm text-slate-300">{userData.full_name}</span>
            <form action={logout}>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-slate-600 text-slate-200 hover:bg-slate-700 sm:w-auto"
              >
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-50 sm:text-3xl">Welcome, {userData.full_name}</h2>
          <p className="text-slate-400">View your class schedule</p>
        </div>

        {studentTimetable.length === 0 ? (
          <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-12 text-center backdrop-blur">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-slate-600" />
            <p className="text-slate-400">No timetable available yet</p>
            <p className="mt-2 text-sm text-slate-500">Contact your administrator</p>
          </div>
        ) : (
          <TimetableGrid entries={studentTimetable} batchName={batchName} />
        )}
      </main>
    </div>
  )
}
