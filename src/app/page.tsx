import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { GraduationCap, Calendar, Clock, Users, BookOpen, Shield, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - Split Layout matching auth pages */}
      <div className="flex min-h-screen">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
          <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <GraduationCap className="w-9 h-9 text-slate-900" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white tracking-tight">SATS</h1>
                  <p className="text-slate-400 text-sm">Smart Academic Timetable System</p>
                </div>
              </div>
              <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
                Intelligent<br />
                <span className="text-amber-400">Academic Scheduling</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                Streamline your institution&apos;s timetable management with our intelligent, 
                constraint-based scheduling platform designed for modern academia.
              </p>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
                  <Clock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Automated Scheduling</h3>
                  <p className="text-slate-500 text-sm">Intelligent conflict-free timetable generation</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
                  <Shield className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Role-Based Access</h3>
                  <p className="text-slate-500 text-sm">Secure access for admins, faculty & students</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 border border-slate-700">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium mb-1">Resource Management</h3>
                  <p className="text-slate-500 text-sm">Manage subjects, faculty, rooms & batches</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-2">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-slate-900 flex items-center justify-center">
                    <Users className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-medium">500+ Users</p>
                <p className="text-slate-500 text-sm">Active institutional members</p>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-12 xl:left-20 text-slate-600 text-sm">
            © 2025 SATS. All rights reserved.
          </div>
        </div>

        {/* Right Panel - CTA */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 p-6 sm:p-12">
          <div className="w-full max-w-lg">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">SATS</h1>
                <p className="text-slate-500 text-xs">Smart Academic Timetable System</p>
              </div>
            </div>

            <div className="mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 mb-6">
                <Calendar className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-700">Institutional Portal</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                Welcome to the<br />Academic Portal
              </h2>
              <p className="text-slate-600 text-lg">
                Access your personalized timetables, manage academic resources, 
                and stay organized throughout the semester.
              </p>
            </div>

            <div className="space-y-4 mb-10">
              <Link href="/login" className="block">
                <Button 
                  size="lg" 
                  className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all text-base group"
                >
                  Sign In to Portal
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/signup" className="block">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full h-14 border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 font-medium rounded-xl transition-all text-base"
                >
                  Create New Account
                </Button>
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-amber-500" />
                Quick Access For
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                    <Users className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Students</p>
                    <p className="text-xs text-slate-500">View schedules</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Faculty</p>
                    <p className="text-xs text-slate-500">Manage classes</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Admins</p>
                    <p className="text-xs text-slate-500">Full control</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-slate-900" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">Rooms</p>
                    <p className="text-xs text-slate-500">Allocation</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-slate-400 text-xs">
                Protected by institutional security policies
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
