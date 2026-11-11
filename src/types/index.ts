export type ID=string; export type Status='active'|'completed'|'paused'; export type Priority='low'|'medium'|'high';
export interface Goal{id:ID;title:string;area:string;why:string;targetDate:string;status:Status;createdAt:string}
export interface Project{id:ID;title:string;goalId:string;description:string;deadline:string;status:Status;createdAt:string}
export interface Task{id:ID;title:string;projectId:string;dueDate:string;priority:Priority;completed:boolean;estimate:number;createdAt:string}
export interface Note{id:ID;title:string;body:string;tags:string[];pinned:boolean;createdAt:string;updatedAt:string}
export interface Habit{id:ID;name:string;color:string;logs:string[]}
export interface JournalEntry{id:ID;date:string;win:string;learned:string;tomorrow:string;mood:number}
export interface FocusSession{id:ID;minutes:number;taskId:string;completedAt:string}
export interface AppSettings{name:string;dailyGoal:string;theme:'system'|'light'|'dark'}
export interface AppData{goals:Goal[];projects:Project[];tasks:Task[];notes:Note[];habits:Habit[];journal:JournalEntry[];sessions:FocusSession[];settings:AppSettings}
export type Page='dashboard'|'goals'|'projects'|'tasks'|'planner'|'focus'|'notes'|'habits'|'journal'|'achievements'|'analytics'|'settings';
