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
    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-slate-50">
          {mode === 'create' ? 'Create Subject' : 'Edit Subject'}
        </CardTitle>
        <CardDescription className="text-slate-400">
          {mode === 'create' ? 'Add a new subject' : 'Update subject details'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="code" className="text-slate-300">Subject Code</Label>
            <Input
              id="code"
              name="code"
              defaultValue={subject?.code}
              placeholder="e.g., CS101"
              required
              className="border-slate-600 bg-slate-700/50 text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">Subject Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={subject?.name}
              placeholder="e.g., Data Structures"
              required
              className="border-slate-600 bg-slate-700/50 text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="credits" className="text-slate-300">Credits</Label>
            <Input
              id="credits"
              name="credits"
              type="number"
              defaultValue={subject?.credits}
              placeholder="e.g., 3"
              min="0"
              required
              className="border-slate-600 bg-slate-700/50 text-slate-100 placeholder:text-slate-500"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="theory_hours" className="text-slate-300">Theory Hours</Label>
              <Input
                id="theory_hours"
                name="theory_hours"
                type="number"
                defaultValue={subject?.theory_hours}
                placeholder="e.g., 3"
                min="0"
                required
                className="border-slate-600 bg-slate-700/50 text-slate-100 placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="practical_hours" className="text-slate-300">Practical Hours</Label>
              <Input
                id="practical_hours"
                name="practical_hours"
                type="number"
                defaultValue={subject?.practical_hours}
                placeholder="e.g., 2"
                min="0"
                required
                className="border-slate-600 bg-slate-700/50 text-slate-100 placeholder:text-slate-500"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-slate-600 text-slate-200 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? 'Saving...' : mode === 'create' ? 'Create Subject' : 'Update Subject'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
