import { UserRole } from '@/types'

export const DASHBOARD_ROUTES: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  hod: '/hod/dashboard',
  timetable_coordinator: '/coordinator/dashboard',
  faculty: '/faculty/dashboard',
  student: '/student/dashboard',
}

export const ROLE_PERMISSIONS: Record<string, UserRole[]> = {
  '/admin': ['admin'],
  '/hod': ['hod', 'admin'],
  '/coordinator': ['timetable_coordinator', 'admin'],
  '/faculty': ['faculty', 'hod', 'timetable_coordinator', 'admin'],
  '/student': ['student'],
}

export function getDashboardRoute(role: UserRole): string {
  return DASHBOARD_ROUTES[role] || '/dashboard'
}

export function isRouteAllowed(pathname: string, role: UserRole): boolean {
  for (const [routePrefix, allowedRoles] of Object.entries(ROLE_PERMISSIONS)) {
    if (pathname.startsWith(routePrefix)) {
      return allowedRoles.includes(role)
    }
  }
  return true
}
