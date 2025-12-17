import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Calendar, Clock, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Smart Automated Timetable System</span>
        </div>

        <h1 className="mb-4 text-6xl font-semibold tracking-tight text-slate-900">
          SATS
        </h1>
        
        <p className="mb-12 max-w-2xl text-xl text-slate-600">
          Intelligent timetable generation with constraint-based scheduling. 
          Manage subjects, faculty, rooms, and batches seamlessly.
        </p>

        <div className="flex gap-4">
          <Link href="/login">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100">
              Sign Up
            </Button>
          </Link>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-sky-50 p-4">
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Automated Scheduling</h3>
            <p className="text-sm text-slate-600">Constraint-based algorithm for optimal timetables</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-sky-50 p-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Role-Based Access</h3>
            <p className="text-sm text-slate-600">Admin and student dashboards with tailored features</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-sky-50 p-4">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Easy Management</h3>
            <p className="text-sm text-slate-600">Manage subjects, faculty, rooms, and batches</p>
          </div>
        </div>
      </main>
    </div>
  )
}
