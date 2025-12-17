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
}

export function FacultyForm({ faculty, mode }: FacultyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
      router.push('/admin/faculty')
      router.refresh()
    } catch (error) {
      console.error('Error saving faculty:', error)
      alert('Failed to save faculty')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto border-slate-700 bg-slate-800/50">
      <CardHeader>
        <CardTitle className="text-slate-50">
          {mode === 'create' ? 'Add New Faculty' : 'Edit Faculty'}
        </CardTitle>
        <CardDescription className="text-slate-400">
          {mode === 'create' ? 'Create a new faculty member' : 'Update faculty details'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="faculty_name" className="text-slate-200">Faculty Name</Label>
            <Input
              id="faculty_name"
              value={formData.faculty_name}
              onChange={(e) => setFormData({ ...formData, faculty_name: e.target.value })}
              required
              className="border-slate-600 bg-slate-900 text-slate-50"
              placeholder="Enter faculty name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_code" className="text-slate-200">Short Code</Label>
            <Input
              id="short_code"
              value={formData.short_code}
              onChange={(e) => setFormData({ ...formData, short_code: e.target.value })}
              required
              className="border-slate-600 bg-slate-900 text-slate-50"
              placeholder="e.g., JD"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create Faculty' : 'Update Faculty'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/admin/faculty')}
              className="border-slate-600 text-slate-200 hover:bg-slate-800"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
