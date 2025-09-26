
import React from 'react';
import { usePlannerData } from '../../hooks/usePlannerData';
import { ICONS } from '../../constants';
import { Card } from '../ui/Card';

export const YearlyView: React.FC<ReturnType<typeof usePlannerData>> = ({ data }) => {
    const year = new Date().getFullYear();

    const quarterGoals: { title: string, placeholder: string }[] = [
        { title: 'الربع الأول (يناير - مارس)', placeholder: 'أهداف الربع الأول...' },
        { title: 'الربع الثاني (أبريل - يونيو)', placeholder: 'أهداف الربع الثاني...' },
        { title: 'الربع الثالث (يوليو - سبتمبر)', placeholder: 'أهداف الربع الثالث...' },
        { title: 'الربع الرابع (أكتوبر - ديسمبر)', placeholder: 'أهداف الربع الرابع...' },
    ];
    
    return (
        <div className="space-y-6">
             <h2 className="text-3xl font-bold text-gray-800">المخطط السنوي لعام {year}</h2>

             <Card title="الأهداف السنوية الكبرى" icon={ICONS.yearly}>
                <textarea className="w-full p-2 border rounded-md" rows={5} placeholder="اكتب أهدافك الكبرى لهذا العام..."></textarea>
             </Card>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {quarterGoals.map(q => (
                    <Card key={q.title} title={q.title} icon={ICONS.checklist}>
                        <textarea className="w-full p-2 border rounded-md" rows={4} placeholder={q.placeholder}></textarea>
                    </Card>
                ))}
             </div>
             
             <Card title="مراجعة نهاية السنة" icon={ICONS.notes}>
                <div className="space-y-4">
                     <div>
                        <label className="font-semibold block mb-1">أهم الإنجازات:</label>
                        <textarea className="w-full p-2 border rounded-md" rows={3}></textarea>
                    </div>
                     <div>
                        <label className="font-semibold block mb-1">دروس مستفادة:</label>
                        <textarea className="w-full p-2 border rounded-md" rows={3}></textarea>
                    </div>
                     <div>
                        <label className="font-semibold block mb-1">أهداف العام القادم:</label>
                        <textarea className="w-full p-2 border rounded-md" rows={3}></textarea>
                    </div>
                </div>
             </Card>
        </div>
    );
};
