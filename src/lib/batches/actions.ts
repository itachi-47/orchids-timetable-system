'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Batch = {
  id: string
  batch_name: string
  created_at: string
}

export type BatchInput = {
  batch_name: string
}

export async function getBatches() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('batches')
    .select('*')
    .order('batch_name', { ascending: true })

  if (error) throw error
  return data as Batch[]
}

export async function createBatch(input: BatchInput) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('batches')
    .insert(input)

  if (error) throw error
  revalidatePath('/admin/batches')
}

export async function deleteBatch(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('batches')
    .delete()
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/batches')
}
