

export interface Problem {
    id: number;
    problemNumber: number;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    completed: boolean;
    category?: string;
    tags?: string[];
    slug: string;
}

export interface ProblemsResponse {
    problems: Problem[];
    total: number;
    page: number;
    limit: number;
}

export interface DifficultyOption {
    value: string;
    label: string;
}

export interface ProblemsFilters {
    search: string;
    difficulty: string;
    page: number;
    limit: number;
}