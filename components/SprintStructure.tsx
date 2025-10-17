import React from 'react';
import { WrenchIcon } from '../constants';

const sprintData = [
  {
    stage: '1. Sprint Planning (Planejamento)',
    objective: 'Definir o que será feito na sprint',
    output: 'Backlog priorizado + metas da sprint',
  },
  {
    stage: '2. Daily Standup (Reuniões diárias)',
    objective: 'Acompanhar progresso e remover bloqueios',
    output: 'Status diário + plano ajustado',
  },
  {
    stage: '3. Execução',
    objective: 'Realizar as tarefas planejadas',
    output: 'Entregas em andamento',
  },
  {
    stage: '4. Sprint Review (Revisão)',
    objective: 'Apresentar o que foi entregue',
    output: 'Demonstração do incremento do produto',
  },
  {
    stage: '5. Sprint Retrospective (Retro)',
    objective: 'Analisar e melhorar o processo',
    output: 'Plano de melhorias internas',
  },
];

const SprintStructure: React.FC = () => {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="text-slate-500">
          <WrenchIcon />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Estrutura de Sprint</h2>
      </div>
      <p className="text-sm text-slate-500 mt-1 mb-6">Cada sprint segue uma sequência bem definida:</p>

      <div className="space-y-1 text-sm">
        {/* Header */}
        <div className="grid grid-cols-10 gap-4 font-semibold text-slate-600 border-b pb-2">
          <div className="col-span-3">Etapa</div>
          <div className="col-span-3">Objetivo</div>
          <div className="col-span-4">Principais Saídas</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
            {sprintData.map((item, index) => (
            <div key={index} className="grid grid-cols-10 gap-4 items-start py-3">
                <div className="col-span-3 font-medium text-slate-800">{item.stage}</div>
                <div className="col-span-3 text-slate-600">{item.objective}</div>
                <div className="col-span-4 text-slate-600">{item.output}</div>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SprintStructure;
