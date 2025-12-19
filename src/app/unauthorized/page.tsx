import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldAlert } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <ShieldAlert className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-slate-900">Access Denied</h1>
        <p className="mb-8 text-slate-600">
          You do not have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/dashboard">
            <Button className="w-full bg-slate-900 hover:bg-slate-800">
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="w-full border-slate-300">
              Sign in with a different account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
