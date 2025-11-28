export type TaskId = string;

export type TaskStatus = 'Backlog' | 'Bounty Board' | 'To Do' | 'In Progress' | 'Community Review' | 'Done';

export interface Task {
    id: TaskId;
    columnId: string; // Maps to status
    content: string;
    tags?: string[];
    subtasks?: { id: string; content: string; completed: boolean }[];
    bounty?: string;
    assignee?: string;
    dueDate?: string; // ISO Date string YYYY-MM-DD
}
