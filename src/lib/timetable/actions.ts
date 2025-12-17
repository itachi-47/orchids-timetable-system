'use server'

import { getDb } from '@/lib/mongodb/client'
import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { TimetableGenerator } from './generator'
import type { Batch, Conflict, Faculty, Room, Subject, TimetableEntry, TimetableSlot } from './types'

const DAY_ORDER: TimetableSlot['day_of_week'][] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const TIME_ORDER: TimetableSlot['time_slot'][] = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00',
]

function sortEntries(a: TimetableSlot, b: TimetableSlot) {
  const dayDiff = DAY_ORDER.indexOf(a.day_of_week) - DAY_ORDER.indexOf(b.day_of_week)
  if (dayDiff !== 0) return dayDiff
  return TIME_ORDER.indexOf(a.time_slot) - TIME_ORDER.indexOf(b.time_slot)
}

export async function generateTimetable(subjectFacultyMapping: Record<string, string[]>) {
  const db = await getDb()

  const [subjects, faculty, rooms, batches] = await Promise.all([
    db.collection<Subject>('subjects').find({}, { projection: { _id: 0 } }).toArray(),
    db.collection<Faculty>('faculty').find({}, { projection: { _id: 0 } }).toArray(),
    db.collection<Room>('rooms').find({}, { projection: { _id: 0 } }).toArray(),
    db.collection<Batch>('batches').find({}, { projection: { _id: 0 } }).toArray(),
  ])

  const subjectFacultyMap = new Map<string, string[]>(Object.entries(subjectFacultyMapping))

  const generator = new TimetableGenerator(subjects, faculty, rooms, batches, subjectFacultyMap)

  const timetableSlots = generator.generate()
  const conflicts = generator.getConflicts()

  await db.collection('timetables').deleteMany({})

  if (timetableSlots.length > 0) {
    await db.collection('timetables').insertMany(
      timetableSlots.map(slot => ({
        ...slot,
        id: randomUUID(),
        created_at: new Date().toISOString(),
      }))
    )
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

export async function getTimetable(batchId?: string): Promise<TimetableEntry[]> {
  const db = await getDb()

  const query = batchId ? { batch_id: batchId } : {}

  const [slots, subjects, faculty, rooms, batches] = await Promise.all([
    db
      .collection<TimetableSlot & { id: string }>('timetables')
      .find(query, { projection: { _id: 0 } })
      .toArray(),
    db.collection<Subject>('subjects').find({}, { projection: { _id: 0 } }).toArray(),
    db.collection<Faculty>('faculty').find({}, { projection: { _id: 0 } }).toArray(),
    db.collection<Room>('rooms').find({}, { projection: { _id: 0 } }).toArray(),
    db.collection<Batch>('batches').find({}, { projection: { _id: 0 } }).toArray(),
  ])

  const subjectMap = new Map(subjects.map(s => [s.id, s]))
  const facultyMap = new Map(faculty.map(f => [f.id, f]))
  const roomMap = new Map(rooms.map(r => [r.id, r]))
  const batchMap = new Map(batches.map(b => [b.id, b]))

  const entries: TimetableEntry[] = slots
    .map(slot => ({
      ...slot,
      subject: slot.subject_id ? subjectMap.get(slot.subject_id) : undefined,
      faculty: slot.faculty_id ? facultyMap.get(slot.faculty_id) : undefined,
      room: slot.room_id ? roomMap.get(slot.room_id) : undefined,
      batch: slot.batch_id ? batchMap.get(slot.batch_id) : undefined,
    }))
    .sort(sortEntries)

  return entries
}

export async function deleteTimetable() {
  const db = await getDb()

  await db.collection('timetables').deleteMany({})

  revalidatePath('/admin/timetable')
  revalidatePath('/student')

  return { success: true }
}

export async function getSubjectsWithFaculty() {
  const db = await getDb()

  const [subjects, faculty] = await Promise.all([
    db
      .collection<Subject>('subjects')
      .find({}, { projection: { _id: 0, id: 1, subject_code: 1, subject_name: 1, category: 1, classes_per_week: 1 } })
      .toArray(),
    db
      .collection<Faculty>('faculty')
      .find({}, { projection: { _id: 0, id: 1, faculty_name: 1, short_code: 1 } })
      .toArray(),
  ])

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
  const db = await getDb()

  const subject_id = input.subjectId || null
  const faculty_id = input.facultyId || null
  const room_id = input.roomId || null

  // Treat "no subject" as clearing the slot.
  if (!subject_id) {
    if (input.id) {
      await db.collection('timetables').deleteOne({ id: input.id })
    } else {
      await db.collection('timetables').deleteOne({
        batch_id: input.batchId,
        day_of_week: input.dayOfWeek,
        time_slot: input.timeSlot,
        is_lunch_break: { $ne: true },
      })
    }

    revalidatePath('/admin/timetable')
    revalidatePath('/student')

    return { success: true, cleared: true }
  }

  if (input.id) {
    await db.collection('timetables').updateOne(
      { id: input.id },
      {
        $set: {
          subject_id,
          faculty_id,
          room_id,
          is_lunch_break: false,
        },
      }
    )
  } else {
    await db.collection('timetables').insertOne({
      id: randomUUID(),
      subject_id,
      faculty_id,
      room_id,
      batch_id: input.batchId,
      day_of_week: input.dayOfWeek,
      time_slot: input.timeSlot,
      is_lunch_break: false,
      created_at: new Date().toISOString(),
    })
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

type ConflictTimetableDoc = {
  id: string
  batch_id: string
  faculty_id: string | null
  room_id: string | null
  day_of_week: TimetableSlot['day_of_week']
  time_slot: TimetableSlot['time_slot']
  is_lunch_break: boolean
}

export async function checkTimetableConflicts(input: CheckConflictsInput): Promise<Conflict[]> {
  const db = await getDb()

  const excludeId = input.slotId ?? '00000000-0000-0000-0000-000000000000'
  const conflicts: Conflict[] = []

  // Batch conflict (should rarely occur, but keeps data safe)
  {
    const existing = await db.collection<ConflictTimetableDoc>('timetables').findOne(
      {
        batch_id: input.batchId,
        day_of_week: input.dayOfWeek,
        time_slot: input.timeSlot,
        id: { $ne: excludeId },
        is_lunch_break: { $ne: true },
      },
      { projection: { _id: 0, id: 1 } }
    )

    if (existing) {
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
    const data = await db
      .collection<ConflictTimetableDoc>('timetables')
      .find(
        {
          day_of_week: input.dayOfWeek,
          time_slot: input.timeSlot,
          faculty_id: input.facultyId,
          id: { $ne: excludeId },
          is_lunch_break: { $ne: true },
        },
        { projection: { _id: 0, batch_id: 1 } }
      )
      .toArray()

    if (data.length > 0) {
      const batchIds = [...new Set(data.map(row => row.batch_id))]
      const batches = await db
        .collection<Batch>('batches')
        .find({ id: { $in: batchIds } }, { projection: { _id: 0, id: 1, batch_name: 1 } })
        .toArray()

      const batchMap = new Map(batches.map(b => [b.id, b.batch_name]))
      const batchNames = batchIds
        .map(id => batchMap.get(id))
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
    const data = await db
      .collection<ConflictTimetableDoc>('timetables')
      .find(
        {
          day_of_week: input.dayOfWeek,
          time_slot: input.timeSlot,
          room_id: input.roomId,
          id: { $ne: excludeId },
          is_lunch_break: { $ne: true },
        },
        { projection: { _id: 0, batch_id: 1 } }
      )
      .toArray()

    if (data.length > 0) {
      const batchIds = [...new Set(data.map(row => row.batch_id))]
      const batches = await db
        .collection<Batch>('batches')
        .find({ id: { $in: batchIds } }, { projection: { _id: 0, id: 1, batch_name: 1 } })
        .toArray()

      const batchMap = new Map(batches.map(b => [b.id, b.batch_name]))
      const batchNames = batchIds
        .map(id => batchMap.get(id))
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
