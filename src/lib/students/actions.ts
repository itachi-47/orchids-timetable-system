'use server'

import { getDb } from '@/lib/mongodb/client'
import { ObjectId } from 'mongodb'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

export type Student = {
  id: string
  email: string
  full_name: string
  role: 'student'
  batch_id?: string
  enrollment_number?: string
  created_at: string
}

const studentSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(2),
  batch_id: z.string().optional(),
  enrollment_number: z.string().optional(),
  password: z.string().min(6).optional(),
})

export async function getStudents(): Promise<Student[]> {
  const db = await getDb()
  const students = await db
    .collection('users')
    .find({ role: 'student' })
    .project({ _id: 0, password: 0 })
    .sort({ created_at: -1 })
    .toArray()
  
  return students as Student[]
}

export async function getStudentById(id: string): Promise<Student | null> {
  const db = await getDb()
  const student = await db
    .collection('users')
    .findOne({ id, role: 'student' }, { projection: { _id: 0, password: 0 } })
  
  return student as Student | null
}

export async function createStudent(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    full_name: formData.get('full_name') as string,
    batch_id: formData.get('batch_id') as string || undefined,
    enrollment_number: formData.get('enrollment_number') as string || undefined,
    password: formData.get('password') as string,
  }

  const validated = studentSchema.safeParse(data)
  if (!validated.success) {
    return { error: 'Invalid form data' }
  }

  const db = await getDb()
  
  const existing = await db.collection('users').findOne({ email: validated.data.email })
  if (existing) {
    return { error: 'A user with this email already exists' }
  }

  const id = new ObjectId().toHexString()
  const hashedPassword = validated.data.password 
    ? await bcrypt.hash(validated.data.password, 10)
    : await bcrypt.hash('student123', 10)

  await db.collection('users').insertOne({
    id,
    email: validated.data.email,
    full_name: validated.data.full_name,
    role: 'student',
    batch_id: validated.data.batch_id,
    enrollment_number: validated.data.enrollment_number,
    password: hashedPassword,
    created_at: new Date().toISOString(),
  })

  revalidatePath('/admin/students')
  return { success: true }
}

export async function updateStudent(id: string, formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    full_name: formData.get('full_name') as string,
    batch_id: formData.get('batch_id') as string || undefined,
    enrollment_number: formData.get('enrollment_number') as string || undefined,
  }

  const validated = studentSchema.omit({ password: true }).safeParse(data)
  if (!validated.success) {
    return { error: 'Invalid form data' }
  }

  const db = await getDb()
  
  const existing = await db.collection('users').findOne({ 
    email: validated.data.email, 
    id: { $ne: id } 
  })
  if (existing) {
    return { error: 'A user with this email already exists' }
  }

  await db.collection('users').updateOne(
    { id, role: 'student' },
    {
      $set: {
        email: validated.data.email,
        full_name: validated.data.full_name,
        batch_id: validated.data.batch_id,
        enrollment_number: validated.data.enrollment_number,
      },
    }
  )

  revalidatePath('/admin/students')
  return { success: true }
}

export async function deleteStudent(id: string) {
  const db = await getDb()
  await db.collection('users').deleteOne({ id, role: 'student' })
  revalidatePath('/admin/students')
  return { success: true }
}
