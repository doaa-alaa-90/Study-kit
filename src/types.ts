export type Lang = 'ar' | 'en';
export type Theme = 'light' | 'dark';
export type Priority = 'high' | 'medium' | 'low';

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: Priority;
  notes: string;
  completed: boolean;
  createdAt: string;
}

export interface Exam {
  id: string;
  name: string;
  subject: string;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  subject: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
