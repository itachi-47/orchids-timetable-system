import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { verifyToken } from './jwt'
import type { UserRole } from '@/types'

const ROLE_ROUTES: Record<string, UserRole[]> = {
  '/admin': ['admin'],
  '/hod': ['hod', 'admin'],
  '/coordinator': ['timetable_coordinator', 'admin'],
  '/faculty': ['faculty', 'hod', 'timetable_coordinator', 'admin'],
  '/student': ['student'],
}

export async function updateSession(request: NextRequest) {
  const authCookieName = process.env.AUTH_COOKIE_NAME || 'token'
  const pathname = request.nextUrl.pathname

  const jwtToken = request.cookies.get(authCookieName)?.value
  const nextAuthToken = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET 
  })

  const isAuthenticated = !!jwtToken || !!nextAuthToken

  const isPublicPath = 
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/'

  if (!isAuthenticated && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuthenticated && !isPublicPath) {
    let userRole: UserRole | undefined

    if (jwtToken) {
      const payload = verifyToken(jwtToken)
      userRole = payload?.role as UserRole
    } else if (nextAuthToken) {
      userRole = nextAuthToken.role as UserRole
    }

    if (userRole) {
      for (const [routePrefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
        if (pathname.startsWith(routePrefix)) {
          if (!allowedRoles.includes(userRole)) {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
          }
          break
        }
      }
    }
  }

  return NextResponse.next()
}
