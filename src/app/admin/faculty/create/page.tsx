import { FacultyForm } from '@/components/faculty/faculty-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CreateFacultyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <Link href="/admin/faculty">
          <Button variant="ghost" size="sm" className="mb-6 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Faculty
          </Button>
        </Link>
        <FacultyForm mode="create" />
      </div>
    </div>
  )
}
