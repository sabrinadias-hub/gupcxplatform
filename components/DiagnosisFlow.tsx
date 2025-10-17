import React, { useState } from 'react';
import type { MaturityLevel } from '../types';

interface PillarAssessment {
  name: string;
  score: number;
  maturityLevel: MaturityLevel;
}

interface DiagnosisFlowProps {
  onComplete: (menteeName: string, programId: string, assessments: PillarAssessment[]) => void;
}

const PILLARS = [
  'Sócios',
  'Finanças',
  'Folha',
  'Clientes',
  'Vendas',
  'IA & Automação',
  'Reforma Tributária',
  'Estratégia'
];

const PROGRAMS = [
  { id: 'prog-start', name: 'START' },
  { id: 'prog-exclusive', name: 'EXCLUSIVE' },
  { id: 'prog-hibrido', name: 'HÍBRIDO' }
];

const getMaturityLevel = (score: number): MaturityLevel => {
  if (score < 2) return 'red';
  if (score < 3) return 'yellow';
  if (score < 4) return 'blue';
  return 'green';
};

const DiagnosisFlow: React.FC<DiagnosisFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [menteeName, setMenteeName] = useState('');
  const [programId, setProgramId] = useState('prog-start');
  const [currentPillarIndex, setCurrentPillarIndex] = useState(0);
  const [assessments, setAssessments] = useState<PillarAssessment[]>([]);
  const [currentScore, setCurrentScore] = useState(0);

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

  const handleScoreSubmit = () => {
    const newAssessment: PillarAssessment = {
      name: PILLARS[currentPillarIndex],
      score: currentScore,
      maturityLevel: getMaturityLevel(currentScore)
    };

    const newAssessments = [...assessments, newAssessment];
    setAssessments(newAssessments);

    if (currentPillarIndex < PILLARS.length - 1) {
      setCurrentPillarIndex(currentPillarIndex + 1);
      setCurrentScore(0);
    } else {
      onComplete(menteeName, programId, newAssessments);
    }
  };

  const progress = step === 2 ? ((currentPillarIndex + 1) / PILLARS.length) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-100 to-slate-200 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8">
        {step === 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Bem-vindo ao GrowUp CX</h1>
              <p className="text-slate-600">Vamos começar sua jornada de diagnóstico</p>
            </div>

            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <label htmlFor="menteeName" className="block text-sm font-medium text-slate-700 mb-2">
                  Qual é o seu nome?
                </label>
                <input
                  type="text"
                  id="menteeName"
                  value={menteeName}
                  onChange={(e) => setMenteeName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="Digite seu nome completo"
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

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-slate-800">Diagnóstico de Maturidade</h2>
                <span className="text-sm text-slate-600">
                  {currentPillarIndex + 1} de {PILLARS.length}
                </span>
              </div>

              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="text-center py-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                {PILLARS[currentPillarIndex]}
              </h3>
              <p className="text-slate-600 mb-8">
                Avalie o nível atual de maturidade deste pilar
              </p>

              <div className="space-y-6">
                <div className="flex justify-between items-center px-4">
                  <span className="text-sm text-slate-600">0</span>
                  <span className="text-4xl font-bold text-blue-600">{currentScore.toFixed(1)}</span>
                  <span className="text-sm text-slate-600">5</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={currentScore}
                  onChange={(e) => setCurrentScore(parseFloat(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                <div className="grid grid-cols-4 gap-2 text-xs text-slate-600">
                  <div className="text-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-1"></div>
                    <span>0-2: Inicial</span>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                    <span>2-3: Em Desenvolvimento</span>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-1"></div>
                    <span>3-4: Avançado</span>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-1"></div>
                    <span>4-5: Excelente</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {currentPillarIndex > 0 && (
                <button
                  onClick={() => {
                    setCurrentPillarIndex(currentPillarIndex - 1);
                    setCurrentScore(assessments[currentPillarIndex - 1]?.score || 0);
                    setAssessments(assessments.slice(0, -1));
                  }}
                  className="flex-1 bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl hover:bg-slate-300 transition-colors duration-200"
                >
                  Voltar
                </button>
              )}

              <button
                onClick={handleScoreSubmit}
                className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {currentPillarIndex < PILLARS.length - 1 ? 'Próximo Pilar' : 'Concluir Diagnóstico'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisFlow;
