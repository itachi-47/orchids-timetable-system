import { SubjectForm } from '@/components/subjects/subject-form'
import { getCurrentUser } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function EditSubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  const { id } = await params
  const supabase = await createClient()

  const { data: subject, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !subject) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Link href="/admin/subjects">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-50">Edit Subject</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8">
        <SubjectForm subject={subject} mode="edit" />
      </main>
    </div>
  )
}
