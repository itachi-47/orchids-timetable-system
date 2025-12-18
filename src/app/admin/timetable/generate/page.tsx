import { GenerateTimetableForm } from '@/components/timetable/generate-timetable-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GenerateTimetablePage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Generate Timetable</h1>
            <p className="text-slate-600">Configure subject-faculty mapping and generate timetable</p>
          </div>
        </div>

        <GenerateTimetableForm />
      </div>
    </div>
  )
}
