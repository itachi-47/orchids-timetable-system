import { getRoomById } from '@/lib/rooms/actions'
import { RoomForm } from '@/components/rooms/room-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  try {
    const room = await getRoomById(id)
      return (
        <div className="min-h-screen bg-slate-50">
          <div className="container mx-auto px-4 py-8">
            <Link href="/admin/rooms">
              <Button variant="ghost" size="sm" className="mb-6 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rooms
            </Button>
          </Link>
          <RoomForm room={room} mode="edit" />
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
