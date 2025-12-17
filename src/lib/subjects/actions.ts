'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Subject = {
  id: string
  code: string
  name: string
  credits: number
  theory_hours: number
  practical_hours: number
  created_at?: string
}

export async function getSubjects() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('code', { ascending: true })

  if (error) {
    console.error('Error fetching subjects:', error)
    throw new Error('Failed to fetch subjects')
  }

  return data as Subject[]
}

export async function createSubject(formData: FormData) {
  const supabase = await createClient()

  const code = formData.get('code') as string
  const name = formData.get('name') as string
  const credits = parseInt(formData.get('credits') as string)
  const theory_hours = parseInt(formData.get('theory_hours') as string)
  const practical_hours = parseInt(formData.get('practical_hours') as string)

  if (!code || !name || !credits || credits < 0 || theory_hours < 0 || practical_hours < 0) {
    throw new Error('Invalid subject data')
  }

  const { error } = await supabase
    .from('subjects')
    .insert({
      code,
      name,
      credits,
      theory_hours,
      practical_hours,
    })

  if (error) {
    console.error('Error creating subject:', error)
    throw new Error('Failed to create subject')
  }

  revalidatePath('/admin/subjects')
}

export async function updateSubject(id: string, formData: FormData) {
  const supabase = await createClient()

  const code = formData.get('code') as string
  const name = formData.get('name') as string
  const credits = parseInt(formData.get('credits') as string)
  const theory_hours = parseInt(formData.get('theory_hours') as string)
  const practical_hours = parseInt(formData.get('practical_hours') as string)

  if (!code || !name || !credits || credits < 0 || theory_hours < 0 || practical_hours < 0) {
    throw new Error('Invalid subject data')
  }

  const { error } = await supabase
    .from('subjects')
    .update({
      code,
      name,
      credits,
      theory_hours,
      practical_hours,
    })
    .eq('id', id)

  if (error) {
    console.error('Error updating subject:', error)
    throw new Error('Failed to update subject')
  }

  revalidatePath('/admin/subjects')
}

export async function deleteSubject(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting subject:', error)
    throw new Error('Failed to delete subject')
  }

  revalidatePath('/admin/subjects')
}
