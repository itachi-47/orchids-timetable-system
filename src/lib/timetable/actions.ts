'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { TimetableGenerator } from './generator'
import type { Batch, Conflict, Faculty, Room, Subject, TimetableSlot } from './types'

export async function generateTimetable(subjectFacultyMapping: Record<string, string[]>) {
  const supabase = await createClient()

  const [subjectsRes, facultyRes, roomsRes, batchesRes] = await Promise.all([
    supabase.from('subjects').select('*'),
    supabase.from('faculty').select('*'),
    supabase.from('rooms').select('*'),
    supabase.from('batches').select('*'),
  ])

  if (subjectsRes.error) throw subjectsRes.error
  if (facultyRes.error) throw facultyRes.error
  if (roomsRes.error) throw roomsRes.error
  if (batchesRes.error) throw batchesRes.error

  const subjects: Subject[] = subjectsRes.data
  const faculty: Faculty[] = facultyRes.data
  const rooms: Room[] = roomsRes.data
  const batches: Batch[] = batchesRes.data

  const subjectFacultyMap = new Map<string, string[]>(Object.entries(subjectFacultyMapping))

  const generator = new TimetableGenerator(subjects, faculty, rooms, batches, subjectFacultyMap)

  const timetableSlots = generator.generate()
  const conflicts = generator.getConflicts()

  await supabase
    .from('timetables')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')

  if (timetableSlots.length > 0) {
    const { error } = await supabase.from('timetables').insert(timetableSlots)
    if (error) throw error
  }

  revalidatePath('/admin/timetable')
  revalidatePath('/student')

  return {
    success: true,
    slotsGenerated: timetableSlots.length,
    conflicts: conflicts.length,
    conflictDetails: conflicts,
  }
}

export async function getTimetable(batchId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('timetables')
    .select(`
        *,
        subject:subjects(id, subject_code, subject_name, category, classes_per_week),
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

  revalidatePath('/admin/timetable')
  revalidatePath('/student')

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

type UpsertTimetableSlotInput = {
  id?: string
  batchId: string
  dayOfWeek: TimetableSlot['day_of_week']
  timeSlot: TimetableSlot['time_slot']
  subjectId: string | null
  facultyId: string | null
  roomId: string | null
}

export async function upsertTimetableSlot(input: UpsertTimetableSlotInput) {
  const supabase = await createClient()

  const subject_id = input.subjectId || null
  const faculty_id = input.facultyId || null
  const room_id = input.roomId || null

  // Treat "no subject" as clearing the slot.
  if (!subject_id) {
    if (input.id) {
      const { error } = await supabase.from('timetables').delete().eq('id', input.id)
      if (error) throw error
    } else {
      const { error } = await supabase
        .from('timetables')
        .delete()
        .eq('batch_id', input.batchId)
        .eq('day_of_week', input.dayOfWeek)
        .eq('time_slot', input.timeSlot)
      if (error) throw error
    }

    revalidatePath('/admin/timetable')
    revalidatePath('/student')

    return { success: true, cleared: true }
  }

  if (input.id) {
    const { error } = await supabase
      .from('timetables')
      .update({
        subject_id,
        faculty_id,
        room_id,
        is_lunch_break: false,
      })
      .eq('id', input.id)

    if (error) throw error
  } else {
    const { error } = await supabase.from('timetables').insert({
      subject_id,
      faculty_id,
      room_id,
      batch_id: input.batchId,
      day_of_week: input.dayOfWeek,
      time_slot: input.timeSlot,
      is_lunch_break: false,
    })

    if (error) throw error
  }

  revalidatePath('/admin/timetable')
  revalidatePath('/student')

  return { success: true }
}

type CheckConflictsInput = {
  slotId?: string
  batchId: string
  dayOfWeek: TimetableSlot['day_of_week']
  timeSlot: TimetableSlot['time_slot']
  facultyId: string | null
  roomId: string | null
}

export async function checkTimetableConflicts(input: CheckConflictsInput): Promise<Conflict[]> {
  const supabase = await createClient()

  const excludeId = input.slotId ?? '00000000-0000-0000-0000-000000000000'
  const conflicts: Conflict[] = []

  // Batch conflict (should rarely occur, but keeps data safe)
  {
    const { data, error } = await supabase
      .from('timetables')
      .select('id')
      .eq('batch_id', input.batchId)
      .eq('day_of_week', input.dayOfWeek)
      .eq('time_slot', input.timeSlot)
      .neq('id', excludeId)
      .neq('is_lunch_break', true)
      .limit(1)

    if (error) throw error

    if (data && data.length > 0) {
      conflicts.push({
        type: 'batch',
        message: 'This batch already has a class in this slot.',
        slot: {
          id: input.slotId,
          batch_id: input.batchId,
          day_of_week: input.dayOfWeek,
          time_slot: input.timeSlot,
          subject_id: null,
          faculty_id: null,
          room_id: null,
          is_lunch_break: false,
        },
      })
    }
  }

  if (input.facultyId) {
    const { data, error } = await supabase
      .from('timetables')
      .select('id, batch:batches(batch_name)')
      .eq('day_of_week', input.dayOfWeek)
      .eq('time_slot', input.timeSlot)
      .eq('faculty_id', input.facultyId)
      .neq('id', excludeId)
      .neq('is_lunch_break', true)

    if (error) throw error

    if (data && data.length > 0) {
      const batchNames = data
        .map((row: any) => row.batch?.batch_name)
        .filter(Boolean)
        .join(', ')

      conflicts.push({
        type: 'faculty',
        message: batchNames
          ? `Faculty is already assigned at this time (${batchNames}).`
          : 'Faculty is already assigned at this time.',
        slot: {
          id: input.slotId,
          batch_id: input.batchId,
          day_of_week: input.dayOfWeek,
          time_slot: input.timeSlot,
          subject_id: null,
          faculty_id: input.facultyId,
          room_id: null,
          is_lunch_break: false,
        },
      })
    }
  }

  if (input.roomId) {
    const { data, error } = await supabase
      .from('timetables')
      .select('id, batch:batches(batch_name)')
      .eq('day_of_week', input.dayOfWeek)
      .eq('time_slot', input.timeSlot)
      .eq('room_id', input.roomId)
      .neq('id', excludeId)
      .neq('is_lunch_break', true)

    if (error) throw error

    if (data && data.length > 0) {
      const batchNames = data
        .map((row: any) => row.batch?.batch_name)
        .filter(Boolean)
        .join(', ')

      conflicts.push({
        type: 'room',
        message: batchNames
          ? `Room is already booked at this time (${batchNames}).`
          : 'Room is already booked at this time.',
        slot: {
          id: input.slotId,
          batch_id: input.batchId,
          day_of_week: input.dayOfWeek,
          time_slot: input.timeSlot,
          subject_id: null,
          faculty_id: null,
          room_id: input.roomId,
          is_lunch_break: false,
        },
      })
    }
  }

  return conflicts
}
