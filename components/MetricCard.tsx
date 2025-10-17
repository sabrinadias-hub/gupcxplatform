
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="text-slate-400">
            {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{trend}</p>
    </div>
  );
};

export default MetricCard;
