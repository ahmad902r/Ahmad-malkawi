
import React, { useMemo } from 'react';
import { usePlannerData } from '../../hooks/usePlannerData';
import { ICONS } from '../../constants';
import { exportToCSV } from '../../services/exportService';
import { DailyLog, Habit } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';


const StatCard: React.FC<{ title: string; value: string | number; icon: JSX.Element }> = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-lg shadow-md border border-stone-200 flex items-center">
        <div className="bg-emerald-100 text-emerald-700 p-3 rounded-full me-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);


export const DashboardView: React.FC<ReturnType<typeof usePlannerData>> = ({ data }) => {
    
    const stats = useMemo(() => {
        const logs = Object.values(data.logs);
        if (logs.length === 0) {
            return {
                overallCommitment: 0,
                currentStreak: 0,
                totalQuranPages: 0,
                totalStudyHours: 0,
            };
        }

        let totalHabits = 0;
        let completedHabits = 0;
        logs.forEach(log => {
            totalHabits += log.habits.length;
            completedHabits += log.habits.filter(h => h.completed).length;
        });

        // Streak calculation
        let currentStreak = 0;
        const sortedDates = Object.keys(data.logs).sort((a,b) => new Date(b).getTime() - new Date(a).getTime());
        const today = new Date();
        today.setHours(0,0,0,0);

        let dateToCheck = new Date(today);
        
        for (let i = 0; i < sortedDates.length; i++) {
             const logDate = new Date(sortedDates[i]);
             logDate.setHours(0,0,0,0);
             if (logDate.getTime() === dateToCheck.getTime()) {
                const log = data.logs[sortedDates[i]];
                const dayCommitment = log.habits.filter(h => h.completed).length / log.habits.length;
                if(dayCommitment > 0.5) { // Count as a streak day if more than 50% completed
                    currentStreak++;
                    dateToCheck.setDate(dateToCheck.getDate() - 1);
                } else {
                    break;
                }
             } else if (logDate.getTime() < dateToCheck.getTime()) {
                break; // Gap in days
             }
        }
        
        const totalQuranPages = logs.reduce((sum, log) => sum + (parseInt(log.quran.pagesRead) || 0), 0);
        const totalStudyHours = logs.reduce((sum, log) => sum + (log.professionalStudyMinutes || 0), 0) / 60;


        return {
            overallCommitment: totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0,
            currentStreak,
            totalQuranPages,
            totalStudyHours: totalStudyHours.toFixed(1),
        };
    }, [data.logs]);

    const chartData = useMemo(() => {
        const last30Days = [...Array(30)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();
        
        return last30Days.map(dateStr => {
            const log = data.logs[dateStr];
            const day = new Date(dateStr).getDate();
            if (!log) {
                return { name: day, الالتزام: 0 };
            }
            const commitment = log.habits.length > 0 ? (log.habits.filter(h => h.completed).length / log.habits.length) * 100 : 0;
            return { name: day, الالتزام: Math.round(commitment) };
        });

    }, [data.logs]);
    
    const categoryData = useMemo(() => {
        const categories: { [key: string]: { completed: number; total: number } } = {
            'عبادة': { completed: 0, total: 0 },
            'قرآن': { completed: 0, total: 0 },
            'قراءة': { completed: 0, total: 0 },
            'بودكاست': { completed: 0, total: 0 },
            'مهني': { completed: 0, total: 0 },
        };

        const categoryMap = {
            worship: 'عبادة',
            quran: 'قرآن',
            reading: 'قراءة',
            podcast: 'بودكاست',
            professional: 'مهني',
        };

        Object.values(data.logs).forEach(log => {
            log.habits.forEach(habit => {
                const catName = categoryMap[habit.category];
                if (catName) {
                    categories[catName].total++;
                    if (habit.completed) {
                        categories[catName].completed++;
                    }
                }
            });
        });
        
        return Object.entries(categories).map(([name, counts]) => ({
            name,
            'النسبة': counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0
        }));

    }, [data.logs]);


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">لوحة المتابعة</h2>
                <button
                    onClick={() => exportToCSV(data)}
                    className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors flex items-center no-print"
                >
                    <span className="me-2">{ICONS.checklist}</span>
                    تصدير بيانات CSV
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="الالتزام العام" value={`${stats.overallCommitment}%`} icon={ICONS.checklist} />
                <StatCard title="أطول سلسلة التزام" value={`${stats.currentStreak} أيام`} icon={ICONS.daily} />
                <StatCard title="مجموع صفحات القرآن" value={stats.totalQuranPages} icon={ICONS.quran} />
                <StatCard title="ساعات الدراسة" value={stats.totalStudyHours} icon={ICONS.ambulance} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-4 rounded-lg shadow-md border border-stone-200">
                    <h3 className="font-bold text-lg mb-4 text-emerald-700">مخطط الالتزام اليومي (آخر 30 يوم)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis unit="%" />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="الالتزام" stroke="#10b981" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md border border-stone-200">
                     <h3 className="font-bold text-lg mb-4 text-emerald-700">توزيع الالتزام حسب الفئة</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis unit="%" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="النسبة" fill="#10b981" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
