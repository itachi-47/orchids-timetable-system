'use client'

import { Student, deleteStudent } from '@/lib/students/actions'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Edit, Trash2, User } from 'lucide-react'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

type Batch = {
  id: string
  batch_name: string
}

export function StudentList({ students, batches }: { students: Student[]; batches: Batch[] }) {
  const getBatchName = (batchId?: string) => {
    if (!batchId) return '-'
    const batch = batches.find(b => b.id === batchId)
    return batch?.batch_name || '-'
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="font-semibold text-slate-700">Name</TableHead>
            <TableHead className="font-semibold text-slate-700">Email</TableHead>
            <TableHead className="font-semibold text-slate-700">Enrollment No.</TableHead>
            <TableHead className="font-semibold text-slate-700">Batch</TableHead>
            <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-12 text-center">
                <User className="mx-auto mb-3 h-10 w-10 text-slate-300" />
                <p className="text-slate-500">No students found</p>
                <p className="text-sm text-slate-400">Add your first student to get started</p>
              </TableCell>
            </TableRow>
          ) : (
            students.map((student) => (
              <TableRow key={student.id} className="hover:bg-slate-50">
                <TableCell className="font-medium text-slate-900">{student.full_name}</TableCell>
                <TableCell className="text-slate-600">{student.email}</TableCell>
                <TableCell className="text-slate-600">{student.enrollment_number || '-'}</TableCell>
                <TableCell className="text-slate-600">{getBatchName(student.batch_id)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/students/${student.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="border-slate-200 bg-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-slate-900">Delete Student</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-600">
                            Are you sure you want to delete {student.full_name}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-slate-200 text-slate-700">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteStudent(student.id)}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
