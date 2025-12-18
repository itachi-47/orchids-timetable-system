import { SubjectForm } from '@/components/subjects/subject-form'
import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function CreateSubjectPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Link href="/admin/subjects">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Create Subject</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8">
        <SubjectForm mode="create" />
      </main>
    </div>
  )
}
