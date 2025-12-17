export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type TimeSlot = '09:00-10:00' | '10:00-11:00' | '11:00-12:00' | '12:00-13:00' | '13:00-14:00' | '14:00-15:00' | '15:00-16:00' | '16:00-17:00';

export interface Subject {
  id: string;
  subject_code: string;
  subject_name: string;
  category: string;
  classes_per_week: number;
}

export interface Faculty {
  id: string;
  faculty_name: string;
  short_code: string;
}

export interface Room {
  id: string;
  room_number: string;
}

export interface Batch {
  id: string;
  batch_name: string;
}

export interface TimetableSlot {
  id?: string;
  subject_id: string | null;
  faculty_id: string | null;
  room_id: string | null;
  batch_id: string;
  day_of_week: DayOfWeek;
  time_slot: TimeSlot;
  is_lunch_break: boolean;
}

export interface TimetableEntry extends TimetableSlot {
  subject?: Subject;
  faculty?: Faculty;
  room?: Room;
  batch?: Batch;
}

export interface Conflict {
  type: 'faculty' | 'room' | 'batch';
  message: string;
  slot: TimetableSlot;
}
