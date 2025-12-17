'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createSubject, updateSubject, type Subject } from '@/lib/subjects/actions'
import { useRouter } from 'next/navigation'

type SubjectFormProps = {
  subject?: Subject
  mode: 'create' | 'edit'
}

export function SubjectForm({ subject, mode }: SubjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)

      if (mode === 'create') {
        await createSubject(formData)
      } else if (subject) {
        await updateSubject(subject.id, formData)
      }

      router.push('/admin/subjects')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">{mode === 'create' ? 'Create Subject' : 'Edit Subject'}</CardTitle>
        <CardDescription className="text-slate-600">
          {mode === 'create' ? 'Add a new subject' : 'Update subject details'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</div>
          )}

          <div className="space-y-2">
            <Label htmlFor="subject_code" className="text-slate-700">
              Subject Code
            </Label>
            <Input
              id="subject_code"
              name="subject_code"
              defaultValue={subject?.subject_code}
              placeholder="e.g., CS101"
              required
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject_name" className="text-slate-700">
              Subject Name
            </Label>
            <Input
              id="subject_name"
              name="subject_name"
              defaultValue={subject?.subject_name}
              placeholder="e.g., Data Structures"
              required
              className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-slate-700">
                Category
              </Label>
              <Input
                id="category"
                name="category"
                defaultValue={subject?.category}
                placeholder="e.g., Theory"
                required
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classes_per_week" className="text-slate-700">
                Classes per week
              </Label>
              <Input
                id="classes_per_week"
                name="classes_per_week"
                type="number"
                defaultValue={subject?.classes_per_week}
                placeholder="e.g., 4"
                min="0"
                required
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
            {loading ? 'Saving...' : mode === 'create' ? 'Create Subject' : 'Update Subject'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
