'use server'

import { getDb } from '@/lib/mongodb/client'
import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'

export type Subject = {
  id: string
  subject_code: string
  subject_name: string
  category: string
  classes_per_week: number
  created_at?: string
}

export async function getSubjects() {
  const db = await getDb()

  const data = await db
    .collection<Subject>('subjects')
    .find({}, { projection: { _id: 0 } })
    .sort({ subject_code: 1 })
    .toArray()

  return data
}

export async function getSubjectById(id: string) {
  const db = await getDb()

  const subject = await db
    .collection<Subject>('subjects')
    .findOne({ id }, { projection: { _id: 0 } })

  return subject
}

export async function createSubject(formData: FormData) {
  const subject_code = (formData.get('subject_code') as string) || ''
  const subject_name = (formData.get('subject_name') as string) || ''
  const category = (formData.get('category') as string) || ''
  const classes_per_week = parseInt((formData.get('classes_per_week') as string) || '', 10)

  if (!subject_code.trim() || !subject_name.trim() || !category.trim() || Number.isNaN(classes_per_week)) {
    throw new Error('Invalid subject data')
  }

  const db = await getDb()

  await db.collection<Subject>('subjects').insertOne({
    id: randomUUID(),
    subject_code: subject_code.trim(),
    subject_name: subject_name.trim(),
    category: category.trim(),
    classes_per_week: Math.max(0, classes_per_week),
    created_at: new Date().toISOString(),
  })

  revalidatePath('/admin/subjects')
  revalidatePath('/admin/timetable')
  revalidatePath('/student')
}

export async function updateSubject(id: string, formData: FormData) {
  const subject_code = (formData.get('subject_code') as string) || ''
  const subject_name = (formData.get('subject_name') as string) || ''
  const category = (formData.get('category') as string) || ''
  const classes_per_week = parseInt((formData.get('classes_per_week') as string) || '', 10)

  if (!subject_code.trim() || !subject_name.trim() || !category.trim() || Number.isNaN(classes_per_week)) {
    throw new Error('Invalid subject data')
  }

  const db = await getDb()

  const res = await db.collection<Subject>('subjects').updateOne(
    { id },
    {
      $set: {
        subject_code: subject_code.trim(),
        subject_name: subject_name.trim(),
        category: category.trim(),
        classes_per_week: Math.max(0, classes_per_week),
      },
    }
  )

  if (res.matchedCount === 0) {
    throw new Error('Subject not found')
  }

  revalidatePath('/admin/subjects')
  revalidatePath('/admin/timetable')
  revalidatePath('/student')
}

export async function deleteSubject(id: string) {
  const db = await getDb()

  await db.collection<Subject>('subjects').deleteOne({ id })

  revalidatePath('/admin/subjects')
  revalidatePath('/admin/timetable')
  revalidatePath('/student')
}
