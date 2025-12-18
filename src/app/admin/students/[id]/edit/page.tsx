import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'
import { StudentForm } from '@/components/students/student-form'
import { getStudentById } from '@/lib/students/actions'
import { getBatches } from '@/lib/batches/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { notFound } from 'next/navigation'

export default async function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  const { id } = await params
  const [student, batches] = await Promise.all([getStudentById(id), getBatches()])

  if (!student) {
    notFound()
  }

  return (
    <AdminLayout user={user}>
      <div className="max-w-2xl">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Edit Student</CardTitle>
            <CardDescription className="text-slate-600">
              Update student information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StudentForm student={student} batches={batches} />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
