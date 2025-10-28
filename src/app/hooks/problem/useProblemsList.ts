import { useState, useEffect, useRef } from 'react';
import { ProblemService } from '../../../services/axios/user/problem';
import type { Problem } from '../../../types/problem-list';
import type { BannerCard, CalendarDay } from '../../../data/problemsMockData';

const ITEMS_PER_PAGE = 10;

interface UseProblemsListReturn {
    search: string;
    setSearch: (search: string) => void;
    difficulty: 'all' | 'Easy' | 'Med.' | 'Hard';
    setDifficulty: (difficulty: 'all' | 'Easy' | 'Med.' | 'Hard') => void;
    sortBy: 'none' | 'acceptance-asc' | 'acceptance-desc';
    setSortBy: (sortBy: 'none' | 'acceptance-asc' | 'acceptance-desc') => void;
    problems: Problem[];
    currentPage: number;
    hasMore: boolean;
    totalItems: number;
    isLoading: boolean;
    isLoadingMore: boolean;
    observerRef: React.RefObject<HTMLDivElement>;
    banners: BannerCard[];
    stats: { solved: number; total: number };
    calendarData: CalendarDay[];
    toggleSort: () => void;
}

export const useProblemsList = (): UseProblemsListReturn => {
    const [search, setSearch] = useState('');
    const [difficulty, setDifficulty] = useState<'all' | 'Easy' | 'Med.' | 'Hard'>('all');
    const [sortBy, setSortBy] = useState<'none' | 'acceptance-asc' | 'acceptance-desc'>('none');
    const [problems, setProblems] = useState<Problem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const observerRef = useRef<HTMLDivElement>(null);
    const isLoadingRef = useRef(false);

    const [banners, setBanners] = useState<BannerCard[]>([]);
    const [stats, setStats] = useState({ solved: 0, total: 0 });
    const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);

    const fetchListPageData = async () => {
        try {
            const response = await ProblemService.getListPageData();
            setBanners(response.data.banners);
            setStats(response.data.stats);
            setCalendarData(response.data.calendar);
        } catch (error) {
            console.error('Failed to fetch list page data:', error);
        }
    };

    const fetchProblems = async (page: number, append: boolean = false) => {
        if (isLoadingRef.current) return;

        isLoadingRef.current = true;
        if (append) {
            setIsLoadingMore(true);
        } else {
            setIsLoading(true);
            setProblems([]);
        }

        try {
            const response = await ProblemService.getProblems({
                page,
                limit: ITEMS_PER_PAGE,
                search: search.trim() || undefined,
                difficulty: difficulty === 'all' ? undefined : difficulty,
                sortBy: sortBy === 'none' ? undefined : sortBy,
            });

            if (append) {
                setProblems(prev => [...prev, ...response.data]);
            } else {
                setProblems(response.data);
            }

            setHasMore(response.pagination.hasMore);
            setTotalItems(response.pagination.totalItems);
            setCurrentPage(page);
        } catch (error) {
            console.error('Failed to fetch problems:', error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
            isLoadingRef.current = false;
        }
    };

    useEffect(() => {
        fetchListPageData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        fetchProblems(1, false);
    }, [search, difficulty, sortBy]);

    useEffect(() => {
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            const entry = entries[0];
            
            if (entry.isIntersecting && hasMore && !isLoadingRef.current) {
                fetchProblems(currentPage + 1, true);
            }
        };

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.1,
            rootMargin: '200px'
        });

        const currentObserver = observerRef.current;
        if (currentObserver && hasMore) {
            observer.observe(currentObserver);
        }

        return () => {
            if (currentObserver) {
                observer.unobserve(currentObserver);
            }
        };
    }, [hasMore, currentPage]);

    const toggleSort = () => {
        if (sortBy === 'none') setSortBy('acceptance-desc');
        else if (sortBy === 'acceptance-desc') setSortBy('acceptance-asc');
        else setSortBy('none');
    };

    return {
        search,
        setSearch,
        difficulty,
        setDifficulty,
        sortBy,
        setSortBy,
        problems,
        currentPage,
        hasMore,
        totalItems,
        isLoading,
        isLoadingMore,
        observerRef,
        banners,
        stats,
        calendarData,
        toggleSort,
    };
};

