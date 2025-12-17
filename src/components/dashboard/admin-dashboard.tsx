'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { logout } from '@/lib/auth/actions'
import { BookOpen, Users, Calendar, DoorOpen, School, Grid3x3 } from 'lucide-react'
import Link from 'next/link'

type User = {
  id: string
  email: string
  role: string
  full_name: string
}

export function AdminDashboard({ user }: { user: User }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user.full_name}</span>
            <form action={logout}>
              <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-100">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-slate-900">Welcome, {user.full_name}</h2>
          <p className="text-slate-600">Manage your timetable system</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/subjects">
            <Card className="cursor-pointer border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
              <CardHeader>
                <BookOpen className="mb-2 h-8 w-8 text-blue-600" />
                <CardTitle className="text-slate-900">Subjects</CardTitle>
                <CardDescription className="text-slate-600">
                  Manage course subjects
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/faculty">
            <Card className="cursor-pointer border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
              <CardHeader>
                <Users className="mb-2 h-8 w-8 text-blue-600" />
                <CardTitle className="text-slate-900">Faculty</CardTitle>
                <CardDescription className="text-slate-600">
                  Manage faculty members
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/rooms">
            <Card className="cursor-pointer border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
              <CardHeader>
                <DoorOpen className="mb-2 h-8 w-8 text-blue-600" />
                <CardTitle className="text-slate-900">Rooms</CardTitle>
                <CardDescription className="text-slate-600">
                  Manage classrooms
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

            <Link href="/admin/batches">
              <Card className="cursor-pointer border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
                <CardHeader>
                  <School className="mb-2 h-8 w-8 text-blue-600" />
                  <CardTitle className="text-slate-900">Batches & Course Types</CardTitle>
                  <CardDescription className="text-slate-600">
                    Manage batches and course categories
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/timetable/generate">
              <Card className="cursor-pointer border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
                <CardHeader>
                  <Grid3x3 className="mb-2 h-8 w-8 text-blue-600" />
                  <CardTitle className="text-slate-900">Generate Timetable</CardTitle>
                  <CardDescription className="text-slate-600">
                    Create automated timetables
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/timetable">
            <Card className="cursor-pointer border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
              <CardHeader>
                <Calendar className="mb-2 h-8 w-8 text-blue-600" />
                <CardTitle className="text-slate-900">Timetable</CardTitle>
                <CardDescription className="text-slate-600">
                  Generate and manage timetables
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
