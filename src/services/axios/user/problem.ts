import httpClient from '../httpClient';
import type { ProblemsResponse, ProblemsFilters } from '../../../types/problem-list';



export interface BannerCard {
    id: number;
    bannerurl: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    bgGradient?: string;
  }
  
  export interface MockProblem {
    id: number;
    number: number;
    title: string;
    acceptance: number;
    difficulty: 'Easy' | 'Med.' | 'Hard';
    status?: 'solved' | 'attempted' | null;
  }
  
  export interface CalendarDay {
    date: number;
    solved: boolean;
    count?: number;
  }
  
  export interface ProblemsPageData {
    bannerCards: BannerCard[];
    problems: MockProblem[];
    solvedStats: {
      solved: number;
      total: number;
    };
    calendarData: CalendarDay[];
  }
  

interface ListPageDataResponse {
    success: boolean;
    message: string;
    data: {
        banners: BannerCard[];
        stats: {
            solved: number;
            total: number;
        };
        calendar: CalendarDay[];
    };
}

export class ProblemService {
    private static readonly BASE_URL = 'user/problems';

    static async getProblems(filters: ProblemsFilters): Promise<ProblemsResponse> {
        try {
            const params: Record<string, any> = {
                page: filters.page,
                limit: filters.limit,
            };

            if (filters.search) {
                params.search = filters.search;
            }

            if (filters.difficulty && filters.difficulty !== 'all') {
                params.difficulty = filters.difficulty;
            }

            if (filters.sortBy && filters.sortBy !== 'none') {
                params.sortBy = filters.sortBy;
            }

            const response = await httpClient.get(`${this.BASE_URL}/get-problems`, { params });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch problems:', error);
            throw error;
        }
    }

    static async getListPageData(): Promise<ListPageDataResponse> {
        try {
            const response = await httpClient.get(`${this.BASE_URL}/list-page-data`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch list page data:', error);
            throw error;
        }
    }
}

