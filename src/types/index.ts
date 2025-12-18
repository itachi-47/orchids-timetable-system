export type UserRole = 'admin' | 'hod' | 'timetable_coordinator' | 'faculty' | 'student'

export type TimetableStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  department_id?: string
  is_coordinator?: boolean
  created_at?: string
}

export interface Department {
  id: string
  name: string
  code: string
  hod_id?: string
  coordinator_id?: string
  created_at?: string
}

export interface TimetableDraft {
  id: string
  name: string
  department_id: string
  batch_id: string
  semester: string
  session: string
  status: TimetableStatus
  created_by: string
  submitted_at?: string
  reviewed_by?: string
  reviewed_at?: string
  rejection_reason?: string
  published_at?: string
  created_at: string
  updated_at: string
}

export interface TimetableDraftSlot {
  id: string
  draft_id: string
  subject_id: string | null
  faculty_id: string | null
  room_id: string | null
  batch_id: string
  day_of_week: DayOfWeek
  time_slot: TimeSlot
  is_lunch_break: boolean
  created_at: string
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'
export type TimeSlot = '09:00-10:00' | '10:00-11:00' | '11:00-12:00' | '12:00-13:00' | '13:00-14:00' | '14:00-15:00' | '15:00-16:00' | '16:00-17:00'

export interface Subject {
  id: string
  subject_code: string
  subject_name: string
  category: string
  classes_per_week: number
  department_id?: string
}

export interface Faculty {
  id: string
  faculty_name: string
  short_code: string
  department_id?: string
  user_id?: string
}

export interface Room {
  id: string
  room_number: string
  department_id?: string
}

export interface Batch {
  id: string
  batch_name: string
  semester?: string
  department_id?: string
}

export interface ApprovalHistory {
  id: string
  draft_id: string
  action: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'MODIFIED'
  performed_by: string
  comments?: string
  created_at: string
}
