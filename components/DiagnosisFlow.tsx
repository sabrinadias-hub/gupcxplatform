import React, { useState } from 'react';
import { DIAGNOSIS_AXES } from '../lib/diagnosisData';
import type { MaturityLevel } from '../types';

interface AxisAssessment {
  axisId: string;
  axisName: string;
  maturityLevel: MaturityLevel;
  notes: string;
}

interface DiagnosisFlowProps {
  onComplete: (
    menteeName: string,
    programId: string,
    assessments: AxisAssessment[]
  ) => void;
}

const PROGRAMS = [
  { id: 'prog-start', name: 'START' },
  { id: 'prog-exclusive', name: 'EXCLUSIVE' },
  { id: 'prog-hibrido', name: 'HÍBRIDO' }
];

const MATURITY_LEVELS: Array<{
  level: MaturityLevel;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = [
  {
    level: 'red',
    label: 'Fundação',
    description: 'Processos iniciais ou inexistentes',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-400'
  },
  {
    level: 'yellow',
    label: 'Em Desenvolvimento',
    description: 'Processos básicos implementados',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-400'
  },
  {
    level: 'blue',
    label: 'Avançado',
    description: 'Processos estruturados e funcionando',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-400'
  },
  {
    level: 'green',
    label: 'Excelência',
    description: 'Processos otimizados e em melhoria contínua',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-400'
  }
];

const DiagnosisFlow: React.FC<DiagnosisFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [menteeName, setMenteeName] = useState('');
  const [programId, setProgramId] = useState('prog-start');
  const [currentAxisIndex, setCurrentAxisIndex] = useState(0);
  const [assessments, setAssessments] = useState<AxisAssessment[]>([]);
  const [currentMaturityLevel, setCurrentMaturityLevel] = useState<MaturityLevel | null>(null);
  const [currentNotes, setCurrentNotes] = useState('');
  const [showQuestions, setShowQuestions] = useState(false);

  const currentAxis = DIAGNOSIS_AXES[currentAxisIndex];
  const progress = ((currentAxisIndex + 1) / DIAGNOSIS_AXES.length) * 100;

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (menteeName.trim()) {
      setStep(1);
    }
  };

  const handleProgramSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleAxisSubmit = () => {
    if (!currentMaturityLevel) {
      alert('Por favor, selecione um nível de maturidade.');
      return;
    }

    const assessment: AxisAssessment = {
      axisId: currentAxis.id,
      axisName: currentAxis.name,
      maturityLevel: currentMaturityLevel,
      notes: currentNotes
    };

    const newAssessments = [...assessments, assessment];
    setAssessments(newAssessments);

    if (currentAxisIndex < DIAGNOSIS_AXES.length - 1) {
      setCurrentAxisIndex(currentAxisIndex + 1);
      setCurrentMaturityLevel(null);
      setCurrentNotes('');
      setShowQuestions(false);
    } else {
      onComplete(menteeName, programId, newAssessments);
    }
  };

  const handleBack = () => {
    if (currentAxisIndex > 0) {
      const previousAssessment = assessments[assessments.length - 1];
      setCurrentAxisIndex(currentAxisIndex - 1);
      setCurrentMaturityLevel(previousAssessment?.maturityLevel || null);
      setCurrentNotes(previousAssessment?.notes || '');
      setAssessments(assessments.slice(0, -1));
      setShowQuestions(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-100 to-slate-200 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl p-8 my-8">
        {step === 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Bem-vindo ao GrowUp CX</h1>
              <p className="text-slate-600">Vamos começar o diagnóstico de maturidade empresarial</p>
            </div>

            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <label htmlFor="menteeName" className="block text-sm font-medium text-slate-700 mb-2">
                  Qual é o nome do mentorado?
                </label>
                <input
                  type="text"
                  id="menteeName"
                  value={menteeName}
                  onChange={(e) => setMenteeName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="Digite o nome completo"
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Continuar
              </button>
            </form>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Olá, {menteeName}!</h2>
              <p className="text-slate-600">Qual programa você está participando?</p>
            </div>

            <form onSubmit={handleProgramSubmit} className="space-y-4">
              <div className="space-y-3">
                {PROGRAMS.map((program) => (
                  <label
                    key={program.id}
                    className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      programId === program.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="program"
                      value={program.id}
                      checked={programId === program.id}
                      onChange={(e) => setProgramId(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-3 text-lg font-medium text-slate-800">{program.name}</span>
                  </label>
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Iniciar Diagnóstico
              </button>
            </form>
          </div>
        )}

        {step === 2 && currentAxis && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{currentAxis.name}</h2>
                  <p className="text-sm text-slate-500">
                    Eixo {currentAxisIndex + 1} de {DIAGNOSIS_AXES.length}
                  </p>
                </div>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                Selecione o nível de maturidade atual
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {MATURITY_LEVELS.map((level) => (
                  <label
                    key={level.level}
                    className={`flex flex-col p-4 rounded-xl cursor-pointer transition-all border-2 ${
                      currentMaturityLevel === level.level
                        ? `${level.borderColor} ${level.bgColor}`
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="maturityLevel"
                        value={level.level}
                        checked={currentMaturityLevel === level.level}
                        onChange={(e) => setCurrentMaturityLevel(e.target.value as MaturityLevel)}
                        className="w-5 h-5"
                      />
                      <span className={`ml-3 text-lg font-bold ${level.color}`}>
                        {level.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 ml-8">{level.description}</p>
                  </label>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-300">
                <button
                  type="button"
                  onClick={() => setShowQuestions(!showQuestions)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform ${showQuestions ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  {showQuestions ? 'Ocultar' : 'Ver'} questões de referência
                </button>

                {showQuestions && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                    <h4 className="font-semibold text-slate-800 mb-3">Questões de referência:</h4>
                    <ul className="space-y-2 list-disc list-inside text-sm text-slate-700">
                      {currentAxis.questions.map((q, idx) => (
                        <li key={q.id}>{q.text}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  value={currentNotes}
                  onChange={(e) => setCurrentNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="Adicione observações, detalhes ou contexto sobre este eixo..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              {currentAxisIndex > 0 && (
                <button
                  onClick={handleBack}
                  className="flex-1 bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl hover:bg-slate-300 transition-colors duration-200"
                >
                  Voltar
                </button>
              )}

              <button
                onClick={handleAxisSubmit}
                disabled={!currentMaturityLevel}
                className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {currentAxisIndex < DIAGNOSIS_AXES.length - 1 ? 'Próximo Eixo' : 'Concluir Diagnóstico'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisFlow;
