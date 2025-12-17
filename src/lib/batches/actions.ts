'use server'

import { getDb } from '@/lib/mongodb/client'
import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'

export type Batch = {
  id: string
  batch_name: string
  created_at?: string
}

export type BatchInput = {
  batch_name: string
}

export async function getBatches() {
  const db = await getDb()
  const data = await db
    .collection<Batch>('batches')
    .find({}, { projection: { _id: 0 } })
    .sort({ batch_name: 1 })
    .toArray()

  return data
}

export async function createBatch(input: BatchInput) {
  const batch_name = input.batch_name?.trim()
  if (!batch_name) throw new Error('Invalid batch data')

  const db = await getDb()
  await db.collection<Batch>('batches').insertOne({
    id: randomUUID(),
    batch_name,
    created_at: new Date().toISOString(),
  })

  revalidatePath('/admin/batches')
  revalidatePath('/admin/timetable')
  revalidatePath('/student')
}

export async function deleteBatch(id: string) {
  const db = await getDb()
  await db.collection<Batch>('batches').deleteOne({ id })

  revalidatePath('/admin/batches')
  revalidatePath('/admin/timetable')
  revalidatePath('/student')
}
