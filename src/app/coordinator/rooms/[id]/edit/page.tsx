import { RoomForm } from '@/components/rooms/room-form'
import { getCurrentUser } from '@/lib/auth/actions'
import { getRoomById } from '@/lib/rooms/actions'
import { redirect, notFound } from 'next/navigation'
import { CoordinatorLayout } from '@/components/layout/coordinator-layout'

export default async function CoordinatorEditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'timetable_coordinator') {
    redirect('/login')
  }

  const { id } = await params
  const room = await (async () => {
    try {
      return await getRoomById(id)
    } catch {
      return null
    }
  })()

  if (!room) {
    notFound()
  }

  return (
    <CoordinatorLayout user={user}>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Room</h1>
          <p className="mt-1 text-slate-600">Update room information</p>
        </div>

        <RoomForm room={room} mode="edit" isAdmin={false} />
      </div>
    </CoordinatorLayout>
  )
}
