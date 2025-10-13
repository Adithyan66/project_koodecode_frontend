








import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from '../../../utils/debounce';
import type { Problem, ProblemsFilters } from '../../../types/problem-list';
import { ProblemService } from '../../../services/axios/user/problem-list';

const PROBLEMS_PER_PAGE = 20;

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
    setSearch: (search: string) => void;
    setDifficulty: (difficulty: string) => void;
    resetFilters: () => void;
    observerRef: React.RefObject<HTMLDivElement | null>;
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

    // Ref for the observer target element
    const observerRef = useRef<HTMLDivElement | null>(null);

    // Debounce search with 500ms delay
    const debouncedSearch = useDebounce(search, 500);

    const fetchProblems = useCallback(async (pageNum: number = 1, isLoadMore: boolean = false) => {
        // Prevent multiple simultaneous requests
        if (loading || loadingMore) return;

        if (isLoadMore) {
            setLoadingMore(true);
        } else {
            setLoading(true);
            setProblems([]);
        }

        try {
            const filters: ProblemsFilters = {
                search: debouncedSearch.trim() || undefined,
                difficulty: difficulty || undefined,
                page: pageNum,
                limit: PROBLEMS_PER_PAGE,
            };

            console.log('🔄 Fetching problems:', { page: pageNum, isLoadMore, filters });

            const response = await ProblemService.getProblems(filters);

            // Handle the nested data structure from your API
            const responseData = response.data || response;
            const newProblems = responseData.problems || [];
            const total = responseData.total || 0;
            const hasNextPage = responseData.hasNextPage || false;

            if (isLoadMore) {
                setProblems(prev => [...prev, ...newProblems]);
            } else {
                setProblems(newProblems);
                setTotalProblems(total);
            }

            setHasMore(hasNextPage);
            setPage(pageNum);

        } catch (error) {
            console.error('Failed to fetch problems:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [debouncedSearch, difficulty, loading, loadingMore]);

    const loadMoreProblems = useCallback(() => {
        if (hasMore && !loadingMore && !loading) {
            const nextPage = page + 1;
            console.log('📄 Loading more problems, page:', nextPage);
            fetchProblems(nextPage, true);
        }
    }, [hasMore, loadingMore, loading, page, fetchProblems]);

    const resetFilters = useCallback(() => {
        setSearch('');
        setDifficulty('');
        setPage(1);
        setProblems([]);
        setHasMore(true);
        setTotalProblems(0);
    }, []);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && hasMore && !loading && !loadingMore) {
                    console.log('👁️ Observer triggered - loading more problems');
                    loadMoreProblems();
                }
            },
            {
                root: null, // Use viewport as root
                rootMargin: '100px', // Trigger 100px before reaching the element
                threshold: 0.1, // Trigger when 10% of the element is visible
            }
        );

        const currentObserverRef = observerRef.current;
        if (currentObserverRef) {
            observer.observe(currentObserverRef);
        }

        return () => {
            if (currentObserverRef) {
                observer.unobserve(currentObserverRef);
            }
        };
    }, [hasMore, loading, loadingMore, loadMoreProblems]);

    // Effect to fetch problems when debounced search or difficulty changes
    useEffect(() => {
        console.log('🔍 Search/difficulty changed:', { debouncedSearch, difficulty });
        setPage(1);
        fetchProblems(1, false);
    }, [debouncedSearch, difficulty]);

    // Initial fetch on mount
    useEffect(() => {
        fetchProblems(1, false);
    }, []); // Empty dependency array for initial fetch only

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
        setSearch,
        setDifficulty,
        resetFilters,
        observerRef,
    };
};
