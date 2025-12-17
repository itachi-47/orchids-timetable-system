import { signup } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800/50 backdrop-blur">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-slate-50">Create Account</CardTitle>
          <CardDescription className="text-slate-400">
            Sign up to access the timetable system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-slate-200">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                required
                className="border-slate-600 bg-slate-700/50 text-slate-50 placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-200">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="student@example.com"
                required
                className="border-slate-600 bg-slate-700/50 text-slate-50 placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="border-slate-600 bg-slate-700/50 text-slate-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-slate-200">Role</Label>
              <Select name="role" defaultValue="student" required>
                <SelectTrigger className="border-slate-600 bg-slate-700/50 text-slate-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-slate-700 bg-slate-800">
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Create Account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
