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
          <CardTitle className="text-slate-900">
            {mode === 'create' ? 'Create Subject' : 'Edit Subject'}
          </CardTitle>
          <CardDescription className="text-slate-600">
            {mode === 'create' ? 'Add a new subject' : 'Update subject details'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="code" className="text-slate-700">Subject Code</Label>
              <Input
                id="code"
                name="code"
                defaultValue={subject?.code}
                placeholder="e.g., CS101"
                required
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-700">Subject Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={subject?.name}
                placeholder="e.g., Data Structures"
                required
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credits" className="text-slate-700">Credits</Label>
              <Input
                id="credits"
                name="credits"
                type="number"
                defaultValue={subject?.credits}
                placeholder="e.g., 3"
                min="0"
                required
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="theory_hours" className="text-slate-700">Theory Hours</Label>
                <Input
                  id="theory_hours"
                  name="theory_hours"
                  type="number"
                  defaultValue={subject?.theory_hours}
                  placeholder="e.g., 3"
                  min="0"
                  required
                  className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="practical_hours" className="text-slate-700">Practical Hours</Label>
                <Input
                  id="practical_hours"
                  name="practical_hours"
                  type="number"
                  defaultValue={subject?.practical_hours}
                  placeholder="e.g., 2"
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
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create Subject' : 'Update Subject'}
            </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
