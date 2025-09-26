
import { PlannerData } from '../types';

export const exportToCSV = (data: PlannerData) => {
    const headers = [
        'Date', 'WorkStatus', 'PlanLevel', 'ScheduleType',
        'Fajr', 'Qiyam', 'Morning Adhkar', 'Evening Adhkar',
        'Quran Read', 'Quran Listen', 'Quran Tadabbur',
        'Ambulance Study', 'Podcast', 'Reading',
        'Tasks Completed', 'Total Tasks', 'Mood', 'SleepHours', 'Notes'
    ];

    const rows = Object.values(data.logs).map(log => {
        const habitMap = new Map(log.habits.map(h => [h.id, h.completed ? '1' : '0']));
        const tasksCompleted = log.tasks.filter(t => t.completed).length;
        const totalTasks = log.tasks.filter(t => t.text.trim() !== '').length;

        return [
            log.date,
            log.workStatus,
            log.planLevel,
            log.scheduleType,
            habitMap.get('fajr') || '0',
            habitMap.get('qiyam') || '0',
            habitMap.get('morning_adhkar') || '0',
            habitMap.get('evening_adhkar') || '0',
            habitMap.get('quran_read') || '0',
            habitMap.get('quran_listen') || '0',
            habitMap.get('quran_tadabbur') || '0',
            habitMap.get('study_ambulance') || '0',
            habitMap.get('podcast') || '0',
            habitMap.get('reading') || '0',
            tasksCompleted,
            totalTasks,
            log.mood,
            log.sleepHours,
            `"${log.notes.replace(/"/g, '""')}"` // Escape quotes
        ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "planner_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
