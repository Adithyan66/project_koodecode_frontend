

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../../../utils/debounce';
import type { Problem, ProblemsFilters } from '../../../types/problem-list';
import { ProblemService } from '../../../services/axios/user/problem-list';

const PROBLEMS_PER_PAGE = 10;

interface UseProblemsReturn {
    problems: Problem[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    totalProblems: number;
    currentPage: number;
    search: string;
    difficulty: string;
    debouncedSearch: string;
    fetchProblems: (pageNum?: number, isLoadMore?: boolean) => Promise<void>;
    loadMoreProblems: () => void;
    setSearch: (search: string) => void;
    setDifficulty: (difficulty: string) => void;
    resetFilters: () => void;
}

export const useProblems = (): UseProblemsReturn => {
    const [problems, setProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState<string>('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalProblems, setTotalProblems] = useState(0);

    const debouncedSearch = useDebounce(search, 500);

    const fetchProblems = useCallback(async (pageNum: number = 1, isLoadMore: boolean = false) => {
        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
            setProblems([]);
        }

        try {
            const filters: ProblemsFilters = {
                search: search || undefined,
                difficulty: difficulty || undefined,
                page: pageNum,
                limit: PROBLEMS_PER_PAGE,
            };

            const response = await ProblemService.getProblems(filters);
            const newProblems = response.problems;
            const total = response.total || 0;

            if (isLoadMore) {
                setProblems(prev => [...prev, ...newProblems]);
            } else {
                setProblems(newProblems);
                setTotalProblems(total);
            }

            const totalPages = Math.ceil(total / PROBLEMS_PER_PAGE);
            setHasMore(pageNum < totalPages);
            setPage(pageNum);

        } catch (error) {
            console.error('Failed to fetch problems:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [search, difficulty, page]);

    const loadMoreProblems = useCallback(() => {
        if (hasMore && !loadingMore) {
            const nextPage = page + 1;
            fetchProblems(nextPage, true);
        }
    }, [hasMore, loadingMore, page, fetchProblems]);

    const resetFilters = useCallback(() => {
        setSearch('');
        setDifficulty('');
        setPage(1);
        setProblems([]);
        setHasMore(true);
    }, []);

    // Reset page and refetch when filters change
    useEffect(() => {
        setPage(1);
        fetchProblems(1, false);
    }, [debouncedSearch, difficulty]);

    return {
        problems,
        loading,
        loadingMore,
        hasMore,
        totalProblems,
        currentPage: page,
        search,
        difficulty,
        debouncedSearch,
        fetchProblems,
        loadMoreProblems,
        setSearch,
        setDifficulty,
        resetFilters,
    };
};