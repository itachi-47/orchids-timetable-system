import { getFacultyById } from '@/lib/faculty/actions'
import { FacultyForm } from '@/components/faculty/faculty-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditFacultyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  try {
    const faculty = await getFacultyById(id)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <Link href="/admin/faculty">
            <Button variant="ghost" size="sm" className="mb-6 text-slate-400 hover:text-slate-200">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Faculty
            </Button>
          </Link>
          <FacultyForm faculty={faculty} mode="edit" />
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
