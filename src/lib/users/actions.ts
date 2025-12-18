'use server'

import { getDb } from '@/lib/mongodb/client'
import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import type { UserRole } from '@/types'

export interface UserData {
  id: string
  email: string
  full_name: string
  role: UserRole
  department_id?: string
  is_coordinator?: boolean
  created_at?: string
}

export async function getUsers(): Promise<UserData[]> {
  const db = await getDb()
  const data = await db
    .collection<UserData>('users')
    .find({}, { projection: { _id: 0, password: 0 } })
    .sort({ full_name: 1 })
    .toArray()
  return data
}

export async function getUserById(id: string): Promise<UserData | null> {
  const db = await getDb()
  return db.collection<UserData>('users').findOne(
    { id }, 
    { projection: { _id: 0, password: 0 } }
  )
}

export async function getUsersByRole(role: UserRole): Promise<UserData[]> {
  const db = await getDb()
  return db.collection<UserData>('users')
    .find({ role }, { projection: { _id: 0, password: 0 } })
    .sort({ full_name: 1 })
    .toArray()
}

export async function getUsersByDepartment(departmentId: string): Promise<UserData[]> {
  const db = await getDb()
  return db.collection<UserData>('users')
    .find({ department_id: departmentId }, { projection: { _id: 0, password: 0 } })
    .sort({ full_name: 1 })
    .toArray()
}

export async function getFacultyUsers(): Promise<UserData[]> {
  const db = await getDb()
  return db.collection<UserData>('users')
    .find({ role: { $in: ['faculty', 'hod', 'timetable_coordinator'] } }, { projection: { _id: 0, password: 0 } })
    .sort({ full_name: 1 })
    .toArray()
}

export type CreateUserInput = {
  email: string
  full_name: string
  password: string
  role: UserRole
  department_id?: string
}

export async function createUser(input: CreateUserInput) {
  const db = await getDb()
  
  const existing = await db.collection('users').findOne({ email: input.email.toLowerCase() })
  if (existing) throw new Error('User with this email already exists')

  const hashed = await bcrypt.hash(input.password, 10)
  const id = randomUUID()

  await db.collection<UserData & { password: string }>('users').insertOne({
    id,
    email: input.email.toLowerCase(),
    full_name: input.full_name.trim(),
    role: input.role,
    department_id: input.department_id,
    password: hashed,
    created_at: new Date().toISOString(),
  })

  revalidatePath('/admin/users')
  return { id }
}

export async function updateUser(id: string, input: Partial<CreateUserInput>) {
  const db = await getDb()
  
  const updateData: Record<string, unknown> = {}
  
  if (input.email) {
    const existing = await db.collection('users').findOne({ 
      email: input.email.toLowerCase(),
      id: { $ne: id }
    })
    if (existing) throw new Error('Email already in use')
    updateData.email = input.email.toLowerCase()
  }
  
  if (input.full_name) updateData.full_name = input.full_name.trim()
  if (input.role) updateData.role = input.role
  if (input.department_id !== undefined) updateData.department_id = input.department_id || null
  if (input.password) updateData.password = await bcrypt.hash(input.password, 10)

  const res = await db.collection('users').updateOne({ id }, { $set: updateData })
  if (res.matchedCount === 0) throw new Error('User not found')

  revalidatePath('/admin/users')
}

export async function updateUserRole(id: string, role: UserRole, departmentId?: string) {
  const db = await getDb()
  
  const updateData: Record<string, unknown> = { role }
  if (departmentId !== undefined) {
    updateData.department_id = departmentId || null
  }
  if (role === 'timetable_coordinator') {
    updateData.is_coordinator = true
  } else {
    updateData.is_coordinator = false
  }

  const res = await db.collection('users').updateOne({ id }, { $set: updateData })
  if (res.matchedCount === 0) throw new Error('User not found')

  revalidatePath('/admin/users')
  revalidatePath('/admin/departments')
}

export async function deleteUser(id: string) {
  const db = await getDb()
  
  await db.collection('departments').updateMany(
    { $or: [{ hod_id: id }, { coordinator_id: id }] },
    { $unset: { hod_id: '', coordinator_id: '' } }
  )
  
  await db.collection('users').deleteOne({ id })

  revalidatePath('/admin/users')
  revalidatePath('/admin/departments')
}

export async function searchUsers(query: string): Promise<UserData[]> {
  const db = await getDb()
  return db.collection<UserData>('users')
    .find({
      $or: [
        { full_name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ]
    }, { projection: { _id: 0, password: 0 } })
    .limit(20)
    .toArray()
}
