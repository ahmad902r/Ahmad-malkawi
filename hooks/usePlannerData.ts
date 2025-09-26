
import { useState, useEffect, useCallback } from 'react';
import { PlannerData, DailyLog, Habit, Task, WorkStatus, PlanLevel, ScheduleType, QuranLog, ReadingLog, PodcastLog } from '../types';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const createDefaultHabits = (): Habit[] => [
    { id: 'fajr', name: 'صلاة الفجر', completed: false, category: 'worship' },
    { id: 'qiyam', name: 'قيام الليل', completed: false, category: 'worship' },
    { id: 'morning_adhkar', name: 'أذكار الصباح', completed: false, category: 'worship' },
    { id: 'evening_adhkar', name: 'أذكار المساء', completed: false, category: 'worship' },
    { id: 'quran_read', name: 'قراءة جزء يومياً', completed: false, category: 'quran' },
    { id: 'quran_listen', name: 'سماع 5 صفحات', completed: false, category: 'quran' },
    { id: 'quran_tadabbur', name: 'تدبر صفحة', completed: false, category: 'quran' },
    { id: 'study_ambulance', name: 'دراسة مهنية للإسعاف', completed: false, category: 'professional' },
    { id: 'podcast', name: 'بودكاست', completed: false, category: 'podcast' },
    { id: 'reading', name: 'قراءة كتب', completed: false, category: 'reading' },
];

const createDefaultTasks = (): Task[] => Array.from({ length: 6 }, (_, i) => ({
    id: `task-${i + 1}`,
    text: '',
    completed: false,
    priority: 'normal'
}));

const createEmptyLog = (date: string): DailyLog => ({
    date,
    workStatus: WorkStatus.AtHome,
    planLevel: PlanLevel.Normal,
    scheduleType: ScheduleType.Off,
    habits: createDefaultHabits(),
    tasks: createDefaultTasks(),
    quran: { juz: '', pagesRead: '', pagesHeard: false, pageTadabbur: false, tadabburSummary: '' },
    reading: { type: 'religious', duration: 30 },
    podcast: { type: 'listen', episodeName: '', duration: 30 },
    professionalStudyMinutes: 20,
    sleepHours: 8,
    mood: 3,
    notes: '',
});


export const usePlannerData = () => {
    const [data, setData] = useState<PlannerData>({ logs: {}, monthlyGoals: {}, yearlyGoals: [] });
    const [currentDate, setCurrentDate] = useState<string>(getTodayDateString());

    useEffect(() => {
        try {
            const savedData = localStorage.getItem('plannerData');
            if (savedData) {
                setData(JSON.parse(savedData));
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('plannerData', JSON.stringify(data));
        } catch (error) {
            console.error("Failed to save data to localStorage", error);
        }
    }, [data]);

    const getLogForDate = useCallback((date: string): DailyLog => {
        return data.logs[date] || createEmptyLog(date);
    }, [data.logs]);
    
    const updateLog = useCallback((date: string, newLogData: Partial<DailyLog>) => {
        setData(prevData => {
            const existingLog = prevData.logs[date] || createEmptyLog(date);
            return {
                ...prevData,
                logs: {
                    ...prevData.logs,
                    [date]: { ...existingLog, ...newLogData }
                }
            };
        });
    }, []);

    const updateHabit = useCallback((date: string, habitId: string, completed: boolean) => {
        const log = getLogForDate(date);
        const newHabits = log.habits.map(h => h.id === habitId ? { ...h, completed } : h);
        updateLog(date, { habits: newHabits });
    }, [getLogForDate, updateLog]);

    const updateTask = useCallback((date: string, taskId: string, updates: Partial<Task>) => {
        const log = getLogForDate(date);
        const newTasks = log.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t);
        updateLog(date, { tasks: newTasks });
    }, [getLogForDate, updateLog]);

    const updateQuranLog = useCallback((date: string, updates: Partial<QuranLog>) => {
        const log = getLogForDate(date);
        updateLog(date, { quran: { ...log.quran, ...updates } });
    }, [getLogForDate, updateLog]);
    
    const updateReadingLog = useCallback((date: string, updates: Partial<ReadingLog>) => {
        const log = getLogForDate(date);
        updateLog(date, { reading: { ...log.reading, ...updates } });
    }, [getLogForDate, updateLog]);

    const updatePodcastLog = useCallback((date: string, updates: Partial<PodcastLog>) => {
        const log = getLogForDate(date);
        updateLog(date, { podcast: { ...log.podcast, ...updates } });
    }, [getLogForDate, updateLog]);


    return {
        data,
        setData,
        currentDate,
        setCurrentDate,
        getLogForDate,
        updateLog,
        updateHabit,
        updateTask,
        updateQuranLog,
        updateReadingLog,
        updatePodcastLog,
    };
};
