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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-50">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">{user.full_name}</span>
            <form action={logout}>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-700">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-50">Welcome, {user.full_name}</h2>
          <p className="text-slate-400">Manage your timetable system</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/subjects">
            <Card className="cursor-pointer border-slate-700 bg-slate-800/50 backdrop-blur transition-all hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20">
              <CardHeader>
                <BookOpen className="mb-2 h-8 w-8 text-purple-400" />
                <CardTitle className="text-slate-50">Subjects</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage course subjects
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/faculty">
            <Card className="cursor-pointer border-slate-700 bg-slate-800/50 backdrop-blur transition-all hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20">
              <CardHeader>
                <Users className="mb-2 h-8 w-8 text-purple-400" />
                <CardTitle className="text-slate-50">Faculty</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage faculty members
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin/rooms">
            <Card className="cursor-pointer border-slate-700 bg-slate-800/50 backdrop-blur transition-all hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20">
              <CardHeader>
                <DoorOpen className="mb-2 h-8 w-8 text-purple-400" />
                <CardTitle className="text-slate-50">Rooms</CardTitle>
                <CardDescription className="text-slate-400">
                  Manage classrooms
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

            <Link href="/admin/batches">
              <Card className="cursor-pointer border-slate-700 bg-slate-800/50 backdrop-blur transition-all hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20">
                <CardHeader>
                  <School className="mb-2 h-8 w-8 text-purple-400" />
                  <CardTitle className="text-slate-50">Batches & Course Types</CardTitle>
                  <CardDescription className="text-slate-400">
                    Manage batches and course categories
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/timetable/generate">
              <Card className="cursor-pointer border-slate-700 bg-slate-800/50 backdrop-blur transition-all hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20">
                <CardHeader>
                  <Grid3x3 className="mb-2 h-8 w-8 text-purple-400" />
                  <CardTitle className="text-slate-50">Generate Timetable</CardTitle>
                  <CardDescription className="text-slate-400">
                    Create automated timetables
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/timetable">
            <Card className="cursor-pointer border-slate-700 bg-slate-800/50 backdrop-blur transition-all hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20">
              <CardHeader>
                <Calendar className="mb-2 h-8 w-8 text-purple-400" />
                <CardTitle className="text-slate-50">Timetable</CardTitle>
                <CardDescription className="text-slate-400">
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
