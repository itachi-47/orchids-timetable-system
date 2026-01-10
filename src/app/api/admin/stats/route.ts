import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb/client'
import { getCurrentUser } from '@/lib/auth/actions'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'admin' && user.role !== 'coordinator')) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const db = await getDb()

    const [
      departmentsCount,
      subjectsCount,
      facultyCount,
      roomsCount,
      studentsCount,
      batchesCount,
      timetableData,
      rooms,
      faculty,
    ] = await Promise.all([
      db.collection('departments').countDocuments(),
      db.collection('subjects').countDocuments(),
      db.collection('faculty').countDocuments(),
      db.collection('rooms').countDocuments(),
      db.collection('students').countDocuments(),
      db.collection('batches').countDocuments(),
      db.collection('timetable').find({}).toArray(),
      db.collection('rooms').find({}).toArray(),
      db.collection('faculty').find({}).toArray(),
    ])

    const roomNames = Object.fromEntries(rooms.map((r: any) => [r.id, r.room_name]))
    const facultyNames = Object.fromEntries(faculty.map((f: any) => [f.id, f.full_name]))

    // Calculate room utilization
    const roomUtilization: any[] = []
    const roomCounts: Record<string, number> = {}
    timetableData.forEach((entry: any) => {
      if (entry.room_id) {
        roomCounts[entry.room_id] = (roomCounts[entry.room_id] || 0) + 1
      }
    })
    Object.entries(roomCounts).forEach(([id, count]) => {
      roomUtilization.push({ name: roomNames[id] || id, count })
    })

    // Calculate faculty load
    const facultyLoad: any[] = []
    const facultyCounts: Record<string, number> = {}
    timetableData.forEach((entry: any) => {
      if (entry.faculty_id) {
        facultyCounts[entry.faculty_id] = (facultyCounts[entry.faculty_id] || 0) + 1
      }
    })
    Object.entries(facultyCounts).forEach(([id, count]) => {
      facultyLoad.push({ name: facultyNames[id] || id, count })
    })

    return NextResponse.json({
      counts: {
        departments: departmentsCount,
        subjects: subjectsCount,
        faculty: facultyCount,
        rooms: roomsCount,
        students: studentsCount,
        batches: batchesCount,
      },
      roomUtilization: roomUtilization.sort((a, b) => b.count - a.count).slice(0, 5),
      facultyLoad: facultyLoad.sort((a, b) => b.count - a.count).slice(0, 5),
    })
  } catch (error) {
    console.error('Stats API Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
