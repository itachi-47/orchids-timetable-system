import { getBatches } from '@/lib/batches/actions'
import { getCourseTypes } from '@/lib/course-types/actions'
import { BatchesManager } from '@/components/batches/batches-manager'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function BatchesPage() {
  const [batches, courseTypes] = await Promise.all([
    getBatches(),
    getCourseTypes(),
  ])

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-4xl font-semibold text-slate-900">Batches & Course Types</h1>
          <p className="text-slate-600 mt-2">Manage student batches and course categories</p>
        </div>

        <BatchesManager batches={batches} courseTypes={courseTypes} />
      </div>
    </div>
  )
}
