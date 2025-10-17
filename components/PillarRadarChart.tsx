import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { Pillar } from '../types';

interface PillarRadarChartProps {
  data: Pillar[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-sm">
        <p className="font-bold">{`${label}`}</p>
        <p className="text-indigo-600">{`Pontuação: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const PillarRadarChart: React.FC<PillarRadarChartProps> = ({ data }) => {
  const chartData = data.map(pillar => ({
    subject: pillar.name.replace(/ e | & /g, ' & '),
    score: pillar.score,
    fullMark: 5,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#475569', fontSize: 11 }} 
        />
        <PolarRadiusAxis 
            angle={30} 
            domain={[0, 5]} 
            tick={{ fill: '#64748b', fontSize: 10 }} 
        />
        <Radar 
            name="Maturidade" 
            dataKey="score" 
            stroke="#4f46e5" 
            fill="#4f46e5" 
            fillOpacity={0.2} 
        />
        <Tooltip content={<CustomTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default PillarRadarChart;