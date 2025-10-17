import React from 'react';
import type { Pillar, MaturityLevel } from '../types';
import { PlusCircleIcon } from '../constants';

interface PillarCardProps {
  pillar: Pillar;
  onSprintCreate: (pillar: Pillar) => void;
}

const maturityStyles: { [key in MaturityLevel]: { bg: string; text: string; name: string } } = {
  red: { bg: 'bg-rag-red-100', text: 'text-rag-red-800', name: 'Fundação' },
  yellow: { bg: 'bg-rag-yellow-100', text: 'text-rag-yellow-800', name: 'Desenvolvimento' },
  blue: { bg: 'bg-rag-blue-100', text: 'text-rag-blue-800', name: 'Avançado' },
  green: { bg: 'bg-rag-green-100', text: 'text-rag-green-800', name: 'Excelência' },
};

const PillarCard: React.FC<PillarCardProps> = ({ pillar, onSprintCreate }) => {
  const styles = maturityStyles[pillar.maturityLevel];

  return (
    <div className="group relative flex flex-col justify-between p-4 rounded-xl border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-slate-50/50">
      <div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${styles.bg} ${styles.text}`}>
          {pillar.icon}
        </div>
        <h3 className="font-bold text-slate-800 mt-3 text-sm">{pillar.name}</h3>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles.bg} ${styles.text}`}>
          {styles.name}
        </span>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-baseline">
          <span className="text-2xl font-bold text-slate-800">{pillar.score.toFixed(1)}</span>
          <span className="text-xs text-slate-500 font-medium">/ 5.0</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
          <div 
            className={`h-1.5 rounded-full ${styles.bg.replace('-100', '-500')}`} 
            style={{ width: `${pillar.score*20}%` }}>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSprintCreate(pillar);
          }}
          className="flex items-center gap-2 bg-white text-slate-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-slate-100 transition-colors duration-200 text-sm">
          <PlusCircleIcon />
          Criar Sprint
        </button>
      </div>
    </div>
  );
};

export default PillarCard;