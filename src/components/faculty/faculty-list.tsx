'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { deleteFaculty, type Faculty } from '@/lib/faculty/actions'

type FacultyListProps = {
  faculty: Faculty[]
}

export function FacultyList({ faculty }: FacultyListProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this faculty?')) return

    setDeleting(id)
    try {
      await deleteFaculty(id)
      router.refresh()
    } catch (error) {
      console.error('Error deleting faculty:', error)
      alert('Failed to delete faculty')
    } finally {
      setDeleting(null)
    }
  }

  if (faculty.length === 0) {
    return (
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="p-8 text-center text-slate-600">
          No faculty members found. Click "Add Faculty" to create one.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {faculty.map((item) => (
        <Card key={item.id} className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">{item.faculty_name}</CardTitle>
            <CardDescription className="text-slate-600">Code: {item.short_code}</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/admin/faculty/${item.id}/edit`)}
              className="border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(item.id)}
              disabled={deleting === item.id}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {deleting === item.id ? 'Deleting...' : 'Delete'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
