import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'
import { StudentForm } from '@/components/students/student-form'
import { getBatches } from '@/lib/batches/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function CreateStudentPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  const batches = await getBatches()

  return (
    <AdminLayout user={user}>
      <div className="max-w-2xl">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Add New Student</CardTitle>
            <CardDescription className="text-slate-600">
              Create a new student account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StudentForm batches={batches} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
