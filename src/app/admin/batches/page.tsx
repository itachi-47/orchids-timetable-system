import { getBatches } from '@/lib/batches/actions'
import { getCourseTypes } from '@/lib/course-types/actions'
import { BatchesManager } from '@/components/batches/batches-manager'
import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'

export default async function BatchesPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  const [batches, courseTypes] = await Promise.all([
    getBatches(),
    getCourseTypes(),
  ])

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Batches & Course Types</h1>
          <p className="mt-1 text-slate-600">Manage student batches and course categories</p>
        </div>

        <BatchesManager batches={batches} courseTypes={courseTypes} />
      </div>
    </AdminLayout>
  )
}
