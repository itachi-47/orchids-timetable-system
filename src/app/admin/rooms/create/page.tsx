import { RoomForm } from '@/components/rooms/room-form'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CreateRoomPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Link href="/admin/rooms">
          <Button variant="ghost" size="sm" className="mb-6 text-slate-400 hover:text-slate-200">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Rooms
          </Button>
        </Link>
        <RoomForm mode="create" />
      </div>
    </div>
  )
}
