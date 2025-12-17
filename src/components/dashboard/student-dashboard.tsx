'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { logout } from '@/lib/auth/actions'
import { Calendar } from 'lucide-react'
import Link from 'next/link'

type User = {
  id: string
  email: string
  role: string
  full_name: string
}

export function StudentDashboard({ user }: { user: User }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-slate-50">Student Dashboard</h1>
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
          <p className="text-slate-400">View your class schedule</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/student/timetable">
            <Card className="cursor-pointer border-slate-700 bg-slate-800/50 backdrop-blur transition-all hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20">
              <CardHeader>
                <Calendar className="mb-2 h-8 w-8 text-indigo-400" />
                <CardTitle className="text-slate-50">My Timetable</CardTitle>
                <CardDescription className="text-slate-400">
                  View your weekly class schedule
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
