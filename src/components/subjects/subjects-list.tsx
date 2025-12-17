'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteSubject, type Subject } from '@/lib/subjects/actions'
import { Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type SubjectsListProps = {
  subjects: Subject[]
}

export function SubjectsList({ subjects }: SubjectsListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this subject?')) return

    setDeletingId(id)
    try {
      await deleteSubject(id)
      router.refresh()
    } catch {
      alert('Failed to delete subject')
    } finally {
      setDeletingId(null)
    }
  }

  if (subjects.length === 0) {
    return (
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="flex min-h-[300px] items-center justify-center">
          <p className="text-slate-600">No subjects found. Create your first subject!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {subjects.map(subject => (
        <Card key={subject.id} className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-slate-900">
              <span>{subject.subject_code}</span>
              <div className="flex gap-2">
                <Link href={`/admin/subjects/${subject.id}/edit`}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-slate-600 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(subject.id)}
                  disabled={deletingId === subject.id}
                  className="h-8 w-8 p-0 text-slate-600 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-medium text-slate-700">{subject.subject_name}</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div>
                Category: <span className="text-slate-700">{subject.category}</span>
              </div>
              <div>
                /week: <span className="text-slate-700">{subject.classes_per_week}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
