
import React from 'react';
import { usePlannerData } from '../../hooks/usePlannerData';
import { ICONS } from '../../constants';
import { Card } from '../ui/Card';

export const WeeklyView: React.FC<ReturnType<typeof usePlannerData>> = ({ data, getLogForDate }) => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1))); // Monday as start

    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(date.getDate() + i);
        return date.toISOString().split('T')[0];
    });

    const habits = getLogForDate(weekDates[0]).habits.map(h => ({id: h.id, name: h.name}));

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">الملخص الأسبوعي</h2>
            
            <Card title="أهداف الأسبوع" icon={ICONS.checklist}>
                <textarea className="w-full p-2 border rounded-md" rows={4} placeholder="اكتب أهدافك لهذا الأسبوع..."></textarea>
            </Card>

            <Card title="مخطط الالتزام الأسبوعي" icon={ICONS.weekly}>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-stone-50">
                                <th className="py-2 px-4 border-b text-right font-semibold text-gray-600">العادة</th>
                                {weekDates.map(dateStr => (
                                    <th key={dateStr} className="py-2 px-4 border-b text-center font-semibold text-gray-600">
                                        {new Intl.DateTimeFormat('ar-SA', { weekday: 'short' }).format(new Date(dateStr))}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map(habit => (
                                <tr key={habit.id}>
                                    <td className="py-2 px-4 border-b">{habit.name}</td>
                                    {weekDates.map(dateStr => {
                                        const log = getLogForDate(dateStr);
                                        const habitStatus = log.habits.find(h => h.id === habit.id);
                                        return (
                                            <td key={dateStr} className="py-2 px-4 border-b text-center">
                                                {habitStatus?.completed ? (
                                                    <span className="text-emerald-500 text-2xl">✓</span>
                                                ) : (
                                                    <span className="text-red-300 text-2xl">✗</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card title="مراجعة الأسبوع" icon={ICONS.notes}>
                <div className="space-y-4">
                    <div>
                        <label className="font-semibold block mb-1">ماذا أنجزت؟</label>
                        <textarea className="w-full p-2 border rounded-md" rows={2}></textarea>
                    </div>
                    <div>
                        <label className="font-semibold block mb-1">ما الذي أخلفته؟ ولماذا؟</label>
                        <textarea className="w-full p-2 border rounded-md" rows={2}></textarea>
                    </div>
                    <div>
                        <label className="font-semibold block mb-1">ماذا سأطور الأسبوع القادم؟</label>
                        <textarea className="w-full p-2 border rounded-md" rows={2}></textarea>
                    </div>
                </div>
            </Card>
        </div>
    );
};
