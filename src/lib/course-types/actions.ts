'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type CourseType = {
  id: string
  course_type_name: string
  created_at: string
}

export type CourseTypeInput = {
  course_type_name: string
}

export async function getCourseTypes() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('course_types')
    .select('*')
    .order('course_type_name', { ascending: true })

  if (error) throw error
  return data as CourseType[]
}

export async function createCourseType(input: CourseTypeInput) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('course_types')
    .insert(input)

  if (error) throw error
  revalidatePath('/admin/batches')
}

export async function deleteCourseType(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('course_types')
    .delete()
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/batches')
}
