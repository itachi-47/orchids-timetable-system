'use client'

import { createStudent, updateStudent, Student } from '@/lib/students/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { useActionState } from 'react'
import { useEffect } from 'react'

type Batch = {
  id: string
  batch_name: string
}

type Props = {
  student?: Student
  batches: Batch[]
}

export function StudentForm({ student, batches }: Props) {
  const router = useRouter()
  const isEditing = !!student

  const action = async (prevState: unknown, formData: FormData) => {
    if (isEditing) {
      return updateStudent(student.id, formData)
    }
    return createStudent(formData)
  }

  const [state, formAction, isPending] = useActionState(action, null)

  useEffect(() => {
    if (state?.success) {
      router.push('/admin/students')
    }
  }, [state, router])

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-slate-700">
          Full Name
        </Label>
        <Input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={student?.full_name}
          required
          className="border-slate-300 bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Enter student's full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={student?.email}
          required
          className="border-slate-300 bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="student@mitsgwl.ac.in"
        />
        <p className="text-xs text-slate-500">Must use @mitsgwl.ac.in domain</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="enrollment_number" className="text-slate-700">
          Enrollment Number
        </Label>
        <Input
          id="enrollment_number"
          name="enrollment_number"
          type="text"
          defaultValue={student?.enrollment_number}
          className="border-slate-300 bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="e.g., 2024001"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="batch_id" className="text-slate-700">
          Batch
        </Label>
        <Select name="batch_id" defaultValue={student?.batch_id || ''}>
          <SelectTrigger className="border-slate-300 bg-white text-slate-900">
            <SelectValue placeholder="Select batch" />
          </SelectTrigger>
          <SelectContent className="border-slate-200 bg-white">
            <SelectItem value="">No batch assigned</SelectItem>
            {batches.map((batch) => (
              <SelectItem key={batch.id} value={batch.id}>
                {batch.batch_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!isEditing && (
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-700">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            minLength={6}
            className="border-slate-300 bg-white text-slate-900 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Minimum 6 characters"
          />
          <p className="text-xs text-slate-500">Leave empty for default password (student123)</p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : isEditing ? 'Update Student' : 'Create Student'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/admin/students')}
          className="border-slate-300 text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
