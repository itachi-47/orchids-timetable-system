'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Room = {
  id: string
  room_number: string
  created_at: string
}

export type RoomInput = {
  room_number: string
}

export async function getRooms() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('room_number', { ascending: true })

  if (error) throw error
  return data as Room[]
}

export async function getRoomById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Room
}

export async function createRoom(input: RoomInput) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('rooms')
    .insert(input)

  if (error) throw error
  revalidatePath('/admin/rooms')
}

export async function updateRoom(id: string, input: RoomInput) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('rooms')
    .update(input)
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/rooms')
}

export async function deleteRoom(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', id)

  if (error) throw error
  revalidatePath('/admin/rooms')
}
