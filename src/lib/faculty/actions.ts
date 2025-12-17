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

export type FacultyWorkload = {
  id: string
  faculty_name: string
  short_code: string
  weekly_hours: number
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
  const { data, error } = await supabase.from('faculty').select('*').eq('id', id).single()

  if (error) throw error
  return data as Faculty
}

export async function createFaculty(input: FacultyInput) {
  const supabase = await createClient()
  const { error } = await supabase.from('faculty').insert(input)

  if (error) throw error
  revalidatePath('/admin/faculty')
}

export async function updateFaculty(id: string, input: FacultyInput) {
  const supabase = await createClient()
  const { error } = await supabase.from('faculty').update(input).eq('id', id)

  if (error) throw error
  revalidatePath('/admin/faculty')
}

export async function deleteFaculty(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('faculty').delete().eq('id', id)

  if (error) throw error
  revalidatePath('/admin/faculty')
}

export async function getFacultyWorkload(): Promise<FacultyWorkload[]> {
  const supabase = await createClient()

  const [{ data: faculty, error: facultyError }, { data: slots, error: slotsError }] =
    await Promise.all([
      supabase.from('faculty').select('id, faculty_name, short_code').order('faculty_name'),
      supabase
        .from('timetables')
        .select('faculty_id, is_lunch_break')
        .not('faculty_id', 'is', null)
        .neq('is_lunch_break', true),
    ])

  if (facultyError) throw facultyError
  if (slotsError) throw slotsError

  const counts = new Map<string, number>()
  for (const row of slots ?? []) {
    const id = (row as any).faculty_id as string | null
    if (!id) continue
    counts.set(id, (counts.get(id) ?? 0) + 1)
  }

  const result: FacultyWorkload[] = (faculty ?? []).map((f: any) => ({
    id: f.id,
    faculty_name: f.faculty_name,
    short_code: f.short_code,
    weekly_hours: counts.get(f.id) ?? 0,
  }))

  result.sort((a, b) => b.weekly_hours - a.weekly_hours)

  return result
}
