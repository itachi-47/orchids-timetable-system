import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { HODLayout } from '@/components/layout/hod-layout'
import { getFaculty } from '@/lib/faculty/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Mail, BookOpen, GraduationCap } from 'lucide-react'

export default async function HODFacultyPage() {
  const user = await getCurrentUser()
  
  if (!user || (user.role !== 'hod' && user.role !== 'admin')) {
    redirect('/login')
  }

  const faculty = await getFaculty()

  return (
    <HODLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Department Faculty</h1>
          <p className="mt-1 text-slate-600">View faculty members in your department</p>
        </div>

        {faculty.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-600">No faculty members found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {faculty.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <CardTitle className="text-base">{member.name}</CardTitle>
                        <p className="text-sm text-slate-500">{member.short_name}</p>
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
                  {member.subjects && member.subjects.length > 0 && (
                    <div className="flex items-start gap-2 text-slate-600">
                      <BookOpen className="h-4 w-4 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {member.subjects.slice(0, 3).map((subject, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                        {member.subjects.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{member.subjects.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  {member.designation && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <GraduationCap className="h-4 w-4" />
                      <span>{member.designation}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </HODLayout>
  )
}
