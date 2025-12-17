'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createRoom, updateRoom, type Room } from '@/lib/rooms/actions'

type RoomFormProps = {
  room?: Room
  mode: 'create' | 'edit'
}

export function RoomForm({ room, mode }: RoomFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    room_number: room?.room_number || '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'create') {
        await createRoom(formData)
      } else {
        await updateRoom(room!.id, formData)
      }
      router.push('/admin/rooms')
      router.refresh()
    } catch (error) {
      console.error('Error saving room:', error)
      alert('Failed to save room')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto border-slate-700 bg-slate-800/50">
      <CardHeader>
        <CardTitle className="text-slate-50">
          {mode === 'create' ? 'Add New Room' : 'Edit Room'}
        </CardTitle>
        <CardDescription className="text-slate-400">
          {mode === 'create' ? 'Create a new room' : 'Update room details'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="room_number" className="text-slate-200">Room Number</Label>
            <Input
              id="room_number"
              value={formData.room_number}
              onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
              required
              className="border-slate-600 bg-slate-900 text-slate-50"
              placeholder="e.g., 101, A-305"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create Room' : 'Update Room'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => router.push('/admin/rooms')}
              className="border-slate-600 text-slate-200 hover:bg-slate-800"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
