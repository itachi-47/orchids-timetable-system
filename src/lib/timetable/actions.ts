'use server'

import { createClient } from '@/lib/supabase/server'
import { TimetableGenerator } from './generator'
import { Subject, Faculty, Room, Batch, TimetableSlot } from './types'

export async function generateTimetable(subjectFacultyMapping: Record<string, string[]>) {
  const supabase = await createClient()

  const [subjectsRes, facultyRes, roomsRes, batchesRes] = await Promise.all([
    supabase.from('subjects').select('*'),
    supabase.from('faculty').select('*'),
    supabase.from('rooms').select('*'),
    supabase.from('batches').select('*')
  ])

  if (subjectsRes.error) throw subjectsRes.error
  if (facultyRes.error) throw facultyRes.error
  if (roomsRes.error) throw roomsRes.error
  if (batchesRes.error) throw batchesRes.error

  const subjects: Subject[] = subjectsRes.data
  const faculty: Faculty[] = facultyRes.data
  const rooms: Room[] = roomsRes.data
  const batches: Batch[] = batchesRes.data

  const subjectFacultyMap = new Map<string, string[]>(
    Object.entries(subjectFacultyMapping)
  )

  const generator = new TimetableGenerator(
    subjects,
    faculty,
    rooms,
    batches,
    subjectFacultyMap
  )

  const timetableSlots = generator.generate()
  const conflicts = generator.getConflicts()

  await supabase.from('timetables').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  if (timetableSlots.length > 0) {
    const { error } = await supabase.from('timetables').insert(timetableSlots)
    if (error) throw error
  }

  return {
    success: true,
    slotsGenerated: timetableSlots.length,
    conflicts: conflicts.length,
    conflictDetails: conflicts
  }
}

export async function getTimetable(batchId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('timetables')
    .select(`
      *,
      subject:subjects(id, subject_code, subject_name, category),
      faculty:faculty(id, faculty_name, short_code),
      room:rooms(id, room_number),
      batch:batches(id, batch_name)
    `)
    .order('day_of_week')
    .order('time_slot')

  if (batchId) {
    query = query.eq('batch_id', batchId)
  }

  const { data, error } = await query

  if (error) throw error

  return data
}

export async function deleteTimetable() {
  const supabase = await createClient()

  const { error } = await supabase
    .from('timetables')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (error) throw error

  return { success: true }
}

export async function getSubjectsWithFaculty() {
  const supabase = await createClient()

  const { data: subjects, error } = await supabase
    .from('subjects')
    .select('id, subject_code, subject_name, category, classes_per_week')

  if (error) throw error

  const { data: faculty, error: facultyError } = await supabase
    .from('faculty')
    .select('id, faculty_name, short_code')

  if (facultyError) throw facultyError

  return { subjects, faculty }
}
