import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb/client'
import { getCurrentUser } from '@/lib/auth/actions'
import { randomUUID } from 'crypto'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const db = await getDb()
    const notifications = await db
      .collection('notifications')
      .find({ user_id: user.id })
      .sort({ created_at: -1 })
      .limit(20)
      .toArray()

    return NextResponse.json(notifications)
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) return new NextResponse('Unauthorized', { status: 401 })

    const { id, all } = await req.json()
    const db = await getDb()

    if (all) {
      await db.collection('notifications').updateMany(
        { user_id: user.id, read: false },
        { $set: { read: true } }
      )
    } else if (id) {
      await db.collection('notifications').updateOne(
        { id, user_id: user.id },
        { $set: { read: true } }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
