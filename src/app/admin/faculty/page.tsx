import { getFaculty } from '@/lib/faculty/actions'
import { FacultyList } from '@/components/faculty/faculty-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'

export default async function FacultyPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  const faculty = await getFaculty()

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Faculty</h1>
            <p className="mt-1 text-slate-600">Manage faculty members and their information</p>
          </div>
          <Link href="/admin/faculty/create">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Faculty
            </Button>
          </Link>
        </div>

        <FacultyList faculty={faculty} />
      </div>
    </AdminLayout>
  )
}
