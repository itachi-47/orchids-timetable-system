import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { verifyToken } from './jwt'
import type { UserRole } from '@/types'
import { ROLE_PERMISSIONS, getDashboardRoute } from './roles'

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
    pathname === '/' ||
    pathname === '/unauthorized'

  if (!isAuthenticated && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (isAuthenticated) {
    let userRole: UserRole | undefined

    if (jwtToken) {
      const payload = verifyToken(jwtToken)
      userRole = payload?.role as UserRole
    } else if (nextAuthToken) {
      userRole = nextAuthToken.role as UserRole
    }

    if (userRole) {
      // If user is logged in and tries to access login/signup, redirect to dashboard
      if (isPublicPath && (pathname === '/login' || pathname === '/signup')) {
        const url = request.nextUrl.clone()
        url.pathname = getDashboardRoute(userRole)
        return NextResponse.redirect(url)
      }

      // Check route permissions
      for (const [routePrefix, allowedRoles] of Object.entries(ROLE_PERMISSIONS)) {
        if (pathname.startsWith(routePrefix)) {
          if (!allowedRoles.includes(userRole)) {
            const url = request.nextUrl.clone()
            url.pathname = '/unauthorized'
            return NextResponse.redirect(url)
          }
          break
        }
      }
    }
  }

  return NextResponse.next()
}
