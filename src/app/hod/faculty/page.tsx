import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { HODLayout } from '@/components/layout/hod-layout'
import { getFacultyUsers, getUsersByDepartment } from '@/lib/users/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Mail, BookOpen, GraduationCap } from 'lucide-react'

export default async function HODFacultyPage() {
  const user = await getCurrentUser()
  
  if (!user || (user.role !== 'hod' && user.role !== 'admin')) {
    redirect('/login')
  }

  // If HOD has a department, filter by it. Otherwise get all faculty users.
  const faculty = user.department_id 
    ? await getUsersByDepartment(user.department_id)
    : await getFacultyUsers()

  // Filter to only include faculty-related roles if using getUsersByDepartment
  const filteredFaculty = faculty.filter(f => 
    ['faculty', 'hod', 'timetable_coordinator'].includes(f.role)
  )

  return (
    <HODLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Department Faculty</h1>
          <p className="mt-1 text-slate-600">View faculty members in your department</p>
        </div>

        {filteredFaculty.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-600">No faculty members found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredFaculty.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold">
                        {member.full_name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div>
                        <CardTitle className="text-base">{member.full_name}</CardTitle>
                        <p className="text-sm text-slate-500">{member.role.replace('_', ' ').toUpperCase()}</p>
                      </div>
                    </div>
                    {member.is_coordinator && (
                      <Badge className="bg-purple-100 text-purple-700 text-xs">
                        Coordinator
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {/* Since UserData doesn't have subjects or designation directly in this model, 
                      we'll show what we have or omit them for now to avoid crashes */}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </HODLayout>
  )
}
