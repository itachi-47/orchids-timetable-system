'use server'

import { getDb } from '@/lib/mongodb/client'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { signToken, verifyToken, type TokenPayload } from '@/lib/auth/jwt'
import { cookies } from 'next/headers'
import { ObjectId } from 'mongodb'
import type { UserRole } from '@/types'
import { getDashboardRoute } from './roles'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
})

export type UserProfile = {
  id: string
  email: string
  full_name: string
  role: UserRole
  department_id?: string
  is_coordinator?: boolean
  created_at?: string
}

function getRoleFromEmail(email: string): UserRole {
  const lowerEmail = email.toLowerCase()
  
  if (lowerEmail.endsWith('@mitsgwalior.in')) {
    if (lowerEmail.startsWith('admin') || lowerEmail.includes('.admin@')) {
      return 'admin'
    }
    return 'faculty'
  }
  
  if (lowerEmail.endsWith('@mitsgwl.ac.in')) {
    return 'student'
  }
  
  return 'student'
}

function validateEmailDomain(email: string): { valid: boolean; error?: string } {
  const lowerEmail = email.toLowerCase()
  
  if (lowerEmail.endsWith('@mitsgwalior.in') || lowerEmail.endsWith('@mitsgwl.ac.in')) {
    return { valid: true }
  }
  
  return { 
    valid: false, 
    error: 'Please use your institutional email (@mitsgwalior.in for faculty/admin or @mitsgwl.ac.in for students)' 
  }
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

  const cookieStore = await cookies()
  cookieStore.set({
    name: process.env.AUTH_COOKIE_NAME || 'token',
    value: token,
    httpOnly: true,
    path: '/',
    maxAge: Number(process.env.AUTH_COOKIE_MAX_AGE) || 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === 'production',
  })

  redirect(getDashboardRoute(user.role as UserRole))
}

export async function signup(prevState: { error?: string } | null, formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    fullName: formData.get('fullName') as string,
  }

  const validated = signupSchema.safeParse(data)
  if (!validated.success) {
    return { error: 'Invalid form data' }
  }

  // Validate email domain
  const emailValidation = validateEmailDomain(validated.data.email)
  if (!emailValidation.valid) {
    return { error: emailValidation.error }
  }

  // Determine role from email
  const role = getRoleFromEmail(validated.data.email)

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
    role,
    password: hashed,
    created_at: new Date().toISOString(),
  })

  redirect('/login?message=Account created')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set({ name: process.env.AUTH_COOKIE_NAME || 'token', value: '', maxAge: 0, path: '/' })
  cookieStore.set({ name: 'next-auth.session-token', value: '', maxAge: 0, path: '/' })
  cookieStore.set({ name: '__Secure-next-auth.session-token', value: '', maxAge: 0, path: '/' })
  redirect('/login')
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(process.env.AUTH_COOKIE_NAME || 'token')?.value
  
  if (token) {
    const payload = verifyToken(token)
    if (payload) {
      const db = await getDb()
      const userData = await db
        .collection<UserProfile>('users')
        .findOne({ id: payload.id }, { projection: { _id: 0, password: 0 } })
      return userData
    }
  }

  const { getServerSession } = await import('next-auth')
  const { authOptions } = await import('@/lib/auth/auth-options')
  const session = await getServerSession(authOptions)
  
  if (session?.user?.email) {
    const db = await getDb()
    const userData = await db
      .collection<UserProfile>('users')
      .findOne({ email: session.user.email.toLowerCase() }, { projection: { _id: 0, password: 0 } })
    return userData
  }

  return null
}
