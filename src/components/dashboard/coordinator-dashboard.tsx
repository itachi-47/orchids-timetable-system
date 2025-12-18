'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, Calendar, DoorOpen, School, Grid3x3, Send, FileText } from 'lucide-react'
import Link from 'next/link'
import { CoordinatorLayout } from '@/components/layout/coordinator-layout'

type User = {
  id: string
  email: string
  role: string
  full_name: string
  department_id?: string
}

const stats = [
  {
    title: 'Subjects',
    description: 'Manage course subjects',
    href: '/coordinator/subjects',
    icon: BookOpen,
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Faculty',
    description: 'Manage faculty members',
    href: '/coordinator/faculty',
    icon: Users,
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    title: 'Rooms',
    description: 'Manage classrooms',
    href: '/coordinator/rooms',
    icon: DoorOpen,
    gradient: 'from-orange-500 to-orange-600',
  },
  {
    title: 'Batches',
    description: 'Manage batches',
    href: '/coordinator/batches',
    icon: School,
    gradient: 'from-purple-500 to-purple-600',
  },
  {
    title: 'Generate Timetable',
    description: 'Create new timetable drafts',
    href: '/coordinator/timetable/generate',
    icon: Grid3x3,
    gradient: 'from-pink-500 to-pink-600',
  },
  {
    title: 'My Drafts',
    description: 'View and manage timetable drafts',
    href: '/coordinator/drafts',
    icon: FileText,
    gradient: 'from-indigo-500 to-indigo-600',
  },
]

export function CoordinatorDashboard({ user }: { user: User }) {
  return (
    <CoordinatorLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user.full_name.split(' ')[0]}
          </h1>
          <p className="mt-1 text-slate-600">
            Manage timetables and submit for HOD approval
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="group relative overflow-hidden border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                <CardHeader className="pb-2">
                  <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-slate-700">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center text-sm font-medium text-slate-500 transition-colors group-hover:text-indigo-600">
                    Go to {item.title.toLowerCase()}
                    <svg
                      className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </CoordinatorLayout>
  )
}
