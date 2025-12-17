import { Button } from '@/components/ui/button'
import { SubjectsList } from '@/components/subjects/subjects-list'
import { getSubjects } from '@/lib/subjects/actions'
import { Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'

export default async function SubjectsPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  const subjects = await getSubjects()

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold text-slate-900">Subjects</h1>
          </div>
          <Link href="/admin/subjects/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <SubjectsList subjects={subjects} />
      </main>
    </div>
  )
}
