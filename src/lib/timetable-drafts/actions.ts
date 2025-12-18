'use server'

import { getDb } from '@/lib/mongodb/client'
import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import type { TimetableDraft, TimetableDraftSlot, TimetableStatus, ApprovalHistory, DayOfWeek, TimeSlot } from '@/types'
import { TimetableGenerator } from '@/lib/timetable/generator'
import type { Batch, Faculty, Room, Subject, TimetableSlot } from '@/lib/timetable/types'

export async function getTimetableDrafts(departmentId?: string): Promise<TimetableDraft[]> {
  const db = await getDb()
  const query = departmentId ? { department_id: departmentId } : {}
  const data = await db
    .collection<TimetableDraft>('timetable_drafts')
    .find(query, { projection: { _id: 0 } })
    .sort({ created_at: -1 })
    .toArray()
  return data
}

export async function getTimetableDraftById(id: string): Promise<TimetableDraft | null> {
  const db = await getDb()
  return db.collection<TimetableDraft>('timetable_drafts').findOne({ id }, { projection: { _id: 0 } })
}

export async function getTimetableDraftsByStatus(status: TimetableStatus, departmentId?: string): Promise<TimetableDraft[]> {
  const db = await getDb()
  const query: Record<string, unknown> = { status }
  if (departmentId) query.department_id = departmentId
  
  const data = await db
    .collection<TimetableDraft>('timetable_drafts')
    .find(query, { projection: { _id: 0 } })
    .sort({ submitted_at: -1, created_at: -1 })
    .toArray()
  return data
}

export type CreateDraftInput = {
  name: string
  department_id: string
  batch_id: string
  semester: string
  session: string
  created_by: string
}

export async function createTimetableDraft(input: CreateDraftInput): Promise<{ id: string }> {
  const db = await getDb()
  const id = randomUUID()
  const now = new Date().toISOString()

  await db.collection<TimetableDraft>('timetable_drafts').insertOne({
    id,
    name: input.name.trim(),
    department_id: input.department_id,
    batch_id: input.batch_id,
    semester: input.semester,
    session: input.session,
    status: 'DRAFT',
    created_by: input.created_by,
    created_at: now,
    updated_at: now,
  })

  revalidatePath('/coordinator')
  return { id }
}

export async function generateDraftTimetable(
  draftId: string,
  subjectFacultyMapping: Record<string, string[]>
) {
  const db = await getDb()

  const draft = await db.collection<TimetableDraft>('timetable_drafts').findOne({ id: draftId })
  if (!draft) throw new Error('Draft not found')
  if (draft.status !== 'DRAFT') throw new Error('Can only generate for DRAFT status')

  const [subjects, faculty, rooms, batches] = await Promise.all([
    db.collection<Subject>('subjects').find({}, { projection: { _id: 0 } }).toArray(),
    db.collection<Faculty>('faculty').find({}, { projection: { _id: 0 } }).toArray(),
    db.collection<Room>('rooms').find({}, { projection: { _id: 0 } }).toArray(),
    db.collection<Batch>('batches').find({ id: draft.batch_id }, { projection: { _id: 0 } }).toArray(),
  ])

  const subjectFacultyMap = new Map<string, string[]>(Object.entries(subjectFacultyMapping))
  const generator = new TimetableGenerator(subjects, faculty, rooms, batches, subjectFacultyMap)
  const timetableSlots = generator.generate()
  const conflicts = generator.getConflicts()

  await db.collection('timetable_draft_slots').deleteMany({ draft_id: draftId })

  if (timetableSlots.length > 0) {
    await db.collection<TimetableDraftSlot>('timetable_draft_slots').insertMany(
      timetableSlots.map(slot => ({
        id: randomUUID(),
        draft_id: draftId,
        subject_id: slot.subject_id,
        faculty_id: slot.faculty_id,
        room_id: slot.room_id,
        batch_id: slot.batch_id,
        day_of_week: slot.day_of_week as DayOfWeek,
        time_slot: slot.time_slot as TimeSlot,
        is_lunch_break: slot.is_lunch_break,
        created_at: new Date().toISOString(),
      }))
    )
  }

  await db.collection<TimetableDraft>('timetable_drafts').updateOne(
    { id: draftId },
    { $set: { updated_at: new Date().toISOString() } }
  )

  revalidatePath('/coordinator')
  return {
    success: true,
    slotsGenerated: timetableSlots.length,
    conflicts: conflicts.length,
    conflictDetails: conflicts,
  }
}

export async function getDraftSlots(draftId: string) {
  const db = await getDb()
  
  const [slots, subjects, faculty, rooms, batches] = await Promise.all([
    db.collection<TimetableDraftSlot>('timetable_draft_slots')
      .find({ draft_id: draftId }, { projection: { _id: 0 } })
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

  return slots.map(slot => ({
    ...slot,
    subject: slot.subject_id ? subjectMap.get(slot.subject_id) : undefined,
    faculty: slot.faculty_id ? facultyMap.get(slot.faculty_id) : undefined,
    room: slot.room_id ? roomMap.get(slot.room_id) : undefined,
    batch: slot.batch_id ? batchMap.get(slot.batch_id) : undefined,
  }))
}

export async function submitDraftForApproval(draftId: string, userId: string) {
  const db = await getDb()
  
  const draft = await db.collection<TimetableDraft>('timetable_drafts').findOne({ id: draftId })
  if (!draft) throw new Error('Draft not found')
  if (draft.status !== 'DRAFT' && draft.status !== 'REJECTED') {
    throw new Error('Can only submit DRAFT or REJECTED timetables')
  }

  const slots = await db.collection<TimetableDraftSlot>('timetable_draft_slots')
    .find({ draft_id: draftId })
    .toArray()
  if (slots.length === 0) throw new Error('Cannot submit empty timetable')

  await db.collection<TimetableDraft>('timetable_drafts').updateOne(
    { id: draftId },
    { 
      $set: { 
        status: 'SUBMITTED', 
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } 
    }
  )

  await db.collection<ApprovalHistory>('approval_history').insertOne({
    id: randomUUID(),
    draft_id: draftId,
    action: 'SUBMITTED',
    performed_by: userId,
    created_at: new Date().toISOString(),
  })

  revalidatePath('/coordinator')
  revalidatePath('/hod')
}

export async function approveTimetable(draftId: string, hodId: string, comments?: string) {
  const db = await getDb()
  
  const draft = await db.collection<TimetableDraft>('timetable_drafts').findOne({ id: draftId })
  if (!draft) throw new Error('Draft not found')
  if (draft.status !== 'SUBMITTED') throw new Error('Can only approve SUBMITTED timetables')

  const now = new Date().toISOString()

  await db.collection<TimetableDraft>('timetable_drafts').updateOne(
    { id: draftId },
    { 
      $set: { 
        status: 'APPROVED', 
        reviewed_by: hodId,
        reviewed_at: now,
        updated_at: now,
      } 
    }
  )

  await db.collection<ApprovalHistory>('approval_history').insertOne({
    id: randomUUID(),
    draft_id: draftId,
    action: 'APPROVED',
    performed_by: hodId,
    comments,
    created_at: now,
  })

  revalidatePath('/coordinator')
  revalidatePath('/hod')
  revalidatePath('/faculty')
  revalidatePath('/student')
}

export async function rejectTimetable(draftId: string, hodId: string, reason: string) {
  const db = await getDb()
  
  const draft = await db.collection<TimetableDraft>('timetable_drafts').findOne({ id: draftId })
  if (!draft) throw new Error('Draft not found')
  if (draft.status !== 'SUBMITTED') throw new Error('Can only reject SUBMITTED timetables')

  const now = new Date().toISOString()

  await db.collection<TimetableDraft>('timetable_drafts').updateOne(
    { id: draftId },
    { 
      $set: { 
        status: 'REJECTED', 
        reviewed_by: hodId,
        reviewed_at: now,
        rejection_reason: reason,
        updated_at: now,
      } 
    }
  )

  await db.collection<ApprovalHistory>('approval_history').insertOne({
    id: randomUUID(),
    draft_id: draftId,
    action: 'REJECTED',
    performed_by: hodId,
    comments: reason,
    created_at: now,
  })

  revalidatePath('/coordinator')
  revalidatePath('/hod')
}

export async function publishTimetable(draftId: string, hodId: string) {
  const db = await getDb()
  
  const draft = await db.collection<TimetableDraft>('timetable_drafts').findOne({ id: draftId })
  if (!draft) throw new Error('Draft not found')
  if (draft.status !== 'APPROVED') throw new Error('Can only publish APPROVED timetables')

  const draftSlots = await db.collection<TimetableDraftSlot>('timetable_draft_slots')
    .find({ draft_id: draftId }, { projection: { _id: 0 } })
    .toArray()

  await db.collection('timetables').deleteMany({ batch_id: draft.batch_id })

  if (draftSlots.length > 0) {
    await db.collection<TimetableSlot>('timetables').insertMany(
      draftSlots.map(slot => ({
        id: randomUUID(),
        subject_id: slot.subject_id,
        faculty_id: slot.faculty_id,
        room_id: slot.room_id,
        batch_id: slot.batch_id,
        day_of_week: slot.day_of_week,
        time_slot: slot.time_slot,
        is_lunch_break: slot.is_lunch_break,
        created_at: new Date().toISOString(),
      }))
    )
  }

  await db.collection<TimetableDraft>('timetable_drafts').updateOne(
    { id: draftId },
    { 
      $set: { 
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } 
    }
  )

  revalidatePath('/hod')
  revalidatePath('/faculty')
  revalidatePath('/student')
  revalidatePath('/admin/timetable')
}

export async function updateDraftSlot(input: {
  draftId: string
  slotId?: string
  batchId: string
  dayOfWeek: DayOfWeek
  timeSlot: TimeSlot
  subjectId: string | null
  facultyId: string | null
  roomId: string | null
}) {
  const db = await getDb()

  const draft = await db.collection<TimetableDraft>('timetable_drafts').findOne({ id: input.draftId })
  if (!draft) throw new Error('Draft not found')
  if (draft.status !== 'DRAFT' && draft.status !== 'REJECTED') {
    throw new Error('Can only edit DRAFT or REJECTED timetables')
  }

  if (!input.subjectId) {
    if (input.slotId) {
      await db.collection('timetable_draft_slots').deleteOne({ id: input.slotId })
    } else {
      await db.collection('timetable_draft_slots').deleteOne({
        draft_id: input.draftId,
        batch_id: input.batchId,
        day_of_week: input.dayOfWeek,
        time_slot: input.timeSlot,
        is_lunch_break: { $ne: true },
      })
    }

    revalidatePath('/coordinator')
    return { success: true, cleared: true }
  }

  if (input.slotId) {
    await db.collection('timetable_draft_slots').updateOne(
      { id: input.slotId },
      {
        $set: {
          subject_id: input.subjectId,
          faculty_id: input.facultyId,
          room_id: input.roomId,
          is_lunch_break: false,
        },
      }
    )
  } else {
    await db.collection<TimetableDraftSlot>('timetable_draft_slots').insertOne({
      id: randomUUID(),
      draft_id: input.draftId,
      subject_id: input.subjectId,
      faculty_id: input.facultyId,
      room_id: input.roomId,
      batch_id: input.batchId,
      day_of_week: input.dayOfWeek,
      time_slot: input.timeSlot,
      is_lunch_break: false,
      created_at: new Date().toISOString(),
    })
  }

  await db.collection<TimetableDraft>('timetable_drafts').updateOne(
    { id: input.draftId },
    { $set: { updated_at: new Date().toISOString() } }
  )

  revalidatePath('/coordinator')
  return { success: true }
}

export async function deleteDraft(draftId: string) {
  const db = await getDb()
  
  const draft = await db.collection<TimetableDraft>('timetable_drafts').findOne({ id: draftId })
  if (!draft) throw new Error('Draft not found')
  if (draft.status === 'APPROVED') throw new Error('Cannot delete approved timetables')

  await db.collection('timetable_draft_slots').deleteMany({ draft_id: draftId })
  await db.collection('approval_history').deleteMany({ draft_id: draftId })
  await db.collection<TimetableDraft>('timetable_drafts').deleteOne({ id: draftId })

  revalidatePath('/coordinator')
  revalidatePath('/hod')
}

export async function getApprovalHistory(draftId: string): Promise<ApprovalHistory[]> {
  const db = await getDb()
  return db.collection<ApprovalHistory>('approval_history')
    .find({ draft_id: draftId }, { projection: { _id: 0 } })
    .sort({ created_at: -1 })
    .toArray()
}

export async function getApprovedTimetables(departmentId?: string): Promise<TimetableDraft[]> {
  const db = await getDb()
  const query: Record<string, unknown> = { status: 'APPROVED' }
  if (departmentId) query.department_id = departmentId
  
  return db.collection<TimetableDraft>('timetable_drafts')
    .find(query, { projection: { _id: 0 } })
    .sort({ reviewed_at: -1 })
    .toArray()
}

export async function revokeApproval(draftId: string, userId: string, reason?: string) {
  const db = await getDb()
  
  const draft = await db.collection<TimetableDraft>('timetable_drafts').findOne({ id: draftId })
  if (!draft) throw new Error('Draft not found')
  if (draft.status !== 'APPROVED') throw new Error('Can only revoke APPROVED timetables')

  const now = new Date().toISOString()

  await db.collection<TimetableDraft>('timetable_drafts').updateOne(
    { id: draftId },
    { 
      $set: { 
        status: 'DRAFT', 
        reviewed_by: undefined,
        reviewed_at: undefined,
        updated_at: now,
      },
      $unset: {
        reviewed_by: '',
        reviewed_at: '',
      }
    }
  )

  await db.collection<ApprovalHistory>('approval_history').insertOne({
    id: randomUUID(),
    draft_id: draftId,
    action: 'MODIFIED',
    performed_by: userId,
    comments: reason || 'Approval revoked - sent back for editing',
    created_at: now,
  })

  revalidatePath('/coordinator')
  revalidatePath('/hod')
}

export async function unpublishTimetable(draftId: string, userId: string) {
  const db = await getDb()
  
  const draft = await db.collection<TimetableDraft>('timetable_drafts').findOne({ id: draftId })
  if (!draft) throw new Error('Draft not found')
  if (!draft.published_at) throw new Error('Timetable is not published')

  await db.collection('timetables').deleteMany({ batch_id: draft.batch_id })

  await db.collection<TimetableDraft>('timetable_drafts').updateOne(
    { id: draftId },
    { 
      $set: { 
        status: 'DRAFT',
        updated_at: new Date().toISOString(),
      },
      $unset: {
        published_at: '',
        reviewed_by: '',
        reviewed_at: '',
      }
    }
  )

  await db.collection<ApprovalHistory>('approval_history').insertOne({
    id: randomUUID(),
    draft_id: draftId,
    action: 'MODIFIED',
    performed_by: userId,
    comments: 'Timetable unpublished and sent back for editing',
    created_at: new Date().toISOString(),
  })

  revalidatePath('/coordinator')
  revalidatePath('/hod')
  revalidatePath('/faculty')
  revalidatePath('/student')
  revalidatePath('/admin/timetable')
}

export async function deleteApprovedTimetable(draftId: string, userId: string) {
  const db = await getDb()
  
  const draft = await db.collection<TimetableDraft>('timetable_drafts').findOne({ id: draftId })
  if (!draft) throw new Error('Draft not found')

  if (draft.published_at) {
    await db.collection('timetables').deleteMany({ batch_id: draft.batch_id })
  }

  await db.collection('timetable_draft_slots').deleteMany({ draft_id: draftId })
  await db.collection('approval_history').deleteMany({ draft_id: draftId })
  await db.collection<TimetableDraft>('timetable_drafts').deleteOne({ id: draftId })

  revalidatePath('/coordinator')
  revalidatePath('/hod')
  revalidatePath('/faculty')
  revalidatePath('/student')
  revalidatePath('/admin/timetable')
}
