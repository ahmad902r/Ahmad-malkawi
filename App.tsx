
import React, { useState } from 'react';
import { DailyView } from './components/planner/DailyView';
import { WeeklyView } from './components/planner/WeeklyView';
import { MonthlyView } from './components/planner/MonthlyView';
import { YearlyView } from './components/planner/YearlyView';
import { DashboardView } from './components/dashboard/DashboardView';
import { usePlannerData } from './hooks/usePlannerData';
import { ICONS } from './constants';

type View = 'DASHBOARD' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  const plannerData = usePlannerData();

  const renderView = () => {
    switch (currentView) {
      case 'DAILY':
        return <DailyView {...plannerData} />;
      case 'WEEKLY':
        return <WeeklyView {...plannerData} />;
      case 'MONTHLY':
        return <MonthlyView {...plannerData} />;
      case 'YEARLY':
        return <YearlyView {...plannerData} />;
      case 'DASHBOARD':
      default:
        return <DashboardView {...plannerData} />;
    }
  };
  
  const handlePrint = () => {
    window.print();
  };

  const navItems: { view: View; label: string; icon: JSX.Element }[] = [
    { view: 'DASHBOARD', label: 'لوحة المتابعة', icon: ICONS.dashboard },
    { view: 'DAILY', label: 'المخطط اليومي', icon: ICONS.daily },
    { view: 'WEEKLY', label: 'المخطط الأسبوعي', icon: ICONS.weekly },
    { view: 'MONTHLY', label: 'المخطط الشهري', icon: ICONS.monthly },
    { view: 'YEARLY', label: 'المخطط السنوي', icon: ICONS.yearly },
  ];

  return (
    <div className="bg-stone-100 min-h-screen text-gray-800 flex">
      <aside className="w-64 bg-white shadow-lg p-4 flex-col justify-between no-print hidden md:flex">
        <div>
          <h1 className="text-2xl font-bold text-emerald-800 mb-8 text-center">مخطط الحياة</h1>
          <nav>
            <ul>
              {navItems.map(item => (
                <li key={item.view} className="mb-2">
                  <button
                    onClick={() => setCurrentView(item.view)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors text-right ${
                      currentView === item.view
                        ? 'bg-emerald-100 text-emerald-800 font-bold'
                        : 'hover:bg-stone-100'
                    }`}
                  >
                    <span className="me-3">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8">
            <button
                onClick={handlePrint}
                className="w-full flex items-center justify-center p-3 rounded-lg transition-colors bg-sky-600 text-white hover:bg-sky-700 font-bold"
            >
                <span className="me-3">{ICONS.print}</span>
                طباعة / تصدير PDF
            </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="print-container bg-white p-6 rounded-lg shadow-md">
            {renderView()}
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-t-lg p-2 flex justify-around no-print border-t">
        {navItems.map(item => (
            <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors text-xs ${
                currentView === item.view ? 'text-emerald-700' : 'text-gray-500'
            }`}
            >
            {item.icon}
            <span className="mt-1">{item.label}</span>
            </button>
        ))}
      </div>
    </div>
  );
};

export default App;
