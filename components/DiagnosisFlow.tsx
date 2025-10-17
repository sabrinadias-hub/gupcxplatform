import React, { useState } from 'react';
import { DIAGNOSIS_AXES, getMaturityLevel } from '../lib/diagnosisData';

interface AxisResponse {
  axisId: string;
  axisName: string;
  questionId: string;
  questionText: string;
  response: string;
  score: number;
}

interface DiagnosisFlowProps {
  onComplete: (
    menteeName: string,
    programId: string,
    responses: AxisResponse[]
  ) => void;
}

const PROGRAMS = [
  { id: 'prog-start', name: 'START' },
  { id: 'prog-exclusive', name: 'EXCLUSIVE' },
  { id: 'prog-hibrido', name: 'HÍBRIDO' }
];

const DiagnosisFlow: React.FC<DiagnosisFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [menteeName, setMenteeName] = useState('');
  const [programId, setProgramId] = useState('prog-start');
  const [currentAxisIndex, setCurrentAxisIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allResponses, setAllResponses] = useState<AxisResponse[]>([]);
  const [currentResponse, setCurrentResponse] = useState('');

  const currentAxis = DIAGNOSIS_AXES[currentAxisIndex];
  const currentQuestion = currentAxis?.questions[currentQuestionIndex];
  const totalQuestions = DIAGNOSIS_AXES.reduce((sum, axis) => sum + axis.questions.length, 0);
  const answeredQuestions = allResponses.length;
  const progress = (answeredQuestions / totalQuestions) * 100;

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

  const handleQuestionSubmit = () => {
    if (!currentResponse.trim()) {
      alert('Por favor, forneça uma resposta antes de continuar.');
      return;
    }

    const score = calculateScoreFromResponse(currentResponse);

    const response: AxisResponse = {
      axisId: currentAxis.id,
      axisName: currentAxis.name,
      questionId: currentQuestion.id,
      questionText: currentQuestion.text,
      response: currentResponse,
      score
    };

    const newResponses = [...allResponses, response];
    setAllResponses(newResponses);
    setCurrentResponse('');

    if (currentQuestionIndex < currentAxis.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentAxisIndex < DIAGNOSIS_AXES.length - 1) {
      setCurrentAxisIndex(currentAxisIndex + 1);
      setCurrentQuestionIndex(0);
    } else {
      onComplete(menteeName, programId, newResponses);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const previousResponse = allResponses[allResponses.length - 1];
      setCurrentResponse(previousResponse?.response || '');
      setAllResponses(allResponses.slice(0, -1));
    } else if (currentAxisIndex > 0) {
      const previousAxis = DIAGNOSIS_AXES[currentAxisIndex - 1];
      setCurrentAxisIndex(currentAxisIndex - 1);
      setCurrentQuestionIndex(previousAxis.questions.length - 1);
      const previousResponse = allResponses[allResponses.length - 1];
      setCurrentResponse(previousResponse?.response || '');
      setAllResponses(allResponses.slice(0, -1));
    }
  };

  const calculateScoreFromResponse = (response: string): number => {
    const lowerResponse = response.toLowerCase();

    if (lowerResponse.includes('não') || lowerResponse.includes('nao') ||
        lowerResponse.includes('sem') || lowerResponse.includes('nunca')) {
      return 1.0;
    }

    if (lowerResponse.includes('às vezes') || lowerResponse.includes('parcial') ||
        lowerResponse.includes('básico') || lowerResponse.includes('pouco')) {
      return 2.5;
    }

    if (lowerResponse.includes('sim') || lowerResponse.includes('possui') ||
        lowerResponse.includes('realiza') || lowerResponse.includes('tem')) {
      return 4.0;
    }

    return 3.0;
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-100 to-slate-200 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl p-8 my-8">
        {step === 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Bem-vindo ao GrowUp CX</h1>
              <p className="text-slate-600">Vamos começar sua jornada de diagnóstico empresarial</p>
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

        {step === 2 && currentAxis && currentQuestion && (
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{currentAxis.name}</h2>
                  <p className="text-sm text-slate-500">
                    Questão {currentQuestionIndex + 1} de {currentAxis.questions.length}
                  </p>
                </div>
                <span className="text-sm text-slate-600">
                  {answeredQuestions} / {totalQuestions}
                </span>
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
                {currentQuestion.text}
              </h3>

              <textarea
                value={currentResponse}
                onChange={(e) => setCurrentResponse(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
                placeholder="Descreva a situação atual da empresa em relação a esta questão..."
                autoFocus
              />

              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Dica:</strong> Seja específico e detalhado. Quanto mais informações você fornecer,
                  melhor será o diagnóstico e as recomendações personalizadas.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {(currentQuestionIndex > 0 || currentAxisIndex > 0) && (
                <button
                  onClick={handleBack}
                  className="flex-1 bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl hover:bg-slate-300 transition-colors duration-200"
                >
                  Voltar
                </button>
              )}

              <button
                onClick={handleQuestionSubmit}
                className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {currentQuestionIndex < currentAxis.questions.length - 1
                  ? 'Próxima Questão'
                  : currentAxisIndex < DIAGNOSIS_AXES.length - 1
                  ? 'Próximo Eixo'
                  : 'Concluir Diagnóstico'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-500">
                Eixo {currentAxisIndex + 1} de {DIAGNOSIS_AXES.length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisFlow;
