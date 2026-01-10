'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, Calendar, DoorOpen, Grid3x3, Building2, UserCog } from 'lucide-react'
import Link from 'next/link'
import { AdminLayout } from '@/components/layout/admin-layout'
import { DashboardAnalytics } from './dashboard-analytics'

type User = {
  id: string
  email: string
  role: string
  full_name: string
}

const stats = [
  {
    title: 'Departments',
    description: 'Manage departments',
    href: '/admin/departments',
    icon: Building2,
    gradient: 'from-violet-500 to-violet-600',
  },
  {
    title: 'Users',
    description: 'Manage users and roles',
    href: '/admin/users',
    icon: UserCog,
    gradient: 'from-rose-500 to-rose-600',
  },
  {
    title: 'Subjects',
    description: 'Manage course subjects',
    href: '/admin/subjects',
    icon: BookOpen,
    gradient: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Faculty',
    description: 'Manage faculty members',
    href: '/admin/faculty',
    icon: Users,
    gradient: 'from-emerald-500 to-emerald-600',
  },
  {
    title: 'Rooms',
    description: 'Manage classrooms',
    href: '/admin/rooms',
    icon: DoorOpen,
    gradient: 'from-orange-500 to-orange-600',
  },
  {
    title: 'Generate Timetable',
    description: 'Create automated timetables',
    href: '/admin/timetable/generate',
    icon: Grid3x3,
    gradient: 'from-pink-500 to-pink-600',
  },
  {
    title: 'View Timetable',
    description: 'View and edit timetables',
    href: '/admin/timetable',
    icon: Calendar,
    gradient: 'from-indigo-500 to-indigo-600',
  },
]

export function AdminDashboard({ user }: { user: User }) {
  return (
    <AdminLayout user={user}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Welcome back, {user.full_name.split(' ')[0]}
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Manage your timetable system from the dashboard
          </p>
        </div>

        <DashboardAnalytics />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="group relative overflow-hidden border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                <CardHeader className="pb-2">
                  <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold text-slate-900 transition-colors group-hover:text-slate-700 dark:text-slate-100 dark:group-hover:text-slate-300">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center text-sm font-medium text-slate-500 transition-colors group-hover:text-indigo-600 dark:text-slate-400 dark:group-hover:text-indigo-400">
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
    </AdminLayout>
  )
}
