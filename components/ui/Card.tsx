
import React from 'react';

interface CardProps {
  title: string;
  icon: JSX.Element;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, icon, children, className }) => {
  return (
    <div className={`bg-white rounded-lg border border-stone-200 p-4 ${className}`}>
      <div className="flex items-center mb-3 text-emerald-700">
        <span className="me-2">{icon}</span>
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
      <div className="text-gray-600">
        {children}
      </div>
    </div>
  );
};
