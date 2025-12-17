'use server'

import { getDb } from '@/lib/mongodb/client'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { signToken, verifyToken, type TokenPayload } from '@/lib/auth/jwt'
import { cookies } from 'next/headers'
import { ObjectId } from 'mongodb'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const signupSchema = loginSchema.extend({
  fullName: z.string().min(2),
  role: z.enum(['admin', 'student']),
})

export type UserProfile = {
  id: string
  email: string
  full_name: string
  role: 'admin' | 'student'
  created_at?: string
}

export async function login(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const validated = loginSchema.safeParse(data)
  if (!validated.success) {
    return { error: 'Invalid email or password format' }
  }

  const db = await getDb()
  const user = await db.collection('users').findOne({ email: validated.data.email })

  if (!user) {
    return { error: 'Invalid credentials' }
  }

  const passwordMatch = await bcrypt.compare(validated.data.password, user.password || '')
  if (!passwordMatch) {
    return { error: 'Invalid credentials' }
  }

  const payload: TokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  }

  const token = signToken(payload)

  cookies().set({
    name: process.env.AUTH_COOKIE_NAME || 'token',
    value: token,
    httpOnly: true,
    path: '/',
    maxAge: Number(process.env.AUTH_COOKIE_MAX_AGE) || 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === 'production',
  })

  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: formData.get('fullName') as string,
    role: formData.get('role') as 'admin' | 'student',
  }

  const validated = signupSchema.safeParse(data)
  if (!validated.success) {
    return { error: 'Invalid form data' }
  }

  const db = await getDb()
  const existing = await db.collection('users').findOne({ email: validated.data.email })
  if (existing) {
    return { error: 'User already exists' }
  }

  const hashed = await bcrypt.hash(validated.data.password, 10)
  const id = new ObjectId().toHexString()

  await db.collection<UserProfile & { password: string }>('users').insertOne({
    id,
    email: validated.data.email,
    full_name: validated.data.fullName,
    role: validated.data.role,
    password: hashed,
    created_at: new Date().toISOString(),
  })

  redirect('/login?message=Account created')
}

export async function logout() {
  cookies().set({ name: process.env.AUTH_COOKIE_NAME || 'token', value: '', maxAge: 0, path: '/' })
  redirect('/login')
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const token = cookies().get(process.env.AUTH_COOKIE_NAME || 'token')?.value
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const db = await getDb()
  const userData = await db
    .collection<UserProfile>('users')
    .findOne({ id: payload.id }, { projection: { _id: 0, password: 0 } })

  return userData
}
