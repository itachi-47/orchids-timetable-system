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
import type { Department } from '@/types'

type BatchesManagerProps = {
  batches: Batch[]
  courseTypes: CourseType[]
  departments: Department[]
  isAdmin?: boolean
}

export function BatchesManager({ batches = [], courseTypes = [], departments = [], isAdmin = true }: BatchesManagerProps) {
  const router = useRouter()
  const safeBatches = Array.isArray(batches) ? batches : []
  const safeCourseTypes = Array.isArray(courseTypes) ? courseTypes : []
  const safeDepartments = Array.isArray(departments) ? departments : []

  async function handleAddBatch(e: React.FormEvent) {
    e.preventDefault()
    if (!newBatch.trim() || !newSemester || !newDepartmentId) {
      alert('Please fill in all fields for the batch')
      return
    }

    setLoading(true)
    try {
      await createBatch({ 
        batch_name: newBatch,
        semester: newSemester,
        department_id: newDepartmentId
      })
      setNewBatch('')
      setNewSemester('')
      setNewDepartmentId('')
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
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">Batches</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
            Manage student batches (e.g., A, B, C)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddBatch} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="batch" className="dark:text-slate-200">Batch Name</Label>
                <Input
                  id="batch"
                  value={newBatch}
                  onChange={(e) => setNewBatch(e.target.value)}
                  placeholder="e.g., A, B, Section 1"
                  className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-blue-600 focus:ring-blue-600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester" className="dark:text-slate-200">Semester</Label>
                <select
                  id="semester"
                  value={newSemester}
                  onChange={(e) => setNewSemester(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="" className="dark:bg-slate-900">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s.toString()} className="dark:bg-slate-900">
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="dark:text-slate-200">Department (Branch)</Label>
              <select
                id="department"
                value={newDepartmentId}
                onChange={(e) => setNewDepartmentId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="" className="dark:bg-slate-900">Select Department</option>
                {safeDepartments.map((dept) => (
                  <option key={dept.id} value={dept.id} className="dark:bg-slate-900">
                    {dept.name} ({dept.code})
                  </option>
                ))}
              </select>
            </div>
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Batch
            </Button>
          </form>

          <div className="space-y-2">
            {safeBatches.length === 0 ? (
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-4">No batches yet</p>
            ) : (
              safeBatches.map((batch) => {
                const dept = safeDepartments.find(d => d.id === batch.department_id)
                return (
                  <div
                    key={batch.id}
                    className="flex items-center justify-between rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-3"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 dark:text-slate-100">{batch.batch_name}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {dept ? dept.name : 'No Department'} • Semester {batch.semester || 'N/A'}
                      </span>
                    </div>
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteBatch(batch.id)}
                        disabled={deleting === batch.id}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">Course Types</CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">
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
                  className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-blue-600 focus:ring-blue-600"
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
            {safeCourseTypes.length === 0 ? (
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center py-4">No course types yet</p>
            ) : (
              safeCourseTypes.map((courseType) => (
                <div
                  key={courseType.id}
                    className="flex items-center justify-between rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 p-3"
                >
                    <span className="text-slate-900 dark:text-slate-100">{courseType.course_type_name}</span>
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteCourseType(courseType.id)}
                        disabled={deleting === courseType.id}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
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
