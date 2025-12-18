import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { FacultyLayout } from '@/components/layout/faculty-layout'
import { getTimetable } from '@/lib/timetable/actions'
import { getFaculty } from '@/lib/faculty/actions'
import { FacultySchedule } from '@/components/faculty/faculty-schedule'

export default async function FacultySchedulePage() {
  const user = await getCurrentUser()
  
  if (!user || !['faculty', 'hod', 'timetable_coordinator', 'admin'].includes(user.role)) {
    redirect('/login')
  }

  const [timetable, facultyList] = await Promise.all([
    getTimetable(),
    getFaculty(),
  ])

  const matchedFaculty = facultyList.find(f => 
    f.faculty_name.toLowerCase() === user.full_name.toLowerCase() ||
    user.email.toLowerCase().includes(f.short_code.toLowerCase())
  )

  const mySchedule = matchedFaculty 
    ? timetable.filter(entry => entry.faculty_id === matchedFaculty.id)
    : []

  return (
    <FacultyLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Schedule</h1>
          <p className="mt-1 text-slate-600">
            {matchedFaculty 
              ? `Viewing schedule for ${matchedFaculty.faculty_name} (${matchedFaculty.short_code})`
              : 'Your schedule based on assigned classes'}
          </p>
        </div>

        <FacultySchedule entries={mySchedule} facultyName={matchedFaculty?.faculty_name} />
      </div>
    </FacultyLayout>
  )
}
