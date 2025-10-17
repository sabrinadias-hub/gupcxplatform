
import React from 'react';
import type { Activity, MaturityLevel } from '../types';

interface RecentActivityProps {
  activities: Activity[];
}

const maturityStyles: { [key in MaturityLevel]: { dot: string; text: string } } = {
  red: { dot: 'bg-rag-red-500', text: 'text-rag-red-800' },
  yellow: { dot: 'bg-rag-yellow-500', text: 'text-rag-yellow-800' },
  blue: { dot: 'bg-rag-blue-500', text: 'text-rag-blue-800' },
  green: { dot: 'bg-rag-green-500', text: 'text-rag-green-800' },
};

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <ul className="space-y-4">
      {activities.map((activity) => {
        const styles = maturityStyles[activity.maturityLevel];
        return (
          <li key={activity.id} className="flex items-start space-x-3">
            <div className={`mt-1.5 w-2.5 h-2.5 rounded-full ${styles.dot}`}></div>
            <div>
              <p className="text-sm text-slate-700">{activity.description}</p>
              <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                  <span className={`font-semibold ${styles.text}`}>{activity.pillar}</span>
                  <span>&bull;</span>
                  <span>{activity.timestamp}</span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default RecentActivity;
