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
  isAdmin?: boolean
}

export function RoomForm({ room, mode, isAdmin = true }: RoomFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const basePath = isAdmin ? '/admin' : '/coordinator'
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
      router.push(`${basePath}/rooms`)
      router.refresh()
    } catch (error) {
      console.error('Error saving room:', error)
      alert('Failed to save room')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">
          {mode === 'create' ? 'Add New Room' : 'Edit Room'}
        </CardTitle>
        <CardDescription className="text-slate-600">
          {mode === 'create' ? 'Create a new room' : 'Update room details'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="room_number" className="text-slate-700">Room Number</Label>
            <Input
              id="room_number"
              value={formData.room_number}
              onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
              required
              className="border-slate-300 bg-white text-slate-900 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g., 101, A-305"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create Room' : 'Update Room'}
            </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push(`${basePath}/rooms`)}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Button>

          </div>
        </form>
      </CardContent>
    </Card>
  )
}
