import { getRooms } from '@/lib/rooms/actions'
import { RoomsList } from '@/components/rooms/rooms-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { AdminLayout } from '@/components/layout/admin-layout'

export default async function RoomsPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'admin') {
    redirect('/login')
  }

  const rooms = await getRooms()

  return (
    <AdminLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Rooms</h1>
            <p className="mt-1 text-slate-600">Manage classrooms and lab rooms</p>
          </div>
          <Link href="/admin/rooms/create">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </Link>
        </div>

        <RoomsList rooms={rooms} />
      </div>
    </AdminLayout>
  )
}
