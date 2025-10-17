import React, { useState, useEffect } from 'react';
import type { Pillar, Task, Sprint, TaskPriority } from '../types';

interface SprintPlanningModalProps {
  isOpen: boolean;
  onClose: () => void;
  pillar: Pillar | null;
  programName: string;
  onCreateSprint: (sprint: Omit<Sprint, 'id'>) => void;
}

const SprintPlanningModal: React.FC<SprintPlanningModalProps> = ({ isOpen, onClose, pillar, programName, onCreateSprint }) => {
  const [sprintName, setSprintName] = useState('');
  const [sprintGoal, setSprintGoal] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // State for the detailed custom task input
  const [customTaskTitle, setCustomTaskTitle] = useState('');
  const [customTaskPriority, setCustomTaskPriority] = useState<TaskPriority>('medium');
  const [customTaskDueDate, setCustomTaskDueDate] = useState('');

  useEffect(() => {
    if (pillar) {
      // Reset all fields when a new pillar is selected
      setSprintName(`Sprint de Foco em ${pillar.name}`);
      setSprintGoal('');
      setTasks([]);
      setCustomTaskTitle('');
      setCustomTaskPriority('medium');
      setCustomTaskDueDate('');
    }
  }, [pillar]);

  if (!isOpen || !pillar) return null;
  
  const handleAddTask = () => {
    if (customTaskTitle.trim()) {
      const newTask: Task = {
        id: `custom-${Date.now()}`,
        title: customTaskTitle,
        isCustom: true,
        priority: customTaskPriority,
        dueDate: customTaskDueDate || null,
      };
      setTasks([...tasks, newTask]);
      setCustomTaskTitle('');
      setCustomTaskPriority('medium');
      setCustomTaskDueDate('');
    }
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pillar && sprintName && sprintGoal && tasks.length > 0) {
      onCreateSprint({
        pillarName: pillar.name,
        sprintName,
        sprintGoal,
        tasks
      });
    } else {
      alert("Por favor, preencha todos os campos e adicione ao menos uma tarefa.");
    }
  };

  const priorityClasses: { [key in TaskPriority]: string } = {
    low: 'bg-rag-blue-100 text-rag-blue-800',
    medium: 'bg-rag-yellow-100 text-rag-yellow-800',
    high: 'bg-rag-red-100 text-rag-red-800',
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Planejar Sprint</h2>
            <p className="text-sm text-slate-500">Foco em <span className="font-semibold">{pillar.name}</span></p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <form id="sprint-form" onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="sprintName" className="block text-sm font-medium text-slate-700 mb-1">Nome da Sprint</label>
            <input
              type="text"
              id="sprintName"
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label htmlFor="sprintGoal" className="block text-sm font-medium text-slate-700 mb-1">Meta da Sprint</label>
            <textarea
              id="sprintGoal"
              rows={2}
              value={sprintGoal}
              onChange={(e) => setSprintGoal(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: Implementar um novo sistema de follow-up com clientes."
              required
            />
          </div>
          
          <div className="space-y-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tarefas da Sprint</label>
                <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                   {tasks.map(task => (
                     <li key={task.id} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <div className="flex-grow">
                        <span className="text-sm text-slate-800">{task.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                          {task.priority && (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priorityClasses[task.priority]}`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                            </span>
                          )}
                          {task.dueDate && (
                            <span className="text-xs text-slate-500">{new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <button type="button" onClick={() => handleRemoveTask(task.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                      </div>
                     </li>
                   ))}
                </ul>

                {tasks.length === 0 && (
                  <div className="text-center py-4 px-2 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <p className="text-sm text-slate-500">Nenhuma tarefa adicionada ainda.</p>
                  </div>
                )}
              </div>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-2">Adicionar Tarefa Personalizada</p>
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
                    <input
                        type="text"
                        value={customTaskTitle}
                        onChange={(e) => setCustomTaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTask())}
                        placeholder="Título da tarefa"
                        className="sm:col-span-3 px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                    <select 
                        value={customTaskPriority} 
                        onChange={(e) => setCustomTaskPriority(e.target.value as TaskPriority)}
                        className="sm:col-span-1 px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                        <option value="low">Baixa</option>
                        <option value="medium">Média</option>
                        <option value="high">Alta</option>
                    </select>
                    <input
                        type="date"
                        value={customTaskDueDate}
                        onChange={(e) => setCustomTaskDueDate(e.target.value)}
                        className="sm:col-span-2 px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                </div>
                <button type="button" onClick={handleAddTask} className="w-full mt-3 bg-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 transition-colors text-sm">
                   Adicionar
                </button>
              </div>
          </div>
        </form>
        
        <div className="p-6 bg-slate-50 border-t border-slate-200 mt-auto">
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="bg-white text-slate-700 font-semibold py-2 px-4 rounded-lg border border-slate-300 shadow-sm hover:bg-slate-50 transition-colors duration-200">
              Cancelar
            </button>
            <button form="sprint-form" type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200 disabled:bg-indigo-300" disabled={tasks.length === 0}>
              Criar Sprint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintPlanningModal;