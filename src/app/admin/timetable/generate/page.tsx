import { GenerateTimetableForm } from '@/components/timetable/generate-timetable-form'
import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'

export default async function GenerateTimetablePage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Generate Timetable</h1>
          <p className="mt-1 text-slate-600">Configure subject-faculty mapping and generate timetable</p>
        </div>

        <GenerateTimetableForm />
      </div>
    </AdminLayout>
  )
}
