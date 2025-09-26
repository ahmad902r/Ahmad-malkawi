
import React, { useState } from 'react';
import { usePlannerData } from '../../hooks/usePlannerData';
import { ICONS } from '../../constants';
import { Card } from '../ui/Card';

export const MonthlyView: React.FC<ReturnType<typeof usePlannerData>> = ({ data, getLogForDate }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const handleMonthChange = (offset: number) => {
        setCurrentDate(new Date(year, month + offset, 1));
    };

    const getCommitmentColor = (dateStr: string) => {
        const log = data.logs[dateStr];
        if (!log) return 'bg-gray-100';
        const completed = log.habits.filter(h => h.completed).length;
        const total = log.habits.length;
        if (total === 0) return 'bg-gray-100';
        const ratio = completed / total;
        if (ratio > 0.75) return 'bg-emerald-400';
        if (ratio > 0.5) return 'bg-emerald-300';
        if (ratio > 0.25) return 'bg-emerald-200';
        if (ratio > 0) return 'bg-emerald-100';
        return 'bg-gray-100';
    };
    
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthlyGoals = data.monthlyGoals[monthKey] || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <button onClick={() => handleMonthChange(-1)} className="px-4 py-2 bg-stone-200 rounded-md hover:bg-stone-300">الشهر السابق</button>
                <h2 className="text-3xl font-bold text-gray-800">
                    {new Intl.DateTimeFormat('ar-SA', { month: 'long', year: 'numeric' }).format(currentDate)}
                </h2>
                <button onClick={() => handleMonthChange(1)} className="px-4 py-2 bg-stone-200 rounded-md hover:bg-stone-300">الشهر التالي</button>
            </div>
            
            <Card title="أهداف الشهر" icon={ICONS.checklist}>
                <textarea className="w-full p-2 border rounded-md" rows={4} placeholder="اكتب 3-5 أهداف ذكية SMART لهذا الشهر..."></textarea>
            </Card>

            <Card title="تقويم الشهر" icon={ICONS.monthly}>
                <div className="grid grid-cols-7 gap-1 text-center">
                    {['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'].map(day => (
                        <div key={day} className="font-bold text-gray-500 p-2">{day}</div>
                    ))}
                    {Array.from({ length: startDayOfWeek }).map((_, i) => (
                        <div key={`empty-${i}`} className="border rounded-md bg-gray-50"></div>
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        return (
                            <div key={day} className={`border rounded-md h-16 flex items-center justify-center ${getCommitmentColor(dateStr)}`}>
                                <span className="text-gray-800 font-medium">{day}</span>
                            </div>
                        );
                    })}
                </div>
                <div className="flex space-x-4 mt-4 items-center justify-end">
                    <span className="text-sm">مفتاح الالتزام:</span>
                    <div className="flex items-center"><div className="w-4 h-4 bg-emerald-100 me-1"></div><span className="text-xs">ضعيف</span></div>
                    <div className="flex items-center"><div className="w-4 h-4 bg-emerald-200 me-1"></div><span className="text-xs">مقبول</span></div>
                    <div className="flex items-center"><div className="w-4 h-4 bg-emerald-300 me-1"></div><span className="text-xs">جيد</span></div>
                    <div className="flex items-center"><div className="w-4 h-4 bg-emerald-400 me-1"></div><span className="text-xs">ممتاز</span></div>
                </div>
            </Card>

             <Card title="ملخص إنجازات الشهر" icon={ICONS.dashboard}>
                 <p>سيتم عرض ملخص لتقدم حفظ القرآن، حلقات البودكاست، وساعات الدراسة هنا.</p>
             </Card>
        </div>
    );
};
