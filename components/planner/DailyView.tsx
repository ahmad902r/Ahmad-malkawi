
import React from 'react';
import { usePlannerData } from '../../hooks/usePlannerData';
import { formatDate, formatHijriDate } from '../../services/dateService';
import { WorkStatus, PlanLevel, ScheduleType } from '../../types';
import { ICONS } from '../../constants';
import { Card } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';

type DailyViewProps = ReturnType<typeof usePlannerData>;

const TimeBlock: React.FC<{title: string, time: string, children: React.ReactNode, icon: JSX.Element}> = ({ title, time, children, icon }) => (
    <div className="mb-4 p-4 border-r-4 border-emerald-200 bg-emerald-50/50 rounded-md">
        <div className="flex items-center mb-2">
            <span className="text-emerald-600 me-3">{icon}</span>
            <div>
                <h4 className="font-bold text-emerald-800">{title}</h4>
                <p className="text-sm text-gray-500">{time}</p>
            </div>
        </div>
        <div className="pr-9 space-y-2">
            {children}
        </div>
    </div>
);

export const DailyView: React.FC<DailyViewProps> = ({ 
    currentDate, setCurrentDate, getLogForDate, updateLog, updateHabit, updateTask,
    updateQuranLog, updateReadingLog, updatePodcastLog
}) => {

    const log = getLogForDate(currentDate);

    const handleDateChange = (days: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + days);
        setCurrentDate(newDate.toISOString().split('T')[0]);
    };
    
    const getHabit = (id: string) => log.habits.find(h => h.id === id) || { completed: false };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 pb-4 border-b">
                <div>
                    <h2 className="text-2xl font-bold">{formatDate(currentDate)}</h2>
                    <p className="text-md text-gray-500">{formatHijriDate(currentDate)}</p>
                </div>
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    <button onClick={() => handleDateChange(1)} className="px-4 py-2 bg-stone-200 rounded-md hover:bg-stone-300">اليوم التالي</button>
                    <button onClick={() => setCurrentDate(new Date().toISOString().split('T')[0])} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-md hover:bg-emerald-700">اليوم</button>
                    <button onClick={() => handleDateChange(-1)} className="px-4 py-2 bg-stone-200 rounded-md hover:bg-stone-300">اليوم السابق</button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <select value={log.workStatus} onChange={e => updateLog(currentDate, { workStatus: e.target.value as WorkStatus })} className="p-2 border rounded-md bg-white">
                    {Object.values(WorkStatus).map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
                 <select value={log.scheduleType} onChange={e => updateLog(currentDate, { scheduleType: e.target.value as ScheduleType })} className="p-2 border rounded-md bg-white">
                    {Object.values(ScheduleType).map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
                 <select value={log.planLevel} onChange={e => updateLog(currentDate, { planLevel: e.target.value as PlanLevel })} className="p-2 border rounded-md bg-white">
                    {Object.values(PlanLevel).map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <TimeBlock title="فجر – صباح مبكر" time="قبل الشروق / بعد الفجر" icon={ICONS.moon}>
                       <Checkbox label="تذكير قيام الليل" checked={getHabit('qiyam').completed} onChange={c => updateHabit(currentDate, 'qiyam', c)} />
                       <Checkbox label="أذكار الصباح" checked={getHabit('morning_adhkar').completed} onChange={c => updateHabit(currentDate, 'morning_adhkar', c)} />
                    </TimeBlock>

                    <TimeBlock title="صباح" time="بداية اليوم" icon={ICONS.quran}>
                        <Checkbox label="صلاة الفجر" checked={getHabit('fajr').completed} onChange={c => updateHabit(currentDate, 'fajr', c)} />
                        <div>
                            <label className="block text-sm font-medium text-gray-700">قراءة جزء يومياً</label>
                            <div className="flex items-center gap-2">
                                <input type="text" placeholder="الجزء / الصفحات" value={log.quran.pagesRead} onChange={e => updateQuranLog(currentDate, { pagesRead: e.target.value })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                                <Checkbox label="" checked={getHabit('quran_read').completed} onChange={c => updateHabit(currentDate, 'quran_read', c)} />
                            </div>
                        </div>
                        <Checkbox label="سماع 5 صفحات" checked={getHabit('quran_listen').completed} onChange={c => updateHabit(currentDate, 'quran_listen', c)} />
                        <Checkbox label="تدبر صفحة" checked={getHabit('quran_tadabbur').completed} onChange={c => updateHabit(currentDate, 'quran_tadabbur', c)} />
                        <textarea placeholder="ملخص التدبر (1-2 سطر)" value={log.quran.tadabburSummary} onChange={e => updateQuranLog(currentDate, {tadabburSummary: e.target.value})} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" rows={2}></textarea>
                    </TimeBlock>

                     <TimeBlock title="منتصف الصباح / قيلولة" time="وقت القراءة والمراجعة" icon={ICONS.book}>
                        <div className="flex items-center gap-4">
                           <select value={log.reading.type} onChange={e => updateReadingLog(currentDate, { type: e.target.value as 'religious'|'self-dev' })} className="p-2 border rounded-md">
                                <option value="religious">كتاب ديني</option>
                                <option value="self-dev">تطوير ذات</option>
                           </select>
                           <input type="number" value={log.reading.duration} onChange={e => updateReadingLog(currentDate, { duration: parseInt(e.target.value) || 0 })} className="p-2 border rounded-md w-24" />
                           <span>دقيقة</span>
                           <Checkbox label="" checked={getHabit('reading').completed} onChange={c => updateHabit(currentDate, 'reading', c)} />
                        </div>
                     </TimeBlock>

                     <TimeBlock title="الظهر والعصر" time="صلوات ودراسة" icon={ICONS.ambulance}>
                        <p className="text-gray-700">صلاة الظهر والعصر في وقتها</p>
                        <div className="flex items-center gap-2">
                            <label>دراسة مهنية للإسعاف:</label>
                             <input type="number" value={log.professionalStudyMinutes} onChange={e => updateLog(currentDate, { professionalStudyMinutes: parseInt(e.target.value) || 0 })} className="p-2 border rounded-md w-24" />
                             <span>دقيقة</span>
                            <Checkbox label="" checked={getHabit('study_ambulance').completed} onChange={c => updateHabit(currentDate, 'study_ambulance', c)} />
                        </div>
                    </TimeBlock>

                    <TimeBlock title="المساء وقبل النوم" time="صلوات وأذكار ومراجعة" icon={ICONS.moon}>
                        <p className="text-gray-700">صلاة المغرب والعشاء</p>
                        <Checkbox label="أذكار المساء" checked={getHabit('evening_adhkar').completed} onChange={c => updateHabit(currentDate, 'evening_adhkar', c)} />
                        <div className="flex items-center gap-2">
                             <input type="text" placeholder="اسم حلقة البودكاست" value={log.podcast.episodeName} onChange={e => updatePodcastLog(currentDate, { episodeName: e.target.value })} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                             <Checkbox label="" checked={getHabit('podcast').completed} onChange={c => updateHabit(currentDate, 'podcast', c)} />
                        </div>
                    </TimeBlock>
                </div>
                
                <div className="space-y-6">
                    <Card title="مهام اليوم" icon={ICONS.checklist}>
                        {log.tasks.map(task => (
                            <div key={task.id} className="flex items-center mb-2">
                                <input type="checkbox" checked={task.completed} onChange={e => updateTask(currentDate, task.id, { completed: e.target.checked })} className="form-checkbox h-5 w-5 text-emerald-600 rounded me-2" />
                                <input type="text" value={task.text} onChange={e => updateTask(currentDate, task.id, { text: e.target.value })} placeholder="مهمة جديدة..." className="flex-grow p-1 border-b" />
                            </div>
                        ))}
                    </Card>

                    <Card title="مؤشرات اليوم" icon={ICONS.dashboard}>
                        <div className="space-y-2">
                             <label className="block">المزاج / التركيز (1-5):</label>
                             <input type="range" min="1" max="5" value={log.mood} onChange={e => updateLog(currentDate, { mood: parseInt(e.target.value) })} className="w-full" />
                             <label className="block">ساعات النوم:</label>
                             <input type="number" value={log.sleepHours} onChange={e => updateLog(currentDate, { sleepHours: parseInt(e.target.value) || 0 })} className="w-full p-2 border rounded-md" />
                        </div>
                    </Card>

                     <Card title="ملاحظات اليوم" icon={ICONS.notes}>
                        <textarea value={log.notes} onChange={e => updateLog(currentDate, { notes: e.target.value })} className="w-full p-2 border rounded-md" rows={4} placeholder="ما أنجزت، ما يحتاج تعديل..."></textarea>
                    </Card>
                </div>
            </div>
        </div>
    );
};
