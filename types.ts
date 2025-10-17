import type React from 'react';

export type MaturityLevel = 'red' | 'yellow' | 'blue' | 'green';

export interface Pillar {
  name: string;
  score: number;
  maturityLevel: MaturityLevel;
  icon: React.ReactNode;
  sprints: number;
  tasksCompleted: number;
  tasksTotal: number;
}

export interface Program {
  id: string;
  name: string;
}

export interface Mentee {
  id: string;
  name: string;
  avatarUrl: string;
  programId: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  isCustom: boolean;
  priority?: TaskPriority;
  dueDate?: string | null;
}

export interface Sprint {
  id: string;
  pillarName: string;
  sprintName: string;
  sprintGoal: string;
  tasks: Task[];
}

export interface Activity {
    id: string;
    description: string;
    pillar: string;
    timestamp: string;
    maturityLevel: MaturityLevel;
}
