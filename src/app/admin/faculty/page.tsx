import { getFaculty } from '@/lib/faculty/actions'
import { FacultyList } from '@/components/faculty/faculty-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'

export default async function FacultyPage() {
  const faculty = await getFaculty()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="mb-2 text-slate-400 hover:text-slate-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-slate-50">Faculty Management</h1>
            <p className="text-slate-400 mt-2">Manage faculty members</p>
          </div>
          <Link href="/admin/faculty/create">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Faculty
            </Button>
          </Link>
        </div>

        <FacultyList faculty={faculty} />
      </div>
    </div>
  )
}
