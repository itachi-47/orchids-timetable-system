'use server'

import { getDb } from '@/lib/mongodb/client'
import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'

export type Room = {
  id: string
  room_number: string
  created_at?: string
}

export type RoomInput = {
  room_number: string
}

export async function getRooms() {
  const db = await getDb()

  const data = await db
    .collection<Room>('rooms')
    .find({}, { projection: { _id: 0 } })
    .sort({ room_number: 1 })
    .toArray()

  return data
}

export async function getRoomById(id: string) {
  const db = await getDb()

  const room = await db.collection<Room>('rooms').findOne({ id }, { projection: { _id: 0 } })
  if (!room) throw new Error('Room not found')

  return room
}

export async function createRoom(input: RoomInput) {
  const room_number = input.room_number?.trim()
  if (!room_number) throw new Error('Invalid room data')

  const db = await getDb()
  await db.collection<Room>('rooms').insertOne({
    id: randomUUID(),
    room_number,
    created_at: new Date().toISOString(),
  })

  revalidatePath('/admin/rooms')
  revalidatePath('/admin/timetable')
  revalidatePath('/student')
}

export async function updateRoom(id: string, input: RoomInput) {
  const room_number = input.room_number?.trim()
  if (!room_number) throw new Error('Invalid room data')

  const db = await getDb()
  const res = await db.collection<Room>('rooms').updateOne({ id }, { $set: { room_number } })

  if (res.matchedCount === 0) throw new Error('Room not found')

  revalidatePath('/admin/rooms')
  revalidatePath('/admin/timetable')
  revalidatePath('/student')
}

export async function deleteRoom(id: string) {
  const db = await getDb()
  await db.collection<Room>('rooms').deleteOne({ id })

  revalidatePath('/admin/rooms')
  revalidatePath('/admin/timetable')
  revalidatePath('/student')
}
