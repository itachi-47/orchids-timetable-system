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
    } catch (error) {
      alert('Failed to delete subject')
    } finally {
      setDeletingId(null)
    }
  }

  if (subjects.length === 0) {
    return (
      <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
        <CardContent className="flex min-h-[300px] items-center justify-center">
          <p className="text-slate-400">No subjects found. Create your first subject!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => (
        <Card key={subject.id} className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-slate-50">
              <span>{subject.code}</span>
              <div className="flex gap-2">
                <Link href={`/admin/subjects/${subject.id}/edit`}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-slate-400 hover:text-purple-400"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(subject.id)}
                  disabled={deletingId === subject.id}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-medium text-slate-200">{subject.name}</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <div>Credits: <span className="text-slate-300">{subject.credits}</span></div>
              <div>Theory: <span className="text-slate-300">{subject.theory_hours}h</span></div>
              <div>Practical: <span className="text-slate-300">{subject.practical_hours}h</span></div>
              <div>Total: <span className="text-slate-300">{subject.theory_hours + subject.practical_hours}h</span></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
