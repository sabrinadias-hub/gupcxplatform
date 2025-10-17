import React, { useEffect, useState } from 'react';
import type { Pillar } from '../types';
import { supabase } from '../lib/supabase';

interface PillarDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pillar: Pillar | null;
  menteeId: string | null;
}

const PillarDetailsModal: React.FC<PillarDetailsModalProps> = ({ isOpen, onClose, pillar, menteeId }) => {
  const [findings, setFindings] = useState('');
  const [responses, setResponses] = useState<Array<{ questionText: string; response: string; score: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen && pillar && menteeId) {
      loadPillarDetails();
    }
  }, [isOpen, pillar, menteeId]);

  const loadPillarDetails = async () => {
    if (!pillar || !menteeId) return;

    setIsLoading(true);
    try {
      const { data: pillarData, error: pillarError } = await supabase
        .from('pillars')
        .select('findings')
        .eq('mentee_id', menteeId)
        .eq('name', pillar.name)
        .maybeSingle();

      if (pillarError) throw pillarError;

      setFindings(pillarData?.findings || 'Nenhuma informação de diagnóstico disponível.');

      const { data: responsesData, error: responsesError } = await supabase
        .from('diagnosis_responses')
        .select('question_text, response, score')
        .eq('mentee_id', menteeId)
        .eq('axis_name', pillar.name)
        .order('created_at', { ascending: true });

      if (responsesError) throw responsesError;

      setResponses(responsesData || []);
    } catch (error) {
      console.error('Error loading pillar details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !pillar) return null;

  const maturityColors = {
    red: 'bg-red-100 text-red-800 border-red-300',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    green: 'bg-green-100 text-green-800 border-green-300'
  };

  const maturityLabels = {
    red: 'Inicial',
    yellow: 'Em Desenvolvimento',
    blue: 'Avançado',
    green: 'Excelente'
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="text-slate-600">{pillar.icon}</div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{pillar.name}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-bold text-blue-600">{pillar.score.toFixed(1)}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${maturityColors[pillar.maturityLevel]}`}>
                  {maturityLabels[pillar.maturityLevel]}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Respostas do Diagnóstico</h3>
                {responses.length > 0 ? (
                  <div className="space-y-4">
                    {responses.map((r, index) => (
                      <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-slate-800 flex-1">{r.questionText}</h4>
                          <span className="ml-3 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold">
                            {r.score.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm whitespace-pre-wrap">{r.response}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Nenhuma resposta de diagnóstico disponível para este pilar.</p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">Estatísticas</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-slate-600 mb-1">Sprints</p>
                    <p className="text-2xl font-bold text-slate-800">{pillar.sprints}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-slate-600 mb-1">Tarefas Concluídas</p>
                    <p className="text-2xl font-bold text-slate-800">{pillar.tasksCompleted}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <p className="text-sm text-slate-600 mb-1">Total de Tarefas</p>
                    <p className="text-2xl font-bold text-slate-800">{pillar.tasksTotal}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PillarDetailsModal;
