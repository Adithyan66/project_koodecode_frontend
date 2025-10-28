

export interface Problem {
    problemNumber: ReactNode;
    category: any;
    completed: any;
    id: number;
    number: number;
    title: string;
    slug: string;
    acceptance: number;
    difficulty: 'Easy' | 'Med.' | 'Hard';
    status: 'solved' | 'attempted' | null;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasMore: boolean;
}

export interface ProblemsResponse {
    success: boolean;
    data: Problem[];
    pagination: Pagination;
}

export interface DifficultyOption {
    value: string;
    label: string;
}

export interface ProblemsFilters {
    search?: string;
    difficulty?: string;
    sortBy?: string;
    page: number;
    limit: number;
}