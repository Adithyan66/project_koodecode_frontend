

import httpClient from '../httpClient';
import type{ ProblemsResponse, ProblemsFilters } from '../../../types/problem-list';

export class ProblemService {
    private static readonly BASE_URL = 'user/problems';

    static async getProblems(filters: ProblemsFilters): Promise<ProblemsResponse> {
        try {
            const params = { ...filters };
            // Remove undefined/null values
            Object.keys(params).forEach(key => {
                if (params[key] === undefined || params[key] === null || params[key] === '') {
                    delete params[key];
                }
            });

            const response = await httpClient.get(`${this.BASE_URL}/get-problems`, { params });
            return response.data.data;
        } catch (error) {
            console.error('Failed to fetch problems:', error);
            throw error;
        }
    }
}