import React, { useState, useEffect, useRef } from 'react';
import { Program } from '../types';
import { SwitchHorizontalIcon } from '../constants';

interface HeaderProps {
  menteeName: string;
  programName: string;
  allPrograms: Program[];
  onChangeProgram: (programId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ menteeName, programName, allPrograms, onChangeProgram }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProgramSelect = (programId: string) => {
    onChangeProgram(programId);
    setIsDropdownOpen(false);
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Jornada do Mentorado</h1>
        <p className="text-slate-500 mt-1">
          Visão geral de {menteeName} • <span className="font-semibold text-indigo-600">{programName}</span>
        </p>
      </div>
      <div className="flex items-center gap-2 mt-4 sm:mt-0">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-white text-slate-700 font-semibold py-2 px-4 rounded-lg border border-slate-300 shadow-sm hover:bg-slate-50 transition-colors duration-200"
          >
            <SwitchHorizontalIcon />
            Mudar Programa
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 z-10">
              <div className="py-1">
                {allPrograms.map(program => (
                  <button
                    key={program.id}
                    onClick={() => handleProgramSelect(program.id)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    {program.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-200">
          Novo Diagnóstico
        </button>
      </div>
    </header>
  );
};

export default Header;