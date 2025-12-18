import { login } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { GraduationCap, BookOpen, Shield } from 'lucide-react'
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const params = await searchParams
  
  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <GraduationCap className="w-8 h-8 text-slate-900" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">SATS</h1>
                <p className="text-slate-400 text-sm">Academic Timetable System</p>
              </div>
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Smart Academic<br />
              <span className="text-amber-400">Scheduling</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-md">
              Streamline your institution&apos;s timetable management with our intelligent scheduling platform.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Automated Scheduling</h3>
                <p className="text-slate-500 text-sm">Intelligent conflict-free timetable generation</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Role-Based Access</h3>
                <p className="text-slate-500 text-sm">Secure access for admins, faculty & students</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-12 xl:left-20 text-slate-600 text-sm">
          © 2025 SATS. All rights reserved.
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-slate-50 p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10 justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">SATS</h1>
              <p className="text-slate-500 text-xs">Academic Timetable System</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Academic Portal
            </h2>
            <p className="text-slate-600">
              Sign in with your institutional credentials
            </p>
          </div>

          {params.error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {decodeURIComponent(params.error)}
            </div>
          )}

          {params.message && (
            <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
              {params.message}
            </div>
          )}

          <GoogleSignInButton mode="signin" />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-50 px-2 text-slate-500">Or continue with email</span>
            </div>
          </div>

          <form action={login} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">
                Institutional Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@institution.edu"
                required
                className="h-12 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-medium">
                  Password
                </Label>
                <Link 
                  href="#" 
                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                className="h-12 border-slate-300 bg-white text-slate-900 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-all"
            >
              Sign In to Portal
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-center text-slate-600 text-sm">
              New to the institution?{' '}
              <Link href="/signup" className="text-amber-600 hover:text-amber-700 font-semibold">
                Request Access
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-xs">
              Protected by institutional security policies
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
