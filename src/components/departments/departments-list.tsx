'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Building2, User, Crown } from 'lucide-react'
import type { Department } from '@/types'
import type { UserData } from '@/lib/users/actions'
import { createDepartment, updateDepartment, deleteDepartment, assignHOD, assignCoordinator, removeHOD, removeCoordinator } from '@/lib/departments/actions'
import { useRouter } from 'next/navigation'

interface DepartmentsListProps {
  departments: Department[]
  facultyUsers: UserData[]
}

export function DepartmentsList({ departments, facultyUsers }: DepartmentsListProps) {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDept, setEditingDept] = useState<Department | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const code = formData.get('code') as string

    try {
      if (editingDept) {
        await updateDepartment(editingDept.id, { name, code })
      } else {
        await createDepartment({ name, code })
      }
      setDialogOpen(false)
      setEditingDept(null)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this department?')) return
    try {
      await deleteDepartment(id)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  const handleAssignHOD = async (departmentId: string, userId: string) => {
    try {
      await assignHOD(departmentId, userId)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to assign HOD')
    }
  }

  const handleAssignCoordinator = async (departmentId: string, userId: string) => {
    try {
      await assignCoordinator(departmentId, userId)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to assign Coordinator')
    }
  }

  const handleRemoveHOD = async (departmentId: string) => {
    if (!confirm('Remove HOD from this department?')) return
    try {
      await removeHOD(departmentId)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove HOD')
    }
  }

  const handleRemoveCoordinator = async (departmentId: string) => {
    if (!confirm('Remove Coordinator from this department?')) return
    try {
      await removeCoordinator(departmentId)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to remove Coordinator')
    }
  }

  const getUserName = (userId?: string) => {
    if (!userId) return null
    const user = facultyUsers.find(u => u.id === userId)
    return user?.full_name || 'Unknown'
  }

  const availableForHOD = (deptId: string) => 
    facultyUsers.filter(u => !u.department_id || u.department_id === deptId)

  const availableForCoordinator = (deptId: string) => 
    facultyUsers.filter(u => !u.is_coordinator || u.department_id === deptId)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) {
            setEditingDept(null)
            setError('')
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDept ? 'Edit Department' : 'Add Department'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Department Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={editingDept?.name || ''}
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Department Code</Label>
                <Input
                  id="code"
                  name="code"
                  defaultValue={editingDept?.code || ''}
                  placeholder="e.g., CSE"
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingDept ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {departments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-4 text-slate-600">No departments yet</p>
            <p className="text-sm text-slate-500">Add your first department to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <Card key={dept.id} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-violet-500 to-purple-600" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                  <span className="px-2 py-1 text-xs font-semibold bg-slate-100 rounded">{dept.code}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Crown className="h-4 w-4 text-amber-500" />
                      <span className="text-slate-600">HOD:</span>
                      <span className="font-medium">{getUserName(dept.hod_id) || 'Not assigned'}</span>
                    </div>
                    {dept.hod_id && (
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveHOD(dept.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  {!dept.hod_id && (
                    <Select onValueChange={(value) => handleAssignHOD(dept.id, value)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Assign HOD" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableForHOD(dept.id).map((u) => (
                          <SelectItem key={u.id} value={u.id}>{u.full_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-teal-500" />
                      <span className="text-slate-600">Coordinator:</span>
                      <span className="font-medium">{getUserName(dept.coordinator_id) || 'Not assigned'}</span>
                    </div>
                    {dept.coordinator_id && (
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveCoordinator(dept.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  {!dept.coordinator_id && (
                    <Select onValueChange={(value) => handleAssignCoordinator(dept.id, value)}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Assign Coordinator" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableForCoordinator(dept.id).map((u) => (
                          <SelectItem key={u.id} value={u.id}>{u.full_name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setEditingDept(dept)
                      setDialogOpen(true)
                    }}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(dept.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
