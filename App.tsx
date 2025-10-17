import React, { useState } from 'react';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import PillarRadarChart from './components/PillarRadarChart';
import PillarCard from './components/PillarCard';
import SprintStructure from './components/SprintStructure';
import SprintPlanningModal from './components/SprintPlanningModal';
import { MENTEE_DATA, PILLAR_DATA, PROGRAMS } from './constants';
import { ChartBarIcon, CheckCircleIcon, RocketLaunchIcon } from './constants';
import type { Pillar, Program, Sprint } from './types';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);
  const [currentProgramId, setCurrentProgramId] = useState(MENTEE_DATA.programId);

  const handleOpenSprintModal = (pillar: Pillar) => {
    setSelectedPillar(pillar);
    setIsModalOpen(true);
  };

  const handleCloseSprintModal = () => {
    setIsModalOpen(false);
    setSelectedPillar(null);
  };

  const handleCreateSprint = (sprintData: Omit<Sprint, 'id'>) => {
    console.log("Creating new sprint:", { id: `sprint-${Date.now()}`, ...sprintData });
    // In a real app, you would handle the state update here
    handleCloseSprintModal();
  };
  
  const handleChangeProgram = (newProgramId: string) => {
    setCurrentProgramId(newProgramId);
    console.log(`Mentee ${MENTEE_DATA.name} moved to program ${newProgramId}`);
    // In a real app, this would be an API call to update the mentee's record
  };

  const currentProgram = PROGRAMS.find(p => p.id === currentProgramId);

  return (
    <>
      <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Header 
            menteeName={MENTEE_DATA.name} 
            programName={currentProgram?.name || 'N/A'}
            allPrograms={PROGRAMS}
            onChangeProgram={handleChangeProgram}
          />

          <main className="mt-6">
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <MetricCard 
                    title="Progresso Geral" 
                    value="67%" 
                    icon={<ChartBarIcon />} 
                    trend="+5% vs. Mês Anterior"
                  />
                  <MetricCard 
                    title="Tarefas Concluídas" 
                    value="45/78" 
                    icon={<CheckCircleIcon />} 
                    trend="+12 essa semana"
                  />
                  <MetricCard 
                    title="Sprints Ativos" 
                    value="4" 
                    icon={<RocketLaunchIcon />} 
                    trend="1 novo sprint"
                  />
                </div>

                {/* Pillars Grid */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Pilares de Maturidade</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {PILLAR_DATA.map((pillar: Pillar) => (
                      <PillarCard key={pillar.name} pillar={pillar} onSprintCreate={handleOpenSprintModal} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 h-[380px]">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Visão Geral dos Pilares</h2>
                  <PillarRadarChart data={PILLAR_DATA} />
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                  <SprintStructure />
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
      
      <SprintPlanningModal 
        isOpen={isModalOpen}
        onClose={handleCloseSprintModal}
        pillar={selectedPillar}
        programName={currentProgram?.name || 'N/A'}
        onCreateSprint={handleCreateSprint}
      />
    </>
  );
};

export default App;
