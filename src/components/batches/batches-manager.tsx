'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Plus } from 'lucide-react'
import { createBatch, deleteBatch, type Batch } from '@/lib/batches/actions'
import { createCourseType, deleteCourseType, type CourseType } from '@/lib/course-types/actions'

type BatchesManagerProps = {
  batches: Batch[]
  courseTypes: CourseType[]
  isAdmin?: boolean
}

export function BatchesManager({ batches, courseTypes, isAdmin = true }: BatchesManagerProps) {
  const router = useRouter()
  const [newBatch, setNewBatch] = useState('')
  const [newCourseType, setNewCourseType] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleAddBatch(e: React.FormEvent) {
    e.preventDefault()
    if (!newBatch.trim()) return

    setLoading(true)
    try {
      await createBatch({ batch_name: newBatch })
      setNewBatch('')
      router.refresh()
    } catch (error) {
      console.error('Error creating batch:', error)
      alert('Failed to create batch')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddCourseType(e: React.FormEvent) {
    e.preventDefault()
    if (!newCourseType.trim()) return

    setLoading(true)
    try {
      await createCourseType({ course_type_name: newCourseType })
      setNewCourseType('')
      router.refresh()
    } catch (error) {
      console.error('Error creating course type:', error)
      alert('Failed to create course type')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteBatch(id: string) {
    if (!confirm('Are you sure you want to delete this batch?')) return

    setDeleting(id)
    try {
      await deleteBatch(id)
      router.refresh()
    } catch (error) {
      console.error('Error deleting batch:', error)
      alert('Failed to delete batch')
    } finally {
      setDeleting(null)
    }
  }

  async function handleDeleteCourseType(id: string) {
    if (!confirm('Are you sure you want to delete this course type?')) return

    setDeleting(id)
    try {
      await deleteCourseType(id)
      router.refresh()
    } catch (error) {
      console.error('Error deleting course type:', error)
      alert('Failed to delete course type')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Batches</CardTitle>
          <CardDescription className="text-slate-600">
            Manage student batches (e.g., A, B, C)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddBatch} className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="batch" className="sr-only">Batch Name</Label>
              <Input
                id="batch"
                value={newBatch}
                onChange={(e) => setNewBatch(e.target.value)}
                placeholder="Enter batch name (e.g., A, B)"
                  className="border-slate-300 bg-white text-slate-900 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
          </form>

          <div className="space-y-2">
            {batches.length === 0 ? (
                <p className="text-sm text-slate-600 text-center py-4">No batches yet</p>
            ) : (
              batches.map((batch) => (
                <div
                  key={batch.id}
                    className="flex items-center justify-between rounded-lg border border-slate-300 bg-white p-3"
                >
                    <span className="text-slate-900">{batch.batch_name}</span>
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteBatch(batch.id)}
                        disabled={deleting === batch.id}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">Course Types</CardTitle>
          <CardDescription className="text-slate-600">
            Manage course types (e.g., Theory, Lab, Tutorial)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddCourseType} className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="courseType" className="sr-only">Course Type</Label>
              <Input
                id="courseType"
                value={newCourseType}
                onChange={(e) => setNewCourseType(e.target.value)}
                placeholder="Enter course type (e.g., Theory)"
                  className="border-slate-300 bg-white text-slate-900 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
          </form>

          <div className="space-y-2">
            {courseTypes.length === 0 ? (
                <p className="text-sm text-slate-600 text-center py-4">No course types yet</p>
            ) : (
              courseTypes.map((courseType) => (
                <div
                  key={courseType.id}
                    className="flex items-center justify-between rounded-lg border border-slate-300 bg-white p-3"
                >
                    <span className="text-slate-900">{courseType.course_type_name}</span>
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCourseType(courseType.id)}
                        disabled={deleting === courseType.id}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
