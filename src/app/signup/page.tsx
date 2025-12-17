import { signup } from '@/lib/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md border-slate-200 bg-white shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-slate-900">Create Account</CardTitle>
          <CardDescription className="text-slate-600">
            Sign up to access the timetable system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-slate-700">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                required
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="student@example.com"
                required
                className="border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="border-slate-300 bg-white text-slate-900 focus:border-blue-600 focus:ring-blue-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-slate-700">Role</Label>
              <Select name="role" defaultValue="student" required>
                <SelectTrigger className="border-slate-300 bg-white text-slate-900 focus:border-blue-600 focus:ring-blue-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-slate-200 bg-white">
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create Account
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
