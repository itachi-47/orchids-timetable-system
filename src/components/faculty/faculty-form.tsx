'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createFaculty, updateFaculty, type Faculty } from '@/lib/faculty/actions'

type FacultyFormProps = {
  faculty?: Faculty
  mode: 'create' | 'edit'
  isAdmin?: boolean
}

export function FacultyForm({ faculty, mode, isAdmin = true }: FacultyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const basePath = isAdmin ? '/admin' : '/coordinator'
  const [formData, setFormData] = useState({
    faculty_name: faculty?.faculty_name || '',
    short_code: faculty?.short_code || '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'create') {
        await createFaculty(formData)
      } else {
        await updateFaculty(faculty!.id, formData)
      }
      router.push(`${basePath}/faculty`)
      router.refresh()
    } catch (error) {
      console.error('Error saving faculty:', error)
      alert('Failed to save faculty')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">
          {mode === 'create' ? 'Add New Faculty' : 'Edit Faculty'}
        </CardTitle>
        <CardDescription className="text-slate-600">
          {mode === 'create' ? 'Create a new faculty member' : 'Update faculty details'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="faculty_name" className="text-slate-700">Faculty Name</Label>
            <Input
              id="faculty_name"
              value={formData.faculty_name}
              onChange={(e) => setFormData({ ...formData, faculty_name: e.target.value })}
              required
              className="border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter faculty name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_code" className="text-slate-700">Short Code</Label>
            <Input
              id="short_code"
              value={formData.short_code}
              onChange={(e) => setFormData({ ...formData, short_code: e.target.value })}
              required
              className="border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., JD"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create Faculty' : 'Update Faculty'}
            </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push(`${basePath}/faculty`)}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Button>

          </div>
        </form>
      </CardContent>
    </Card>
  )
}
