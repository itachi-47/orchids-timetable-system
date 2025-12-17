import { getRooms } from '@/lib/rooms/actions'
import { RoomsList } from '@/components/rooms/rooms-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'

export default async function RoomsPage() {
  const rooms = await getRooms()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="mb-2 text-slate-400 hover:text-slate-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-slate-50">Rooms Management</h1>
            <p className="text-slate-400 mt-2">Manage classroom and lab rooms</p>
          </div>
          <Link href="/admin/rooms/create">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Room
            </Button>
          </Link>
        </div>

        <RoomsList rooms={rooms} />
      </div>
    </div>
  )
}
