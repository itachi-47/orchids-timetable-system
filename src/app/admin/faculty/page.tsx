import { getFaculty, getFacultyWorkload } from '@/lib/faculty/actions'
import { FacultyList } from '@/components/faculty/faculty-list'
import { FacultyWorkloadSummary } from '@/components/faculty/faculty-workload-summary'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'

export default async function FacultyPage() {
  const [faculty, workload] = await Promise.all([getFaculty(), getFacultyWorkload()])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto space-y-6 px-4 py-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="mb-2 text-slate-400 hover:text-slate-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-slate-50 sm:text-4xl">Faculty Management</h1>
            <p className="mt-2 text-slate-400">Manage faculty members</p>
          </div>

          <Link href="/admin/faculty/create" className="w-full sm:w-auto">
            <Button className="w-full bg-purple-600 text-white hover:bg-purple-700 sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Faculty
            </Button>
          </Link>
        </div>

        <FacultyWorkloadSummary workload={workload} />

        <FacultyList faculty={faculty} />
      </div>
    </div>
  )
}
