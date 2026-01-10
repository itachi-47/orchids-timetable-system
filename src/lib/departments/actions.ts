'use server'

import { getDb } from '@/lib/mongodb/client'
import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import type { Department } from '@/types'

export async function getDepartments(): Promise<Department[]> {
  try {
    const db = await getDb()
    const data = await db
      .collection<Department>('departments')
      .find({}, { projection: { _id: 0 } })
      .sort({ name: 1 })
      .toArray()
    return data || []
  } catch (error) {
    console.error('Error fetching departments:', error)
    return []
  }
}

export async function getDepartmentById(id: string): Promise<Department | null> {
  const db = await getDb()
  const dept = await db
    .collection<Department>('departments')
    .findOne({ id }, { projection: { _id: 0 } })
  return dept
}

export type DepartmentInput = {
  name: string
  code: string
  hod_id?: string
  coordinator_id?: string
}

export async function createDepartment(input: DepartmentInput) {
  const name = input.name?.trim()
  const code = input.code?.trim().toUpperCase()

  if (!name || !code) throw new Error('Department name and code are required')

  const db = await getDb()
  
  const existing = await db.collection<Department>('departments').findOne({ code })
  if (existing) throw new Error('Department with this code already exists')

  const id = randomUUID()
  await db.collection<Department>('departments').insertOne({
    id,
    name,
    code,
    hod_id: input.hod_id || undefined,
    coordinator_id: input.coordinator_id || undefined,
    created_at: new Date().toISOString(),
  })

  revalidatePath('/admin/departments')
  return { id }
}

export async function updateDepartment(id: string, input: DepartmentInput) {
  const name = input.name?.trim()
  const code = input.code?.trim().toUpperCase()

  if (!name || !code) throw new Error('Department name and code are required')

  const db = await getDb()
  
  const existing = await db.collection<Department>('departments').findOne({ code, id: { $ne: id } })
  if (existing) throw new Error('Another department with this code already exists')

  const res = await db
    .collection<Department>('departments')
    .updateOne({ id }, { $set: { name, code, hod_id: input.hod_id, coordinator_id: input.coordinator_id } })

  if (res.matchedCount === 0) throw new Error('Department not found')

  revalidatePath('/admin/departments')
}

export async function deleteDepartment(id: string) {
  const db = await getDb()
  await db.collection<Department>('departments').deleteOne({ id })
  revalidatePath('/admin/departments')
}

export async function assignHOD(departmentId: string, userId: string) {
  const db = await getDb()
  
  await db.collection('users').updateOne(
    { id: userId },
    { $set: { role: 'hod', department_id: departmentId } }
  )
  
  await db.collection<Department>('departments').updateOne(
    { id: departmentId },
    { $set: { hod_id: userId } }
  )

  revalidatePath('/admin/departments')
  revalidatePath('/admin/users')
}

export async function assignCoordinator(departmentId: string, userId: string) {
  const db = await getDb()
  
  await db.collection('users').updateOne(
    { id: userId },
    { $set: { role: 'timetable_coordinator', department_id: departmentId, is_coordinator: true } }
  )
  
  await db.collection<Department>('departments').updateOne(
    { id: departmentId },
    { $set: { coordinator_id: userId } }
  )

  revalidatePath('/admin/departments')
  revalidatePath('/admin/users')
}

export async function removeHOD(departmentId: string) {
  const db = await getDb()
  
  const dept = await db.collection<Department>('departments').findOne({ id: departmentId })
  if (dept?.hod_id) {
    await db.collection('users').updateOne(
      { id: dept.hod_id },
      { $set: { role: 'faculty' }, $unset: { department_id: '' } }
    )
  }
  
  await db.collection<Department>('departments').updateOne(
    { id: departmentId },
    { $unset: { hod_id: '' } }
  )

  revalidatePath('/admin/departments')
  revalidatePath('/admin/users')
}

export async function removeCoordinator(departmentId: string) {
  const db = await getDb()
  
  const dept = await db.collection<Department>('departments').findOne({ id: departmentId })
  if (dept?.coordinator_id) {
    await db.collection('users').updateOne(
      { id: dept.coordinator_id },
      { $set: { role: 'faculty', is_coordinator: false } }
    )
  }
  
  await db.collection<Department>('departments').updateOne(
    { id: departmentId },
    { $unset: { coordinator_id: '' } }
  )

  revalidatePath('/admin/departments')
  revalidatePath('/admin/users')
}
