'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Faculty = {
  id: string
  faculty_name: string
  short_code: string
  created_at: string
}

export type FacultyInput = {
  faculty_name: string
  short_code: string
}

export async function getFaculty() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .order('faculty_name', { ascending: true })

  if (error) throw error
  return data as Faculty[]
}

export async function getFacultyById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('faculty')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Faculty
}

export async function createFaculty(input: FacultyInput) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('faculty')
    .insert(input)

  if (error) throw error
  revalidatePath('/admin/faculty')
}

export async function updateFaculty(id: string, input: FacultyInput) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('faculty')
    .update(input)
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/faculty')
}

export async function deleteFaculty(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('faculty')
    .delete()
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/faculty')
}
