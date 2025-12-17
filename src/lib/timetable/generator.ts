import { TimetableSlot, Subject, Faculty, Room, Batch, DayOfWeek, TimeSlot, Conflict } from './types';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS: TimeSlot[] = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
  '14:00-15:00',
  '15:00-16:00',
  '16:00-17:00'
];
const LUNCH_BREAK_SLOT: TimeSlot = '13:00-14:00';

export class TimetableGenerator {
  private subjects: Subject[];
  private faculty: Faculty[];
  private rooms: Room[];
  private batches: Batch[];
  private timetable: TimetableSlot[] = [];
  private subjectFacultyMap: Map<string, string[]>;
  private subjectClassCounts: Map<string, Map<string, number>>;

  constructor(
    subjects: Subject[],
    faculty: Faculty[],
    rooms: Room[],
    batches: Batch[],
    subjectFacultyMap: Map<string, string[]>
  ) {
    this.subjects = subjects;
    this.faculty = faculty;
    this.rooms = rooms;
    this.batches = batches;
    this.subjectFacultyMap = subjectFacultyMap;
    this.subjectClassCounts = new Map();
    
    batches.forEach(batch => {
      const counts = new Map<string, number>();
      subjects.forEach(subject => {
        counts.set(subject.id, 0);
      });
      this.subjectClassCounts.set(batch.id, counts);
    });
  }

  generate(): TimetableSlot[] {
    this.timetable = [];
    
    for (const batch of this.batches) {
      this.addLunchBreaks(batch.id);
      this.scheduleBatch(batch.id);
    }
    
    return this.timetable;
  }

  private addLunchBreaks(batchId: string): void {
    for (const day of DAYS) {
      this.timetable.push({
        subject_id: null,
        faculty_id: null,
        room_id: null,
        batch_id: batchId,
        day_of_week: day,
        time_slot: LUNCH_BREAK_SLOT,
        is_lunch_break: true
      });
    }
  }

  private scheduleBatch(batchId: string): void {
    const subjectsToSchedule = [...this.subjects].sort((a, b) => 
      b.classes_per_week - a.classes_per_week
    );

    for (const subject of subjectsToSchedule) {
      const requiredClasses = subject.classes_per_week;
      const assignedFaculty = this.subjectFacultyMap.get(subject.id) || [];
      
      if (assignedFaculty.length === 0) continue;

      let scheduled = 0;
      let attempts = 0;
      const maxAttempts = 100;

      while (scheduled < requiredClasses && attempts < maxAttempts) {
        attempts++;
        
        const day = this.selectBestDay(batchId, subject.id);
        const timeSlot = this.selectBestTimeSlot(batchId, day);
        
        if (!timeSlot || timeSlot === LUNCH_BREAK_SLOT) continue;

        const facultyId = this.selectBestFaculty(assignedFaculty, day, timeSlot);
        const roomId = this.selectBestRoom(day, timeSlot);

        if (facultyId && roomId) {
          const slot: TimetableSlot = {
            subject_id: subject.id,
            faculty_id: facultyId,
            room_id: roomId,
            batch_id: batchId,
            day_of_week: day,
            time_slot: timeSlot,
            is_lunch_break: false
          };

          if (!this.hasConflict(slot)) {
            this.timetable.push(slot);
            const counts = this.subjectClassCounts.get(batchId)!;
            counts.set(subject.id, counts.get(subject.id)! + 1);
            scheduled++;
          }
        }
      }
    }
  }

  private selectBestDay(batchId: string, subjectId: string): DayOfWeek {
    const dayCounts = new Map<DayOfWeek, number>();
    
    for (const day of DAYS) {
      const count = this.timetable.filter(
        slot => slot.batch_id === batchId && 
                slot.day_of_week === day && 
                !slot.is_lunch_break
      ).length;
      dayCounts.set(day, count);
    }

    const sortedDays = [...dayCounts.entries()]
      .sort((a, b) => a[1] - b[1])
      .map(entry => entry[0]);

    const randomIndex = Math.floor(Math.random() * Math.min(3, sortedDays.length));
    return sortedDays[randomIndex];
  }

  private selectBestTimeSlot(batchId: string, day: DayOfWeek): TimeSlot | null {
    const availableSlots = TIME_SLOTS.filter(slot => {
      if (slot === LUNCH_BREAK_SLOT) return false;
      
      return !this.timetable.some(
        s => s.batch_id === batchId && 
             s.day_of_week === day && 
             s.time_slot === slot
      );
    });

    if (availableSlots.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableSlots.length);
    return availableSlots[randomIndex];
  }

  private selectBestFaculty(facultyIds: string[], day: DayOfWeek, timeSlot: TimeSlot): string | null {
    const availableFaculty = facultyIds.filter(facultyId => {
      return !this.timetable.some(
        slot => slot.faculty_id === facultyId && 
                slot.day_of_week === day && 
                slot.time_slot === timeSlot
      );
    });

    if (availableFaculty.length === 0) return null;

    const facultyLoads = availableFaculty.map(facultyId => {
      const load = this.timetable.filter(slot => slot.faculty_id === facultyId).length;
      return { facultyId, load };
    }).sort((a, b) => a.load - b.load);

    const minLoad = facultyLoads[0].load;
    const lightlyLoadedFaculty = facultyLoads.filter(f => f.load === minLoad);
    
    const randomIndex = Math.floor(Math.random() * lightlyLoadedFaculty.length);
    return lightlyLoadedFaculty[randomIndex].facultyId;
  }

  private selectBestRoom(day: DayOfWeek, timeSlot: TimeSlot): string | null {
    const availableRooms = this.rooms.filter(room => {
      return !this.timetable.some(
        slot => slot.room_id === room.id && 
                slot.day_of_week === day && 
                slot.time_slot === timeSlot
      );
    });

    if (availableRooms.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableRooms.length);
    return availableRooms[randomIndex].id;
  }

  private hasConflict(newSlot: TimetableSlot): boolean {
    return this.timetable.some(slot => {
      if (slot.day_of_week !== newSlot.day_of_week || slot.time_slot !== newSlot.time_slot) {
        return false;
      }

      if (slot.batch_id === newSlot.batch_id) return true;
      if (slot.faculty_id === newSlot.faculty_id) return true;
      if (slot.room_id === newSlot.room_id) return true;

      return false;
    });
  }

  getConflicts(): Conflict[] {
    const conflicts: Conflict[] = [];

    for (const slot of this.timetable) {
      if (slot.is_lunch_break) continue;

      const overlapping = this.timetable.filter(
        s => s !== slot && 
             s.day_of_week === slot.day_of_week && 
             s.time_slot === slot.time_slot
      );

      for (const other of overlapping) {
        if (slot.faculty_id === other.faculty_id) {
          conflicts.push({
            type: 'faculty',
            message: `Faculty conflict on ${slot.day_of_week} at ${slot.time_slot}`,
            slot
          });
        }
        if (slot.room_id === other.room_id) {
          conflicts.push({
            type: 'room',
            message: `Room conflict on ${slot.day_of_week} at ${slot.time_slot}`,
            slot
          });
        }
        if (slot.batch_id === other.batch_id) {
          conflicts.push({
            type: 'batch',
            message: `Batch conflict on ${slot.day_of_week} at ${slot.time_slot}`,
            slot
          });
        }
      }
    }

    return conflicts;
  }
}
