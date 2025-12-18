import { Button } from '@/components/ui/button'
import { SubjectsList } from '@/components/subjects/subjects-list'
import { getSubjects } from '@/lib/subjects/actions'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { CoordinatorLayout } from '@/components/layout/coordinator-layout'

export default async function CoordinatorSubjectsPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'timetable_coordinator') {
    redirect('/login')
  }

  const subjects = await getSubjects()

  return (
    <CoordinatorLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Subjects</h1>
            <p className="mt-1 text-slate-600">Manage course subjects and their details</p>
          </div>
          <Link href="/coordinator/subjects/create">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
          </Link>
        </div>

        <SubjectsList subjects={subjects} isAdmin={false} />
      </div>
    </CoordinatorLayout>
  )
}
