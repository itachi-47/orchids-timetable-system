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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Student Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-400">{user.full_name}</span>
            <form action={logout}>
              <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Welcome, {user.full_name}</h2>
          <p className="text-slate-600 dark:text-slate-400">View your class schedule</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/student/timetable">
            <Card className="cursor-pointer border-slate-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500">
              <CardHeader>
                <Calendar className="mb-2 h-8 w-8 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-slate-900 dark:text-slate-100">My Timetable</CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
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
