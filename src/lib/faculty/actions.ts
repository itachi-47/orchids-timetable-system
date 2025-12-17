'use server'

import { getDb } from '@/lib/mongodb/client'
import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'

export type Faculty = {
  id: string
  faculty_name: string
  short_code: string
  created_at?: string
}

export type FacultyInput = {
  faculty_name: string
  short_code: string
}

export type FacultyWorkload = {
  id: string
  faculty_name: string
  short_code: string
  weekly_hours: number
}

export async function getFaculty() {
  const db = await getDb()
  const data = await db
    .collection<Faculty>('faculty')
    .find({}, { projection: { _id: 0 } })
    .sort({ faculty_name: 1 })
    .toArray()

  return data
}

export async function getFacultyById(id: string) {
  const db = await getDb()

  const faculty = await db
    .collection<Faculty>('faculty')
    .findOne({ id }, { projection: { _id: 0 } })

  if (!faculty) throw new Error('Faculty not found')
  return faculty
}

export async function createFaculty(input: FacultyInput) {
  const faculty_name = input.faculty_name?.trim()
  const short_code = input.short_code?.trim()

  if (!faculty_name || !short_code) throw new Error('Invalid faculty data')

  const db = await getDb()
  await db.collection<Faculty>('faculty').insertOne({
    id: randomUUID(),
    faculty_name,
    short_code,
    created_at: new Date().toISOString(),
  })

  revalidatePath('/admin/faculty')
  revalidatePath('/admin/timetable')
  revalidatePath('/student')
}

export async function updateFaculty(id: string, input: FacultyInput) {
  const faculty_name = input.faculty_name?.trim()
  const short_code = input.short_code?.trim()

  if (!faculty_name || !short_code) throw new Error('Invalid faculty data')

  const db = await getDb()
  const res = await db
    .collection<Faculty>('faculty')
    .updateOne({ id }, { $set: { faculty_name, short_code } })

  if (res.matchedCount === 0) throw new Error('Faculty not found')

  revalidatePath('/admin/faculty')
  revalidatePath('/admin/timetable')
  revalidatePath('/student')
}

export async function deleteFaculty(id: string) {
  const db = await getDb()
  await db.collection<Faculty>('faculty').deleteOne({ id })

  revalidatePath('/admin/faculty')
  revalidatePath('/admin/timetable')
  revalidatePath('/student')
}

type TimetableFacultySlot = {
  faculty_id: string | null
  is_lunch_break: boolean
}

export async function getFacultyWorkload(): Promise<FacultyWorkload[]> {
  const db = await getDb()

  const [faculty, slots] = await Promise.all([
    db
      .collection<Faculty>('faculty')
      .find({}, { projection: { _id: 0 } })
      .sort({ faculty_name: 1 })
      .toArray(),
    db
      .collection<TimetableFacultySlot>('timetables')
      .find(
        {
          faculty_id: { $ne: null },
          is_lunch_break: { $ne: true },
        },
        { projection: { _id: 0, faculty_id: 1 } }
      )
      .toArray(),
  ])

  const counts = new Map<string, number>()
  for (const row of slots) {
    if (!row.faculty_id) continue
    counts.set(row.faculty_id, (counts.get(row.faculty_id) ?? 0) + 1)
  }

  const result: FacultyWorkload[] = faculty.map(f => ({
    id: f.id,
    faculty_name: f.faculty_name,
    short_code: f.short_code,
    weekly_hours: counts.get(f.id) ?? 0,
  }))

  result.sort((a, b) => b.weekly_hours - a.weekly_hours)

  return result
}
