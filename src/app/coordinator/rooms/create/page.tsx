import { RoomForm } from '@/components/rooms/room-form'
import { getCurrentUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import { CoordinatorLayout } from '@/components/layout/coordinator-layout'

export default async function CoordinatorCreateRoomPage() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'timetable_coordinator') {
    redirect('/login')
  }

  return (
    <CoordinatorLayout user={user}>
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add Room</h1>
          <p className="mt-1 text-slate-600">Add a new classroom or lab</p>
        </div>

        <RoomForm mode="create" isAdmin={false} />
      </div>
    </CoordinatorLayout>
  )
}
