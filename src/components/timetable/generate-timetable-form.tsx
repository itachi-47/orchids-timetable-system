'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { generateTimetable, getSubjectsWithFaculty } from '@/lib/timetable/actions'
import { Loader2, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Subject {
  id: string
  subject_code: string
  subject_name: string
  category: string
  classes_per_week: number
}

interface Faculty {
  id: string
  faculty_name: string
  short_code: string
}

export function GenerateTimetableForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [subjectFacultyMap, setSubjectFacultyMap] = useState<Record<string, string[]>>({})
  const [initialized, setInitialized] = useState(false)
  const [result, setResult] = useState<any>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getSubjectsWithFaculty()
      setSubjects(data.subjects)
      setFaculty(data.faculty)
      
      const initialMap: Record<string, string[]> = {}
      data.subjects.forEach(subject => {
        initialMap[subject.id] = []
      })
      setSubjectFacultyMap(initialMap)
      setInitialized(true)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFaculty = (subjectId: string, facultyId: string) => {
    setSubjectFacultyMap(prev => {
      const current = prev[subjectId] || []
      const updated = current.includes(facultyId)
        ? current.filter(id => id !== facultyId)
        : [...current, facultyId]
      return { ...prev, [subjectId]: updated }
    })
  }

  const handleGenerate = async () => {
    setLoading(true)
    setResult(null)
    try {
      const res = await generateTimetable(subjectFacultyMap)
      setResult(res)
      setTimeout(() => router.push('/admin/timetable'), 1500)
    } catch (error) {
      console.error('Error generating timetable:', error)
    } finally {
      setLoading(false)
    }
  }

    if (!initialized) {
      return (
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Generate Timetable</CardTitle>
            <CardDescription className="text-slate-600">
              Map subjects to faculty and generate timetable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={loadData} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Start Configuration
            </Button>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-6">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Subject-Faculty Mapping</CardTitle>
            <CardDescription className="text-slate-600">
              Assign faculty to subjects for timetable generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {subjects.map(subject => (
              <div key={subject.id} className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div>
                  <Label className="text-slate-900 font-medium">
                    {subject.subject_code} - {subject.subject_name}
                  </Label>
                  <p className="text-xs text-slate-500">
                    {subject.category} • {subject.classes_per_week} classes/week
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {faculty.map(fac => (
                    <Button
                      key={fac.id}
                      type="button"
                      size="sm"
                      variant={subjectFacultyMap[subject.id]?.includes(fac.id) ? 'default' : 'outline'}
                      className={
                        subjectFacultyMap[subject.id]?.includes(fac.id)
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                      }
                      onClick={() => toggleFaculty(subject.id, fac.id)}
                    >
                      {fac.short_code}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {result && (
          <Card className="border-green-200 bg-green-50 shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm text-green-800">
                <p>✓ Generated {result.slotsGenerated} timetable slots</p>
                <p>✓ Conflicts detected: {result.conflicts}</p>
                <p className="text-xs text-green-600">Redirecting to timetable view...</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Generate Timetable
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>
        </div>
      </div>
    )
  }
