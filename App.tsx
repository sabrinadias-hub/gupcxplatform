import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import PillarRadarChart from './components/PillarRadarChart';
import PillarCard from './components/PillarCard';
import SprintStructure from './components/SprintStructure';
import SprintPlanningModal from './components/SprintPlanningModal';
import DiagnosisFlow from './components/DiagnosisFlow';
import { PROGRAMS } from './constants';
import { ChartBarIcon, CheckCircleIcon, RocketLaunchIcon, UsersIcon, CurrencyDollarIcon, ClipboardListIcon, UserGroupIcon, TrendingUpIcon, LightBulbIcon, ScaleIcon } from './constants';
import type { Pillar, Sprint, MaturityLevel } from './types';
import { supabase } from './lib/supabase';

const PILLAR_ICONS: { [key: string]: React.ReactNode } = {
  'Sócios': <UsersIcon />,
  'Finanças': <CurrencyDollarIcon />,
  'Folha': <ClipboardListIcon />,
  'Clientes': <UserGroupIcon />,
  'Vendas': <TrendingUpIcon />,
  'IA & Automação': <LightBulbIcon />,
  'Reforma Tributária': <ScaleIcon />,
  'Estratégia': <RocketLaunchIcon />,
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [menteeId, setMenteeId] = useState<string | null>(null);
  const [menteeName, setMenteeName] = useState('');
  const [currentProgramId, setCurrentProgramId] = useState('prog-start');
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<Pillar | null>(null);

  useEffect(() => {
    checkForExistingMentee();
  }, []);

  const checkForExistingMentee = async () => {
    try {
      const { data: mentees, error } = await supabase
        .from('mentees')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (mentees) {
        setMenteeId(mentees.id);
        setMenteeName(mentees.name);
        setCurrentProgramId(mentees.program_id);
        await loadPillars(mentees.id);
      } else {
        setShowDiagnosis(true);
      }
    } catch (error) {
      console.error('Error checking for mentee:', error);
      setShowDiagnosis(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPillars = async (menteeId: string) => {
    try {
      const { data, error } = await supabase
        .from('pillars')
        .select('*')
        .eq('mentee_id', menteeId);

      if (error) throw error;

      const pillarData: Pillar[] = (data || []).map((p) => ({
        name: p.name,
        score: parseFloat(p.score),
        maturityLevel: p.maturity_level as MaturityLevel,
        icon: PILLAR_ICONS[p.name] || <RocketLaunchIcon />,
        sprints: p.sprints || 0,
        tasksCompleted: p.tasks_completed || 0,
        tasksTotal: p.tasks_total || 0,
      }));

      setPillars(pillarData);
    } catch (error) {
      console.error('Error loading pillars:', error);
    }
  };

  const handleDiagnosisComplete = async (
    name: string,
    programId: string,
    assessments: Array<{ name: string; score: number; maturityLevel: MaturityLevel }>
  ) => {
    try {
      const { data: newMentee, error: menteeError } = await supabase
        .from('mentees')
        .insert({
          name,
          program_id: programId,
          avatar_url: `https://i.pravatar.cc/150?u=${name.toLowerCase().replace(/\s+/g, '-')}`
        })
        .select()
        .single();

      if (menteeError) throw menteeError;

      const pillarInserts = assessments.map((assessment) => ({
        mentee_id: newMentee.id,
        name: assessment.name,
        score: assessment.score,
        maturity_level: assessment.maturityLevel,
        sprints: 0,
        tasks_completed: 0,
        tasks_total: 0,
      }));

      const { error: pillarsError } = await supabase
        .from('pillars')
        .insert(pillarInserts);

      if (pillarsError) throw pillarsError;

      setMenteeId(newMentee.id);
      setMenteeName(newMentee.name);
      setCurrentProgramId(newMentee.program_id);
      setShowDiagnosis(false);
      await loadPillars(newMentee.id);
    } catch (error) {
      console.error('Error completing diagnosis:', error);
      alert('Erro ao salvar diagnóstico. Por favor, tente novamente.');
    }
  };

  const handleOpenSprintModal = (pillar: Pillar) => {
    setSelectedPillar(pillar);
    setIsModalOpen(true);
  };

  const handleCloseSprintModal = () => {
    setIsModalOpen(false);
    setSelectedPillar(null);
  };

  const handleCreateSprint = async (sprintData: Omit<Sprint, 'id'>) => {
    if (!menteeId) return;

    try {
      const { error } = await supabase
        .from('sprints')
        .insert({
          mentee_id: menteeId,
          pillar_name: sprintData.pillarName,
          sprint_name: sprintData.sprintName,
          sprint_goal: sprintData.sprintGoal,
          tasks: sprintData.tasks,
          status: 'active'
        });

      if (error) throw error;

      await loadPillars(menteeId);
      handleCloseSprintModal();
    } catch (error) {
      console.error('Error creating sprint:', error);
      alert('Erro ao criar sprint. Por favor, tente novamente.');
    }
  };

  const handleChangeProgram = async (newProgramId: string) => {
    if (!menteeId) return;

    try {
      const { error } = await supabase
        .from('mentees')
        .update({ program_id: newProgramId })
        .eq('id', menteeId);

      if (error) throw error;

      setCurrentProgramId(newProgramId);
    } catch (error) {
      console.error('Error changing program:', error);
      alert('Erro ao alterar programa. Por favor, tente novamente.');
    }
  };

  const handleStartNewDiagnosis = () => {
    setShowDiagnosis(true);
  };

  const currentProgram = PROGRAMS.find(p => p.id === currentProgramId);

  if (isLoading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (showDiagnosis) {
    return <DiagnosisFlow onComplete={handleDiagnosisComplete} />;
  }

  const totalTasks = pillars.reduce((sum, p) => sum + p.tasksTotal, 0);
  const completedTasks = pillars.reduce((sum, p) => sum + p.tasksCompleted, 0);
  const activeSprints = pillars.reduce((sum, p) => sum + p.sprints, 0);
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <>
      <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <Header
              menteeName={menteeName}
              programName={currentProgram?.name || 'N/A'}
              allPrograms={PROGRAMS}
              onChangeProgram={handleChangeProgram}
            />
            <button
              onClick={handleStartNewDiagnosis}
              className="mt-4 bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Novo Diagnóstico
            </button>
          </div>

          <main className="mt-6">
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <MetricCard
                    title="Progresso Geral"
                    value={`${overallProgress}%`}
                    icon={<ChartBarIcon />}
                    trend={`${pillars.length} pilares avaliados`}
                  />
                  <MetricCard
                    title="Tarefas Concluídas"
                    value={`${completedTasks}/${totalTasks}`}
                    icon={<CheckCircleIcon />}
                    trend={totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% completo` : 'Nenhuma tarefa'}
                  />
                  <MetricCard
                    title="Sprints Ativos"
                    value={activeSprints.toString()}
                    icon={<RocketLaunchIcon />}
                    trend={activeSprints === 1 ? '1 sprint ativo' : `${activeSprints} sprints ativos`}
                  />
                </div>

                {/* Pillars Grid */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Pilares de Maturidade</h2>
                  {pillars.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {pillars.map((pillar: Pillar) => (
                        <PillarCard key={pillar.name} pillar={pillar} onSprintCreate={handleOpenSprintModal} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <p>Nenhum pilar avaliado ainda.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 h-[380px]">
                  <h2 className="text-xl font-bold text-slate-800 mb-4">Visão Geral dos Pilares</h2>
                  {pillars.length > 0 ? (
                    <PillarRadarChart data={pillars} />
                  ) : (
                    <div className="flex items-center justify-center h-[calc(100%-2rem)] text-slate-400">
                      <p>Aguardando dados dos pilares</p>
                    </div>
                  )}
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
