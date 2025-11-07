

import httpClient from '../httpClient';
import type{ ProblemsResponse, ProblemsFilters } from '../../../types/problem-list';

export class ProblemService {
    private static readonly BASE_URL = 'user/problems';

    static async getProblems(filters: ProblemsFilters): Promise<ProblemsResponse> {
        try {
            const params = Object.entries(filters).reduce<Partial<ProblemsFilters>>((acc, [key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    acc[key as keyof ProblemsFilters] = value;
                }
                return acc;
            }, {});

            const response = await httpClient.get(`${this.BASE_URL}/get-problems`, { params });
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch problems:', error);
            throw error;
        }
    }
}