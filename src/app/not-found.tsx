import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-slate-200 p-4">
            <FileQuestion className="h-12 w-12 text-slate-600" />
          </div>
        </div>
        <h1 className="mb-2 text-4xl font-bold text-slate-900">404</h1>
        <h2 className="mb-4 text-xl font-semibold text-slate-700">Page Not Found</h2>
        <p className="mb-8 text-slate-600">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/dashboard">
          <Button className="bg-slate-900 hover:bg-slate-800">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
