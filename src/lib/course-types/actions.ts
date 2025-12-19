'use server'

import { getDb } from '@/lib/mongodb/client'
import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'

export type CourseType = {
  id: string
  course_type_name: string
  created_at?: string
}

export type CourseTypeInput = {
  course_type_name: string
}

export async function getCourseTypes() {
  const db = await getDb()

  const data = await db
    .collection<CourseType>('course_types')
    .find({}, { projection: { _id: 0 } })
    .sort({ course_type_name: 1 })
    .toArray()

  return data
}

export async function createCourseType(input: CourseTypeInput) {
  const course_type_name = input.course_type_name?.trim()
  if (!course_type_name) throw new Error('Invalid course type data')

  const db = await getDb()
  await db.collection<CourseType>('course_types').insertOne({
    id: randomUUID(),
    course_type_name,
    created_at: new Date().toISOString(),
  })

  revalidatePath('/admin/batches')
  revalidatePath('/coordinator/batches')
}

export async function deleteCourseType(id: string) {
  const db = await getDb()
  await db.collection<CourseType>('course_types').deleteOne({ id })

  revalidatePath('/admin/batches')
  revalidatePath('/coordinator/batches')
}
