import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const authCookieName = process.env.AUTH_COOKIE_NAME || 'token'

  const token = request.cookies.get(authCookieName)?.value

  // If token missing and the request is not for public pages, redirect to login
  if (
    !token &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/signup') &&
    request.nextUrl.pathname !== '/'
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
