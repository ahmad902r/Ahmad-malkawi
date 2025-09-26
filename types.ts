
export enum ScheduleType {
  Light = "أسبوع دوام خفيف",
  Intensive = "أسبوع دوام مكثف",
  Off = "في البيت",
}

export enum WorkStatus {
    EndOfShift = "نهاية دوام",
    MorningShift = "دوام صباح",
    EveningShift = "دوام مسائي",
    AtHome = "في البيت"
}

export enum PlanLevel {
  Normal = "الخطة العادية",
  Flexible = "الخطة المرنة",
  Minimum = "الخطة الأدنى",
}

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
  category: 'worship' | 'quran' | 'reading' | 'podcast' | 'professional';
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'normal' | 'important' | 'emergency';
}

export interface QuranLog {
    juz: string;
    pagesRead: string;
    pagesHeard: boolean;
    pageTadabbur: boolean;
    tadabburSummary: string;
}

export interface ReadingLog {
    type: 'religious' | 'self-dev';
    duration: number; // in minutes
}

export interface PodcastLog {
    type: 'listen' | 'produce';
    episodeName: string;
    duration: number; // in minutes
}


export interface DailyLog {
  date: string; // YYYY-MM-DD
  workStatus: WorkStatus;
  planLevel: PlanLevel;
  scheduleType: ScheduleType;
  habits: Habit[];
  tasks: Task[];
  quran: QuranLog;
  reading: ReadingLog;
  podcast: PodcastLog;
  professionalStudyMinutes: number;
  sleepHours: number;
  mood: number; // 1-5
  notes: string;
}

export interface PlannerData {
  logs: { [date: string]: DailyLog };
  monthlyGoals: { [month: string]: string[] }; // YYYY-MM
  yearlyGoals: string[];
}
