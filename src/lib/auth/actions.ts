'use server'

import { createClient } from '@/lib/supabase/server'
import { getDb } from '@/lib/mongodb/client'
import { redirect } from 'next/navigation'
import { z } from 'zod'

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
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const validated = loginSchema.safeParse(data)
  if (!validated.success) {
    return { error: 'Invalid email or password format' }
  }

  const { error } = await supabase.auth.signInWithPassword(validated.data)

  if (error) {
    return { error: error.message }
  }

  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

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

  const { data: authData, error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
    options: {
      data: {
        full_name: validated.data.fullName,
        role: validated.data.role,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (authData.user) {
    const db = await getDb()

    await db.collection<UserProfile>('users').updateOne(
      { id: authData.user.id },
      {
        $set: {
          id: authData.user.id,
          email: validated.data.email,
          full_name: validated.data.fullName,
          role: validated.data.role,
          created_at: new Date().toISOString(),
        },
      },
      { upsert: true }
    )
  }

  redirect('/login?message=Check email to verify account')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  const db = await getDb()
  const userData = await db
    .collection<UserProfile>('users')
    .findOne({ id: user.id }, { projection: { _id: 0 } })

  return userData
}
