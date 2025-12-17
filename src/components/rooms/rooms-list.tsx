'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { deleteRoom, type Room } from '@/lib/rooms/actions'

type RoomsListProps = {
  rooms: Room[]
}

export function RoomsList({ rooms }: RoomsListProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this room?')) return

    setDeleting(id)
    try {
      await deleteRoom(id)
      router.refresh()
    } catch (error) {
      console.error('Error deleting room:', error)
      alert('Failed to delete room')
    } finally {
      setDeleting(null)
    }
  }

  if (rooms.length === 0) {
    return (
      <Card className="border-slate-700 bg-slate-800/50">
        <CardContent className="p-8 text-center text-slate-400">
          No rooms found. Click "Add Room" to create one.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {rooms.map((room) => (
        <Card key={room.id} className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle className="text-slate-50">Room {room.room_number}</CardTitle>
            <CardDescription className="text-slate-400">ID: {room.id.slice(0, 8)}</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/admin/rooms/${room.id}/edit`)}
              className="border-slate-600 text-slate-200 hover:bg-slate-700"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(room.id)}
              disabled={deleting === room.id}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {deleting === room.id ? 'Deleting...' : 'Delete'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
