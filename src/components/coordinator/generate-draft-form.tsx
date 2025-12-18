'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Grid3x3, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import type { Batch } from '@/types'
import type { UserProfile } from '@/lib/auth/actions'
import { createTimetableDraft, generateDraftTimetable } from '@/lib/timetable-drafts/actions'
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

interface GenerateDraftFormProps {
  subjects: Subject[]
  faculty: Faculty[]
  batches: Batch[]
  currentUser: UserProfile
}

const SEMESTERS = ['1', '2', '3', '4', '5', '6', '7', '8']
const SESSIONS = ['2024-25', '2025-26', '2026-27']

const formatDateForInput = (date: Date) => {
  return date.toISOString().split('T')[0]
}

export function GenerateDraftForm({ subjects, faculty, batches, currentUser }: GenerateDraftFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ slotsGenerated: number; conflicts: number } | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    batch_id: '',
    semester: '',
    session: SESSIONS[0],
    program_name: '',
    effective_date: formatDateForInput(new Date()),
    coordinator_name: currentUser.full_name || '',
    hod_name: '',
  })

  const [subjectFacultyMapping, setSubjectFacultyMapping] = useState<Record<string, string[]>>({})

  const toggleFaculty = (subjectId: string, facultyId: string) => {
    setSubjectFacultyMapping(prev => {
      const current = prev[subjectId] || []
      if (current.includes(facultyId)) {
        return { ...prev, [subjectId]: current.filter(id => id !== facultyId) }
      }
      return { ...prev, [subjectId]: [...current, facultyId] }
    })
  }

  const handleGenerate = async () => {
    if (!formData.name || !formData.batch_id || !formData.semester) {
      setError('Please fill all required fields')
      return
    }

    const hasMapping = Object.values(subjectFacultyMapping).some(arr => arr.length > 0)
    if (!hasMapping) {
      setError('Please assign at least one faculty to a subject')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
        const { id } = await createTimetableDraft({
          name: formData.name,
          department_id: currentUser.department_id || 'default',
          batch_id: formData.batch_id,
          semester: formData.semester,
          session: formData.session,
          program_name: formData.program_name,
          effective_date: formData.effective_date,
          coordinator_name: formData.coordinator_name,
          hod_name: formData.hod_name,
          created_by: currentUser.id,
        })

      const genResult = await generateDraftTimetable(id, subjectFacultyMapping)
      setResult({ slotsGenerated: genResult.slotsGenerated, conflicts: genResult.conflicts })
      
      setTimeout(() => {
        router.push(`/coordinator/drafts`)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate timetable')
    } finally {
      setLoading(false)
    }
  }

  if (batches.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-amber-400" />
          <p className="mt-4 text-slate-600">No batches available</p>
          <p className="text-sm text-slate-500">Please ask admin to create batches first</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
            )}
            
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Timetable Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., CSE Sem-5 Timetable"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batch">Batch *</Label>
                  <Select
                    value={formData.batch_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, batch_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map(batch => (
                        <SelectItem key={batch.id} value={batch.id}>{batch.batch_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester *</Label>
                  <Select
                    value={formData.semester}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, semester: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {SEMESTERS.map(sem => (
                        <SelectItem key={sem} value={sem}>Semester {sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session">Session</Label>
                  <Select
                    value={formData.session}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, session: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SESSIONS.map(sess => (
                        <SelectItem key={sess} value={sess}>{sess}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-slate-900 mb-3">PDF Export Settings</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="program_name">Program Name</Label>
                    <Input
                      id="program_name"
                      value={formData.program_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, program_name: e.target.value }))}
                      placeholder="e.g., B.Tech III Semester"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="effective_date">Effective Date</Label>
                    <Input
                      id="effective_date"
                      type="date"
                      value={formData.effective_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, effective_date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coordinator_name">Coordinator Name</Label>
                    <Input
                      id="coordinator_name"
                      value={formData.coordinator_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, coordinator_name: e.target.value }))}
                      placeholder="e.g., Dr. John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hod_name">HOD Name</Label>
                    <Input
                      id="hod_name"
                      value={formData.hod_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, hod_name: e.target.value }))}
                      placeholder="e.g., Dr. Jane Smith"
                    />
                  </div>
                </div>
              </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={() => {
                  if (!formData.name || !formData.batch_id || !formData.semester) {
                    setError('Please fill all required fields')
                    return
                  }
                  setError('')
                  setStep(2)
                }}
              >
                Next: Assign Faculty
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Subject-Faculty Mapping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
            )}

            {result && (
              <div className="p-4 rounded-lg bg-emerald-50 text-emerald-700 flex items-center gap-3">
                <CheckCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Timetable generated successfully!</p>
                  <p className="text-sm">{result.slotsGenerated} slots created, {result.conflicts} conflicts</p>
                  <p className="text-sm">Redirecting to drafts...</p>
                </div>
              </div>
            )}

            <p className="text-sm text-slate-600">
              Select which faculty members can teach each subject. Multiple faculty can be assigned to the same subject.
            </p>

            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {subjects.map(subject => (
                <div key={subject.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{subject.subject_name}</p>
                      <p className="text-sm text-slate-500">{subject.subject_code} • {subject.classes_per_week} hrs/week</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-slate-100 rounded">{subject.category}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {faculty.map(f => {
                      const isSelected = (subjectFacultyMapping[subject.id] || []).includes(f.id)
                      return (
                        <label
                          key={f.id}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                            isSelected ? 'bg-teal-50 border-teal-300' : 'hover:bg-slate-50'
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleFaculty(subject.id, f.id)}
                          />
                          <span className="text-sm">{f.faculty_name} ({f.short_code})</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleGenerate} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Grid3x3 className="h-4 w-4 mr-2" />
                    Generate Timetable
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
